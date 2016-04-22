import test from 'tape'
import Hapi from 'hapi'

import authPlugin from '../auth'
import usersPlugin from './index'

test('[End to End] API.Users Plugin Integration with Hapi', (t) => {
  const server = new Hapi.Server()
  server.connection({ labels: ['api'] })


  server.register([
    require('hapi-auth-basic'),
    require('hapi-auth-jwt2'),
    authPlugin,
    usersPlugin,
  ], (err) => {
    if (err) t.fail(err.message)
    else t.pass('successfully loaded users plugin')
    t.end()
  })
})
