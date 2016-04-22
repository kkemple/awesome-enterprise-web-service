/**
 * Errors for db plugin
 */

export class InvalidDatabaseError extends Error {
  constructor(message = 'Invalid database specified!') {
    super(message)
    this.message = message;
    this.name = 'InvalidDatabaseError';
  }
}

export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed!') {
    super(message)
    this.message = message;
    this.name = 'AuthenticationError';
  }
}
