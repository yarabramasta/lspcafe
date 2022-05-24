import { NextFunction, Request, Response } from 'express';

import HttpError from '@/models/http_error';
import logger from '@/utils/logger';

import { isDev } from '../../config';

export const errorHandler = (
  e: any,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (e instanceof HttpError) {
    return res.status(e.status).json({
      type: isDev ? e.name : undefined,
      status: e.status,
      message: e.message
    });
  } else {
    logger.error(e);
    return res.status(500).json({
      type: isDev ? e.name : undefined,
      status: 500,
      message: e.message
    });
  }
};
