import {
  createUserHandler,
  deleteUserHandler,
  deleteUserByIdHandler,
  getUserHandler,
  getUserByIdHandler,
  getUsersHandler,
  getActiveTokensHandler,
  getInactiveTokensHandler,
  patchUserHandler,
  patchUserByIdHandler,
  putUserHandler,
  putUserByIdHandler,
  getActiveTokensByUserIdHandler,
  getInactiveTokensByUserIdHandler,
} from './handlers'

import { userPostPayload } from './validations'

module.exports.register = (server, { prefix: prefix = '' } = {}, next) => {
  const api = server.select('api')

  api.route([
    {
      method: 'GET',
      path: `${prefix}/users`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:read'] },
        handler: getUsersHandler,
      },
    },

    {
      method: 'GET',
      path: `${prefix}/users/current`,
      config: {
        auth: { scope: ['users:read:current', 'users:read'] },
        tags: ['api', 'users'],
        handler: getUserHandler,
      },
    },

    {
      method: 'GET',
      path: `${prefix}/users/current/tokens/active`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:read'] },
        handler: getActiveTokensHandler,
      },
    },

    {
      method: 'GET',
      path: `${prefix}/users/current/tokens/inactive`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:read'] },
        handler: getInactiveTokensHandler,
      },
    },

    {
      method: 'GET',
      path: `${prefix}/users/{id}`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:read'] },
        handler: getUserByIdHandler,
      },
    },

    {
      method: 'GET',
      path: `${prefix}/users/{id}/tokens/active`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:read'] },
        handler: getActiveTokensByUserIdHandler,
      },
    },

    {
      method: 'GET',
      path: `${prefix}/users/{id}/tokens/inactive`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:read'] },
        handler: getInactiveTokensByUserIdHandler,
      },
    },

    {
      method: 'POST',
      path: `${prefix}/users`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:create'] },
        validate: {
          payload: userPostPayload,
        },
        handler: createUserHandler,
      },
    },

    {
      method: 'PATCH',
      path: `${prefix}/users/current`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:write', 'users:write:current'] },
        handler: patchUserHandler,
      },
    },

    {
      method: 'PATCH',
      path: `${prefix}/users/{id}`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:write'] },
        handler: patchUserByIdHandler,
      },
    },

    {
      method: 'PUT',
      path: `${prefix}/users/current`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:write', 'users:write:current'] },
        handler: putUserHandler,
      },
    },

    {
      method: 'PUT',
      path: `${prefix}/users/{id}`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:write'] },
        handler: putUserByIdHandler,
      },
    },

    {
      method: 'DELETE',
      path: `${prefix}/users/current`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:delete:current'] },
        handler: deleteUserHandler,
      },
    },

    {
      method: 'DELETE',
      path: `${prefix}/users/{id}`,
      config: {
        tags: ['api', 'users'],
        auth: { scope: ['users:delete'] },
        handler: deleteUserByIdHandler,
      },
    },
  ])

  next()
}

module.exports.register.attributes = {
  name: 'api.users',
  version: '0.0.1',
}
