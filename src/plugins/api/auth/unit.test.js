import test from 'tape'

import authPlugin from './index'

test('[Unit] server/plugins/api/auth/index.js', (t) => {
  t.equal(authPlugin.register instanceof Function, true, 'should return a function')
  t.deepEqual(authPlugin.register.attributes, {
    name: 'api.auth',
    version: '0.0.1',
  }, 'should expose attributes')
  t.end()
})
