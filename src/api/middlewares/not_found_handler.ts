import { NextFunction, Request, Response } from 'express';

import { HttpError } from '@/models/errors';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => next(new HttpError(404, 'Not found'));
