import test from 'tape'

import baseConfig from './base'
import apiConfig from './api'
import socketsConfig from './sockets'

test('[Unit] src/server/plugins/config/base.js', (t) => {
  t.equal(baseConfig instanceof Function, true, 'should return a function')
  t.equal(baseConfig() instanceof Array, true, 'should be an array')
  t.end()
})

test('[Unit] src/server/plugins/config/api.js', (t) => {
  t.equal(typeof apiConfig, 'function', 'should return a function')
  t.equal(typeof apiConfig(), typeof [], 'should be an array')
  t.end()
})

test('[Unit] src/server/plugins/config/sockets.js', (t) => {
  t.equal(typeof socketsConfig, 'function', 'should return a function')
  t.equal(typeof socketsConfig(), typeof [], 'should be an array')
  t.end()
})
