import { NextFunction, Response } from 'express';

import { UserRole } from '@/entities/user';
import { UnauthorizedError } from '@/models/errors';

import { RequestWithUser } from './authorization';

export default function (...role: UserRole[]) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!role.includes(req.user!.role)) {
      return next(new UnauthorizedError('Unauthorized'));
    }
    next();
  };
}
