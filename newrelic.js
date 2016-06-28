import pkg from './package'

/**
 * New Relic agent configuration.
 *
 * See lib/config.defaults.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Whether or not to send data to New Relic (still boots up).
   */
  agent_enabled: false,
  /**
   * Array of application names.
   */
  app_name: [pkg.name],
  /**
   * Your New Relic license key.
   */
  license_key: process.env.NEWRELIC_LICENSE_KEY,
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: (process.env.NODE_ENV === 'production') ? 'error' : 'info',
  },
}
