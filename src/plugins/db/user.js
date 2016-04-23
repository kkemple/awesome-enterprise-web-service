/**
 * Token Model
 *
 * Exports a factory function for creating Token models
 */

import omit from 'lodash.omit'
import bcrypt from 'bcryptjs'
import Promise from 'bluebird'
import { INTEGER, STRING, ENUM } from 'sequelize/lib/data-types'

import { AuthenticationError } from './errors'

const THIRTY_DAYS_AGO = new Date(new Date() - 30 * 24 * 60 * 60 * 1000)

// do bcrypt comparison of user password hash and plain text password
function comparePassword(password, user) {
  return new Promise((res, rej) => {
    bcrypt.compare(password, user.get('password'), (err, same) => {
      if (err || !same) {
        rej(new AuthenticationError('Invalid password!'))
        return
      }

      res(user)
    })
  })
}

export default function createUserModel(sequelize, hashMethod) {
  // promisify hash method (Hapi server methods use callback pattern)
  const asyncHash = Promise.promisify(hashMethod)

  const modelConfig = {
    id: {
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },

    email: {
      type: STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: STRING,
      allowNull: false,
      validate: {
        min: 6,
        max: 128,
      },
    },

    role: {
      type: ENUM,
      allowNull: false,
      defaultValue: 'user',
      values: ['user', 'admin', 'super'],
    },

    // treat settings as string, JSON parse and stringify before get/set
    settings: {
      type: STRING,
      get() {
        return JSON.parse(this.getDataValue('settings') || {})
      },
      set(settings) {
        this.setDataValue('settings', JSON.stringify(settings))
      },
    },
  }

  // add model options
  const options = {

    // add timestamps
    timestamps: true,

    // add model event hooks
    hooks: {

      // hash password before model creation
      beforeCreate(model) {
        return asyncHash(model.getDataValue('password'))
          .then((password) => {
            model.setDataValue('password', password)
            return Promise.resolve()
          })
          .catch((err) => Promise.reject(err))
      },

      // hash password (if changed) on model update
      beforeUpdate(model) {
        if (!model.changed('password')) return Promise.resolve()

        return asyncHash(model.getDataValue('password'))
          .then((password) => {
            model.setDataValue('password', password)
            return Promise.resolve()
          })
          .catch((err) => Promise.reject(err))
      },
    },

    // static class methods
    classMethods: {
      // authenticate via email / password
      authenticate(email, password) {
        // if no email or password error out
        if (!email) throw new AuthenticationError('Email is required!')
        if (!password) throw new AuthenticationError('Password is required!')

        // get user by email
        return this.findOne({ where: { email } })
          .then((user) => {
            // compare password if user is found
            if (user) return comparePassword(password, user)

            // if no user found error out
            throw new AuthenticationError('User not found!')
          })
      },
    },

    // class instance methods
    instanceMethods: {
      // override toJSON, omit password from user data
      toJSON() {
        return omit(this.dataValues, ['password'])
      },

      // get all active tokens associated with user
      activeTokens() {
        return this.getTokens({ where: { updatedAt: { $gt: THIRTY_DAYS_AGO } } })
      },

      // get all inactive tokens associated with user
      inactiveTokens() {
        return this.getTokens({ where: { updatedAt: { $lt: THIRTY_DAYS_AGO } } })
      },
    },
  }

  return sequelize.define('user', modelConfig, options)
}
