/**
 * Config for application
 *
 * Config differs from app to app, and as such,
 * this implementation is intentionaly simple
 * as you will most likely want to replace with
 * whatever config loading methods you use
 */

import pkg from '../package.json'

module.exports = {
  local: {
    secret: 'secret',
    host: 'localhost',
    httpPort: 8080,
    tcpPort: 8081,
    swagger: {
      info: {
        title: pkg.name,
        version: pkg.version,
      },
    },
    logging: {
      reporters: [
        {
          reporter: require('good-console'),
          events: {
            log: '*',
            response: '*',
            error: '*',
            ops: '*',
          },
        },
      ],
    },
    db: {
      host: 'db.webservice.vm',
      username: 'root',
      database: 'webservice',
    },
    redis: {
      host: 'cache.webservice.vm',
      port: 6379,
      partition: 'webservice',
    },
    statsd: {
      host: 'statsd.webservice.vm',
      template: '{statusCode}.{method}.{path}',
      prefix: 'webservice',
    },
  },

  compose: {
    secret: 'secret',
    host: 'local.webservice.vm',
    httpPort: 8080,
    tcpPort: 8081,
    swagger: {
      info: {
        title: pkg.name,
        version: pkg.version,
      },
    },
    logging: {
      reporters: [
        {
          reporter: require('good-console'),
          events: {
            log: '*',
            response: '*',
            error: '*',
            ops: '*',
          },
        },
      ],
    },
    db: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      database: process.env.REDIS_DATABASE,
      partition: process.env.REDIS_PARTITION,
    },
    statsd: {
      host: process.env.STATSD_HOST,
      prefix: process.env.STATSD_PREFIX,
    },
  },

  test: {
    secret: 'secret',
    host: 'localhost',
    httpPort: 8080,
    tcpPort: 8081,
    swagger: {
      info: {
        title: pkg.name,
        version: pkg.version,
      },
    },
    logging: {
      reporters: [],
    },
    db: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      database: process.env.REDIS_DATABASE,
      partition: process.env.REDIS_PARTITION,
    },
    statsd: {
      host: process.env.STATSD_HOST,
      prefix: process.env.STATSD_PREFIX,
    },
  },

  development: {
    secret: process.env.SECRET,
    host: process.env.HOST,
    httpPort: process.env.HTTP_PORT,
    tcpPort: process.env.TCP_PORT,
    swagger: {
      info: {
        title: pkg.name,
        version: pkg.version,
      },
    },
    logging: {
      reporters: [
        {
          reporter: require('good-console'),
          events: {
            log: '*',
            response: '*',
            error: '*',
            ops: '*',
          },
        },
      ],
    },
    db: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      database: process.env.REDIS_DATABASE,
      partition: process.env.REDIS_PARTITION,
    },
    statsd: {
      host: process.env.STATSD_HOST,
      prefix: process.env.STATSD_PREFIX,
    },
  },

  production: {
    secret: process.env.SECRET,
    host: process.env.HOST,
    httpPort: process.env.HTTP_PORT,
    tcpPort: process.env.TCP_PORT,
    swagger: {
      info: {
        title: pkg.name,
        version: pkg.version,
      },
    },
    logging: {
      reporters: [
        {
          reporter: require('good-console'),
          events: {
            log: '*',
            response: '*',
            error: '*',
            ops: '*',
          },
        },
      ],
    },
    db: {
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      database: process.env.REDIS_DATABASE,
      partition: process.env.REDIS_PARTITION,
    },
    statsd: {
      host: process.env.STATSD_HOST,
      prefix: process.env.STATSD_PREFIX,
    },
  },
}
