import HttpError from './http_error';

class UnauthorizedError extends HttpError {
  constructor(message: string) {
    super(401, message);
    this.name = 'UnauthorizedError';

    Error.captureStackTrace(this, UnauthorizedError);
  }
}

export default UnauthorizedError;
