/**
 * Token Model
 *
 * Exports a factory function for creating Token models
 */

import jwt from 'jsonwebtoken'
import uuid from 'uuid'
import { INTEGER, UUID } from 'sequelize/lib/data-types'

// amount of time an unused token is good for
const THIRTY_DAYS_AGO = new Date(new Date() - 30 * 24 * 60 * 60 * 1000)

export default function createTokenModel(sequelize, hashMethod, secret) {
  // define our model schema
  const modelConfig = {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    uuid: {
      type: UUID,
      allowNull: false,
      validate: {
        isUUID: 4,
      },
    },
  }

  // add model options
  const options = {

    // add timestamps
    timestamps: true,

    // soft deletes - updates deletedAt col instead of removing data
    paranoid: true,

    // static class methods
    classMethods: {
      tokenize(user) {
        const v4String = uuid.v4()

        // create a new token, then create JWT from new token and return it
        return this.create({ userId: user.get('id'), uuid: v4String })
          .then((token) => jwt.sign({
            uuid: token.get('uuid'),
            id: user.get('id'),
            email: user.get('email'),
            role: user.get('role'),
          }, secret))
      },
    },

    // class instance methods
    instanceMethods: {
      isExpired() {
        // check if token was used in last 30 days
        return this.get('updatedAt') < THIRTY_DAYS_AGO
      },
    },
  }

  return sequelize.define('token', modelConfig, options)
}
