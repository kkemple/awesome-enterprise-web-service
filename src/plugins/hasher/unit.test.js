import test from 'tape'

import hasherPlugin from './index'

test('[Unit] server/plugins/hasher/index.js', (t) => {
  t.equal(hasherPlugin.register instanceof Function, true, 'should return a function')
  t.deepEqual(hasherPlugin.register.attributes, {
    name: 'hasher',
    version: '0.0.1',
  }, 'should expose attributes')
  t.end()
})
