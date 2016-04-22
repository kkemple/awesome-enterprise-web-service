/**
 * Auth plugin
 *
 * Responsible for authentication logic
 */

import scopes from './scopes'
import { AuthenticationError } from './errors'
import { authenticationPayload } from './validations'

// validate token
function validateToken(token) {
  // error is no token found or if token is expired
  if (!token) return Promise.reject(new AuthenticationError('Invalid Token!'))
  if (token.isExpired()) return Promise.reject(new AuthenticationError('Token expired!'))

  // update token `updatedAt` prop to track usage
  return token.update({ updatedAt: new Date() })
    .then(token.reload)
    .then(() => token)
}

// validate function for basic auth plugin
function basic(request, email, password, next) {
  const { User } = request.server.app.models

  User.authenticate(email, password)
    .then((user) => next(null, true, {
      user,
      scope: scopes[user.get('role')],
      authType: 'basic',
    }))
    .catch((err) => next(err, false))
}

// validate function for JWT plugin
function jwt(decoded, request, next) {
  const { Token, User } = request.server.app.models

  Token
    .findOne({ where: { uuid: decoded.uuid }, include: [User] })
    .then(validateToken)
    .then((token) => token.user)
    .then((user) => next(null, true, {
      user,
      scope: scopes[user.get('role')],
      authType: 'basic',
    }))
    .catch((err) => {
      request.log('error', err)
      next(null, false)
    })
}

module.exports.register = (server, { prefix: prefix = '' } = {}, next) => {
  const api = server.select('api')

  api.auth.strategy('basic', 'basic', { validateFunc: basic })
  api.auth.strategy('jwt', 'jwt', {
    key: server.app.secret,
    validateFunc: jwt,
    verifyOptions: { algorithms: ['HS256'] },
  })

  api.auth.default({ strategies: ['basic', 'jwt'] })

  api.route({
    method: 'POST',
    path: `${prefix}/authenticate`,
    config: {
      tags: ['api', 'auth'],
      auth: false,
      validate: {
        payload: authenticationPayload,
      },
      handler: (req, reply) => {
        const { email, password } = req.payload
        const { User, Token } = req.server.app.models

        User.authenticate(email, password)
          .then((user) => Token.tokenize(user))
          .then((token) => reply({
            success: true,
            payload: { token },
          }))
          .catch((err) => reply({
            success: false,
            error: err.name,
            message: err.message,
            stack: err.stack,
          }).code(401))
      },
    },
  })

  next()
}

module.exports.register.attributes = {
  name: 'api.auth',
  version: '0.0.1',
}
