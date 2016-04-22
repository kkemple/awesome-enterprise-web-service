/**
 * Errors for auth plugin
 */

export class AuthenticationError extends Error {
  constructor(message = 'Authentication failed!') {
    super(message)
    this.message = message;
    this.name = 'AuthenticationError';
  }
}
