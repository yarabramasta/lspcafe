class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export default HttpError;
