export class UserNotFoundError extends Error {
  constructor(message = 'User not found!') {
    super(message)
    this.message = message;
    this.name = 'UserNotFoundError';
  }
}
