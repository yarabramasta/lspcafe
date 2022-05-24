import HttpError from './http_error';

class ValidationError extends HttpError {
  constructor(message: string) {
    super(400, message);
    this.name = 'ValidationError';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ValidationError;
