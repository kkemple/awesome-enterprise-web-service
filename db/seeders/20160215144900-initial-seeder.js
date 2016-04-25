'use strict';

const assign = require('lodash.assign')
const bcrypt = require('bcryptjs')
const uuid = require('uuid')

module.exports = {
  up: function (queryInterface, Sequelize) {
    const now = new Date()

    const userConfig = {
      email: 'test@test.com',
      role: 'super',
      createdAt: now,
      updatedAt: now,
    }

    const tokenConfig = {
      uuid: uuid.v4(),
      createdAt: now,
      updatedAt: now,
    }

    return new Promise(function(res, rej) {
      bcrypt.genSalt(10, (saltGenErr, salt) => {
        if (saltGenErr) return rej(saltGenErr)

        bcrypt.hash('test', salt, (hashErr, hash) => {
          if (hashErr) return rej(hashErr)

          const user = assign({}, userConfig, { password: hash })

          queryInterface
            .bulkInsert('users', [user])
            .then(res)
            .catch(rej)
        })
      })
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {})
  }
};
