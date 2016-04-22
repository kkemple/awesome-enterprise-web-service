/**
 * Sockets Plugin
 *
 * Uses socket.io for socket logic
 * Supports JWT authentication (same token support as API)
 * Scopes and authorization not handled!!
 */

import socketio from 'socket.io'
import socketioJwt from 'socketio-jwt'

import { AuthenticationError } from './errors'

// register method or Hapi plugin
module.exports.register = (server, options, next) => {
  const io = socketio(server.select('sockets').listener)
  const { User, Token } = server.app.models

  // verify token with DB lookup, also grab the associated user
  function verifyToken(token) {
    return Token.findOne({ where: { uuid: token.uuid }, include: [User] })
      .then((token) => {
        if (token) return token.user
        throw new AuthenticationError('Invalid Token!')
      })
  }

  // set up authorization on sockets
  io.set('authorization', socketioJwt.authorize({
    secret: server.app.secret,
    handshake: true,
  }))

  io.on('connection', (socket) => {
    // verfiy token before responding, otherwise kill connection
    verifyToken(socket.handshake.decoded_token)
      .then((user) => {
        socket.emit(`${user.email} connected`)

        // add logic for sockets
        socket.on('message', (message) => server.log('sockets', message))
      })
      .catch((err) => {
        socket.emit(err.message)
        socket.close()
      })
  })

  next()
}

module.exports.register.attributes = {
  name: 'sockets',
  version: '0.0.1',
}
