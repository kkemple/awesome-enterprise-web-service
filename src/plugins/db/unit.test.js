import test from 'tape'
import sinon from 'sinon'

import dbPlugin from './index'
import createTokenModel from './token'
import createUserModel from './user'
import { AuthenticationError } from './errors'

test('[Unit] server/plugins/db/index.js', (t) => {
  t.equal(dbPlugin.register instanceof Function, true, 'should return a function')
  t.deepEqual(dbPlugin.register.attributes, {
    name: 'db',
    version: '0.0.1',
  }, 'should expose attributes')
  t.end()
})

test('[Unit] createTokenModel()', (t) => {
  t.plan(2)

  const sequelize = { define: sinon.stub().returns('test') }
  const hashMethod = () => {}

  const model = createTokenModel(sequelize, hashMethod, 'test')

  t.equal(sequelize.define.called, true, 'defines a sequalize model')
  t.equal(model, 'test', 'returns a sequalize model')
})

test('[Unit] createUserModel()', (t) => {
  t.plan(2)

  const sequelize = { define: sinon.stub().returns('test') }
  const hashMethod = () => {}

  const model = createUserModel(sequelize, hashMethod)

  t.equal(sequelize.define.called, true, 'defines a sequalize model')
  t.equal(model, 'test', 'returns a sequalize model')
})

test('[Unit] server/plugins/db/errors.js', (t) => {
  t.plan(3)

  t.equal((AuthenticationError.prototype instanceof Error), true, 'extends Error class')

  const err = new AuthenticationError('test')

  t.equal(err.name, 'AuthenticationError', 'error has proper name')
  t.equal(err.message, 'test', 'error passes message properly')
})
