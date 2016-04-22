import test from 'tape'
import Hapi from 'hapi'
import RedisEngine from 'catbox-redis'

import dbPlugin from '../db'
import hasherPlugin from '../hasher'
import socketsPlugin from './index'

test('[End to End] Sockets Plugin Integration with Hapi', (t) => {
  const server = new Hapi.Server({
    cache: {
      name: 'redis',
      engine: RedisEngine,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      partition: process.env.REDIS_PARTITION,
    },
  })
  server.connection({ labels: ['sockets'] })

  const dbOptions = {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    username: process.env.MYSQL_USERNAME,
  }

  // sockets needs db and server-methods for models
  server.register([
    { register: hasherPlugin },
    { register: dbPlugin, options: dbOptions },
  ], (err) => {
    if (err) t.fail(err.message)

    server.register(socketsPlugin, (err) => {
      if (err) t.fail(err.message)
      else t.pass('successfully loaded sockets plugin')
      t.end()
    })
  })
})
