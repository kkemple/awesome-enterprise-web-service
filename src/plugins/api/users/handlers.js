import { UserNotFoundError } from './errors'

export function getUserHandler(req, reply) {
  const { user } = req.auth.credentials

  reply({
    success: true,
    payload: { user },
  })
}

export function getUserByIdHandler(req, reply) {
  const { User } = req.server.app.models

  User.findById(req.params.id)
    .then((user) => {
      if (!user) throw new UserNotFoundError()

      reply({
        success: true,
        payload: { user },
      })
    })
    .catch(UserNotFoundError, (err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(400))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function getActiveTokensByUserIdHandler(req, reply) {
  const { User } = req.server.app.models

  User.findById(req.params.id)
    .then((user) => user.activeTokens())
    .then((activeTokens) => reply({
      success: true,
      payload: { activeTokens: activeTokens || [] },
    }))
    .catch(UserNotFoundError, (err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(400))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function getInactiveTokensByUserIdHandler(req, reply) {
  const { User } = req.server.app.models

  User.findById(req.params.id)
    .then((user) => user.inactiveTokens())
    .then((inactiveTokens) => reply({
      success: true,
      payload: { inactiveTokens: inactiveTokens || [] },
    }))
    .catch(UserNotFoundError, (err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(400))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function getActiveTokensHandler(req, reply) {
  const { user } = req.auth.credentials

  user.activeTokens()
    .then((activeTokens) => reply({
      success: true,
      payload: { activeTokens: activeTokens || [] },
    }))
    .catch(UserNotFoundError, (err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(400))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function getInactiveTokensHandler(req, reply) {
  const { user } = req.auth.credentials

  user.inactiveTokens()
    .then((inactiveTokens) => reply({
      success: true,
      payload: { inactiveTokens: inactiveTokens || [] },
    }))
    .catch(UserNotFoundError, (err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(400))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function getUsersHandler(req, reply) {
  const { User } = req.server.app.models

  User.findAll()
    .then((users) => reply({
      success: true,
      payload: { users },
    }))
}

export function createUserHandler(req, reply) {
  const { User } = req.server.app.models

  User.create(req.payload)
    .then((user) => reply({
      success: true,
      payload: { user },
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function patchUserHandler(req, reply) {
  const { user } = req.auth.credentials

  user.update(req.payload)
    .then((user) => reply({
      success: true,
      payload: { user },
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function patchUserByIdHandler(req, reply) {
  const { User } = req.server.app.models

  User.findById(req.params.id)
    .then((user) => {
      if (!user) throw new UserNotFoundError()
      return user.update(req.payload)
    })
    .then((user) => reply({
      success: true,
      payload: { user },
    }))
    .catch(UserNotFoundError, (err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(400))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function putUserHandler(req, reply) {
  const { user } = req.auth.credentials

  user.update(req.payload)
    .then(user.reload)
    .then((user) => reply({
      success: true,
      payload: { user },
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function putUserByIdHandler(req, reply) {
  const { User } = req.server.app.models

  User.findById(req.params.id)
    .then((user) => {
      if (!user) throw new UserNotFoundError()
      return user.update(req.payload)
    })
    .then((user) => reply({
      success: true,
      payload: { user },
    }))
    .catch(UserNotFoundError, (err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(400))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function deleteUserHandler(req, reply) {
  const { user } = req.auth.credentials

  user.destroy()
    .then(() => reply({
      success: true,
    }))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}

export function deleteUserByIdHandler(req, reply) {
  const { User } = req.server.app.models

  User.findById(req.params.id)
    .then((user) => {
      if (!user) throw new UserNotFoundError()
      return user.destroy()
    })
    .then(() => reply({
      success: true,
    }))
    .catch(UserNotFoundError, (err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(400))
    .catch((err) => reply({
      success: false,
      error: err.name,
      message: err.message,
      stack: err.stack,
    }).code(500))
}
