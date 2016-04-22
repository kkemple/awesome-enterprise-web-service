import Hapi from 'hapi'
import test from 'tape'
import RedisEngine from 'catbox-redis'

import dbPlugin from '../../db'
import hasherPlugin from '../../hasher'
import authPlugin from '../auth'
import metricsPlugin from './index'

test('[End to End] metrics endpoints', (t) => {
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

  server.app.secret = process.env.SECRET

  const dbConfig = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
  }

  server.register([
    { register: require('hapi-auth-basic') },
    { register: require('hapi-auth-jwt2') },
    { register: hasherPlugin },
    { register: dbPlugin, options: dbConfig },
    { register: authPlugin, options: { prefix: '/api' } },
    { register: metricsPlugin, options: { prefix: '/api' } },
  ], (err) => {
    if (err) t.fail('failed to load metrics plugin for end to end tests')

    server.inject({
      url: '/api/authenticate',
      method: 'POST',
      payload: {
        email: 'test@test.com',
        password: 'test',
      },
    }, (response) => {
      const { token } = response.result.payload
      const headers = { authorization: token }

      t.test('GET /api/healthcheck', (t) => {
        t.plan(1)

        server.inject('/api/healthcheck', (response) => {
          t.equal(response.result.status, 'ok', 'healthcheck returns "ok"')
        })
      })

      t.test('GET /api/metrics', (t) => {
        t.plan(6)

        server.inject({
          url: '/api/metrics',
          method: 'GET',
          headers,
        }, (response) => {
          t.true(response.result.upTime, 'metrics returns upTime')
          t.true(response.result.totalMem, 'metrics returns totalMem')
          t.true(response.result.loadAvg, 'metrics returns loadAvg')
          t.true(response.result.serverLoad.eventLoopDelay, 'metrics returns eventLoopDelay')
          t.true(response.result.serverLoad.heapUsed, 'metrics returns heapUsed')
          t.true(response.result.serverLoad.memUsed, 'metrics returns memUsed')
        })
      })

      t.test('GET /api/metrics/uptime', (t) => {
        t.plan(1)

        server.inject({
          url: '/api/metrics/uptime',
          method: 'GET',
          headers,
        }, (response) => {
          t.true(response.result.upTime, 'returns upTime')
        })
      })

      t.test('GET /api/metrics/totalmem', (t) => {
        t.plan(1)

        server.inject({
          url: '/api/metrics/totalmem',
          method: 'GET',
          headers,
        }, (response) => {
          t.true(response.result.totalMem, 'returns totalMem')
        })
      })

      t.test('GET /api/metrics/loadavg', (t) => {
        t.plan(1)

        server.inject({
          url: '/api/metrics/loadavg',
          method: 'GET',
          headers,
        }, (response) => {
          t.true(response.result.loadAvg, 'returns loadAvg')
        })
      })

      t.test('GET /api/metrics/serverload', (t) => {
        t.plan(3)

        server.inject({
          url: '/api/metrics/serverload',
          method: 'GET',
          headers,
        }, (response) => {
          t.true(response.result.eventLoopDelay, 'metrics returns eventLoopDelay')
          t.true(response.result.heapUsed, 'metrics returns heapUsed')
          t.true(response.result.memUsed, 'metrics returns memUsed')
        })
      })

      t.test('GET /api/metrics/serverload/eventloopdelay', (t) => {
        t.plan(1)

        server.inject({
          url: '/api/metrics/serverload/eventloopdelay',
          method: 'GET',
          headers,
        }, (response) => {
          t.true(response.result.eventLoopDelay, 'returns eventLoopDelay')
        })
      })

      t.test('GET /api/metrics/serverload/heapused', (t) => {
        t.plan(1)

        server.inject({
          url: '/api/metrics/serverload/heapused',
          method: 'GET',
          headers,
        }, (response) => {
          t.true(response.result.heapUsed, 'returns heapUsed')
        })
      })

      t.test('GET /api/metrics/serverload/memused', (t) => {
        t.plan(1)

        server.inject({
          url: '/api/metrics/serverload/memused',
          method: 'GET',
          headers,
        }, (response) => {
          t.true(response.result.memUsed, 'returns memUsed')
        })
      })
    })
  })
})
