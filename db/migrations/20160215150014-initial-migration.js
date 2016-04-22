'use strict';

const Promise = require('bluebird')

module.exports = {
  up: function (queryInterface, Sequelize) {
    const userTableConfig = {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },

      password: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          min: 6,
          max: 128,
        },
      },

      role: {
        type: Sequelize.ENUM,
        allowNull: false,
        defaultValue: 'user',
        values: ['user', 'admin', 'super'],
      },

      settings: {
        type: Sequelize.STRING,
      },

      createdAt: {
        type: Sequelize.DATE,
      },

      updatedAt: {
        type: Sequelize.DATE,
      },

      deletedAt: {
        type: Sequelize.DATE,
      },
    }

    const tokenTableConfig = {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        validate: {
          isUUID: 4,
        },
      },

      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },

      createdAt: {
        type: Sequelize.DATE,
      },

      updatedAt: {
        type: Sequelize.DATE,
      },

      deletedAt: {
        type: Sequelize.DATE,
      },
    }

    return Promise.each([
      { tableName: 'users', config: userTableConfig },
      { tableName: 'tokens', config: tokenTableConfig },
    ], (settings) => queryInterface.createTable(settings.tableName, settings.config))
  },

  down: function (queryInterface, Sequelize) {
    return Promise.each(['tokens', 'users'], (table) => queryInterface.dropTable(table))
  }
};
