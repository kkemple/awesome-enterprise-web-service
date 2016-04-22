export default (options = {}) => [
  { register: require('hapi-statsd'), options: options.statsd },
  { register: require('good'), options: options.logging },
  { register: require('../hasher') },
  { register: require('../db'), options: options.db },
]
