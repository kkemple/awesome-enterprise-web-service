import Hapi from 'hapi'
import test from 'tape'
import RedisEngine from 'catbox-redis'

import authPlugin from './index'
import dbPlugin from '../../db'
import hasherPlugin from '../../hasher'

test('[End to End] auth endpoints', (t) => {
  const server = new Hapi.Server({
    cache: {
      name: 'redis',
      engine: RedisEngine,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      partition: process.env.REDIS_PARTITION,
    },
  })

  server.connection({
    host: 'localhost',
    port: 80,
    labels: ['api'],
  })

  const dbConfig = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
  }

  server.app.secret = process.env.SECRET

  server.register([
    { register: require('hapi-auth-basic') },
    { register: require('hapi-auth-jwt2') },
    { register: hasherPlugin },
    { register: dbPlugin, options: dbConfig },
    { register: authPlugin, options: { prefix: '/api' } },
  ], (err) => {
    if (err) {
      console.log(err)
      t.fail('failed to load metrics plugin for end to end tests')
    }

    t.test('GET /api/authenticate', (t) => {
      t.plan(1)

      const data = {
        email: 'test@test.com',
        password: 'test',
      }

      server.inject({
        url: '/api/authenticate',
        payload: data,
        method: 'POST',
      }, (response) => {
        t.equal(response.result.success, true, 'authentication method working as expected')
      })
    })
  })
})
