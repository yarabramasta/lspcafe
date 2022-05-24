import HttpError from './http_error';

class EntityNotFoundError extends HttpError {
  constructor(message: string) {
    super(404, message);
    this.name = 'EntityNotFoundError';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default EntityNotFoundError;
