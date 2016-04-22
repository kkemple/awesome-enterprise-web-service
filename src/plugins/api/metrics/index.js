import os from 'os'

function convertBytesToMegaBytes(bytes) {
  return Math.ceil(bytes / 1000000)
}

function convertUptimeToSeconds(uptime) {
  return Math.ceil(uptime)
}

function stringifySeconds(seconds) {
  return `${seconds}s`
}

function stringifyMilliseconds(ms) {
  return `${ms}ms`
}

function stringifyMegabytes(mb) {
  return `${mb}Mb`
}

function stringifyLoadAvg(avgs) {
  const cpuCount = os.cpus().length
  return avgs.map((avg) => `Load: ${avg}, CPUs: ${cpuCount}`)
}

module.exports.register = (server, { prefix: prefix = '' } = {}, next) => {
  const api = server.select('api')

  api.route([
    {
      method: 'GET',
      path: `${prefix}/healthcheck`,
      config: {
        auth: false,
        handler(req, reply) {
          reply({ status: 'ok' })
        },
      },
    },

    {
      method: 'GET',
      path: `${prefix}/metrics`,
      config: {
        auth: { scope: ['metrics:read'] },
        handler(req, reply) {
          reply({
            upTime: stringifySeconds(convertUptimeToSeconds(process.uptime())),
            totalMem: stringifyMegabytes(convertBytesToMegaBytes(os.totalmem())),
            loadAvg: stringifyLoadAvg(os.loadavg()),
            eventLoopDelay: stringifyMilliseconds(server.load.eventLoopDelay),
            heapUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.heapUsed)),
            memUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.rss)),
          })
        },
      },
    },

    {
      method: 'GET',
      path: `${prefix}/metrics/uptime`,
      config: {
        auth: { scope: ['metrics:read'] },
        handler(req, reply) {
          reply({ upTime: stringifySeconds(convertUptimeToSeconds(process.uptime())) })
        },
      },
    },

    {
      method: 'GET',
      path: `${prefix}/metrics/totalmem`,
      config: {
        auth: { scope: ['metrics:read'] },
        handler(req, reply) {
          reply({ totalMem: stringifyMegabytes(convertBytesToMegaBytes(os.totalmem())) })
        },
      },
    },

    {
      method: 'GET',
      path: `${prefix}/metrics/loadavg`,
      config: {
        auth: { scope: ['metrics:read'] },
        handler(req, reply) {
          reply({ loadAvg: stringifyLoadAvg(os.loadavg()) })
        },
      },
    },

    {
      method: 'GET',
      path: `${prefix}/metrics/serverload`,
      config: {
        auth: { scope: ['metrics:read'] },
        handler(req, reply) {
          reply({
            eventLoopDelay: stringifyMilliseconds(server.load.eventLoopDelay),
            heapUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.heapUsed)),
            memUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.rss)),
          })
        },
      },
    },

    {
      method: 'GET',
      path: `${prefix}/metrics/serverload/eventloopdelay`,
      config: {
        auth: { scope: ['metrics:read'] },
        handler(req, reply) {
          reply({
            eventLoopDelay: stringifyMilliseconds(server.load.eventLoopDelay),
          })
        },
      },
    },

    {
      method: 'GET',
      path: `${prefix}/metrics/serverload/heapused`,
      config: {
        auth: { scope: ['metrics:read'] },
        handler(req, reply) {
          reply({
            heapUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.heapUsed)),
          })
        },
      },
    },

    {
      method: 'GET',
      path: `${prefix}/metrics/serverload/memused`,
      config: {
        auth: { scope: ['metrics:read'] },
        handler(req, reply) {
          reply({
            memUsed: stringifyMegabytes(convertBytesToMegaBytes(server.load.rss)),
          })
        },
      },
    },
  ])

  next()
}

module.exports.register.attributes = {
  name: 'api.metrics',
  version: '0.0.1',
}
