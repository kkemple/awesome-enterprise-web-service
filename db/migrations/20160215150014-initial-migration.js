'use strict';

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
    }

    return queryInterface.createTable('users', userTableConfig)
      .then(() => queryInterface.createTable('tokens', tokenTableConfig))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('tokens')
      .then(() => queryInterface.dropTable('users'))
  }
};
