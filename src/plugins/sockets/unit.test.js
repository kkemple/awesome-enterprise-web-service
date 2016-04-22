import test from 'tape'

import socketsPlugin from './index'

test('[Unit] server/plugins/sockets/index.js', (t) => {
  t.equal(socketsPlugin.register instanceof Function, true, 'should return a function')
  t.deepEqual(socketsPlugin.register.attributes, {
    name: 'sockets',
    version: '0.0.1',
  }, 'should expose attributes')
  t.end()
})
