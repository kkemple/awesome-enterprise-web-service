/**
 * DB Plugin
 *
 * Defaults to MySQL for db type, supports any type Sequelize supports
 * Responisble for connection to DB, Creating and mounting ORM and Models
 */

import assign from 'lodash.assign'
import flattenDeep from 'lodash.flattendeep'
import Sequelize from 'sequelize'


// Model factory methods
import createUserModel from './user'
import createTokenModel from './token'


// register method for Hapi plugin
module.exports.register = (server, {
  host: host = 'localhost',
  database: database = undefined,
  username: username = undefined,
  password: password = undefined,
  dialect: dialect = 'mysql',
}, next) => {
  // build sequelize config object, pass server.log so logging is uniform
  const config = {
    host,
    dialect,
    username,
    password,
    logging: server.log.bind(server, dialect),
  }

  // get instance of sequelize and models
  const sequelize = new Sequelize(database, username, password, config)
  const User = createUserModel(sequelize, server.methods.hash)
  const Token = createTokenModel(sequelize, server.methods.hash, server.app.secret)

  // build model associations
  User.hasMany(Token)
  Token.belongsTo(User)

  // attach ORM and models to server
  server.app.orm = sequelize
  server.app.models = { User, Token }

  // sync with DB
  sequelize.sync()
    .then(() => {
      // get all server connection labels
      const labels = flattenDeep(server.connections.map((c) => c.settings.labels))

      // log good connection
      server.log([dialect].concat(labels), 'database synced')
      next()
    })
    .catch((err) => {
      // log bad connection
      server.log('error', err)
      next(err)
    })
}

module.exports.register.attributes = {
  name: 'db',
  version: '0.0.1',
}
