import Joi from 'joi'

export const authenticationPayload = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/[a-zA-Z0-9@-_]{3,30}/).required(),
}

export const resetPasswordPayload = {
  email: Joi.string().email().required(),
  url: Joi.string().required(),
}
