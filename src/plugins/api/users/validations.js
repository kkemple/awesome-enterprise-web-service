import Joi from 'joi'

export const userValidation = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/[a-zA-Z0-9@-_]{3,30}/).required(),
}

export const userPostPayload = {
  email: Joi.string().email().required(),
  password: Joi.string().regex(/[a-zA-Z0-9@-_]{3,30}/).required(),
  role: Joi.string(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  deletedAt: Joi.date(),
}
