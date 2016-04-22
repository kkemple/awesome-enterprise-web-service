/**
 * Hasher Plugin
 *
 * Uses bcrypt to hash passwords
 */

import bcrypt from 'bcryptjs'

const THIRTY_DAYS = 30 * 60 * 1000
const TEN_SECONDS = 10 * 1000

module.exports.register = (server, options, next) => {
  function hash(password, next) {
    // create salt for hash
    bcrypt.genSalt(10, (saltGenErr, salt) => {
      if (saltGenErr) {
        next(saltGenErr)
        return
      }

      // create hash
      bcrypt.hash(password, salt, (hashErr, hash) => {
        if (hashErr) {
          next(hashErr)
          return
        }

        // return hash
        next(null, hash)
      })
    })
  }

  // attach as server method so we can cache hashes, save :clock:
  server.method('hash', hash, {
    cache: {
      cache: 'redis',
      expiresIn: THIRTY_DAYS,
      generateTimeout: TEN_SECONDS,
    },
  })

  next()
}

module.exports.register.attributes = {
  name: 'hasher',
  version: '0.0.1',
}
