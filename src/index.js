/**
 * Responsible for constructing and starting the server
 */

// require('newrelic')

import Hapi from 'hapi'
import RedisEngine from 'catbox-redis'

// load server config
import config from './config'

// load plugin config fetchers
import getBasePluginConfig from './plugins/config/base'
import getApiPluginConfig from './plugins/config/api'
import getSocketsPluginConfig from './plugins/config/sockets'


// registers a group of plugins, returns a promise
const getRegisterPromise = (server, pluginConfigFetcher, appConfig) => new Promise((res, rej) => {
  server.register(pluginConfigFetcher(appConfig), (err) => {
    if (err) {
      server.log('error', err)
      rej(err)
    }

    res()
  })
})

// starts the server
function start() {
  // env and env config for server
  const env = process.env.NODE_ENV || 'local'
  const envConfig = config[env]

  const server = new Hapi.Server({
    load: {
      sampleInterval: 1000,
    },

    connections: {
      routes: {
        cors: true,
      },
    },

    cache: {
      name: 'redis',
      engine: RedisEngine,
      host: envConfig.redis.host,
      port: envConfig.redis.port,
      partition: envConfig.redis.partition,
    },
  })

  // set app secret
  server.app.secret = envConfig.secret

  // set the connections
  server.connection({
    host: envConfig.host,
    port: envConfig.httpPort,
    labels: ['api'],
  })

  server.connection({
    host: envConfig.host,
    port: envConfig.tcpPort,
    labels: ['sockets'],
  })

  // get the servers
  const apiServer = server.select('api')
  const socketsServer = server.select('sockets')

  // set plugins on corresponding servers
  const registerPromises = [
    getRegisterPromise(server, getBasePluginConfig, envConfig),
    getRegisterPromise(apiServer, getApiPluginConfig, envConfig),
    getRegisterPromise(socketsServer, getSocketsPluginConfig, envConfig),
  ]

  // register all plugins
  return Promise.all(registerPromises)
    .then(() => {
      // start the server
      server.start(() => {
        apiServer.log('api', `API server running at ${apiServer.info.uri}`)
        socketsServer.log('websocket', `Websocket server running at ${socketsServer.info.uri}`)
      })
    })
}

// initiate server
start()
