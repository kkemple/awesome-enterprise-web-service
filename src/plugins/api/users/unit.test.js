import test from 'tape'

import usersPlugin from './index'

test('[Unit] server/plugins/api/users/index.js', (t) => {
  t.equal(usersPlugin.register instanceof Function, true, 'should return a function')
  t.deepEqual(usersPlugin.register.attributes, {
    name: 'api.users',
    version: '0.0.1',
  }, 'should expose attributes')
  t.end()
})
