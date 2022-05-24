import { NextFunction, Request, Response } from 'express';

import { UserResult, userRepo } from '@/entities/user';
import { UnauthorizedError } from '@/models/errors';
import { decodeToken } from '@/services/token';

export interface RequestWithUser<B = unknown>
  extends Request<unknown, unknown, B> {
  user?: UserResult;
}

export default async function (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  const header = req.headers['Authorization'] as string;
  const token = header?.split(' ')[1];

  if (!token) {
    return next(new UnauthorizedError('No token provided'));
  }

  const decoded = await decodeToken(token);
  const exist = await userRepo.selectById(decoded.id);
  if (!exist) {
    return next(new UnauthorizedError('Invalid token'));
  }

  req.user = exist;
  next();
}
