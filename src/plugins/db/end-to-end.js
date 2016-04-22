import test from 'tape'
import Hapi from 'hapi'
import RedisEngine from 'catbox-redis'

import dbPlugin from './index'
import hasherPlugin from '../hasher'

test('[End to End] DB Plugin Integration with Hapi', (t) => {
  const server = new Hapi.Server({
    cache: {
      name: 'redis',
      engine: RedisEngine,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      partition: process.env.REDIS_PARTITION,
    },
  })
  server.connection({ labels: [] })

  const dbOptions = {
    host: 'db.webservice.vm',
    database: 'webservice',
    username: 'root',
  }

  // db needs hasher for models
  server.register(hasherPlugin, () => {
    server.register({
      register: dbPlugin,
      options: dbOptions,
    }, (err) => {
      if (err) t.fail(err.message)
      else t.pass('successfully loaded db plugin')
      t.end()
    })
  })
})
