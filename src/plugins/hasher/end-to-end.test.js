import test from 'tape'
import Hapi from 'hapi'
import RedisEngine from 'catbox-redis'

import hasherPlugin from './index'

test('[End to End] Hasher Plugin Integration with Hapi', (t) => {
  const server = new Hapi.Server({
    cache: {
      name: 'redis',
      engine: RedisEngine,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      partition: process.env.REDIS_PARTITION,
    },
  })

  server.register(hasherPlugin, (err) => {
    if (err) t.fail(err.message)
    else t.pass('successfully loaded hasher plugin')
    t.end()
  })
})
