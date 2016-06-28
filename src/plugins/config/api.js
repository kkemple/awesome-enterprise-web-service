/* eslint-disable global-require */
export default (options = {}) => [
  { register: require('inert') },
  { register: require('vision') },
  { register: require('hapi-auth-basic') },
  { register: require('hapi-auth-jwt2') },
  { register: require('hapi-swagger'), options: options.swagger },
  { register: require('../api/auth'), options: { prefix: '/api' } },
  { register: require('../api/metrics'), options: { prefix: '/api' } },
  { register: require('../api/users'), options: { prefix: '/api' } },
]
