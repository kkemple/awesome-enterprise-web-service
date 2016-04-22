/**
 * Holds database config for sequelize cli commands
 */

const assign = require('lodash.assign')

const config = {
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
}

module.exports = {
  local: assign({}, config, { seederStorage: 'sequelize' }),
  compose: assign({}, config, { seederStorage: 'sequelize' }),
  test: assign({}, config, { seederStorage: 'sequelize' }),
  production: config,
}
