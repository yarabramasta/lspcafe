class QueryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QueryError';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default QueryError;
