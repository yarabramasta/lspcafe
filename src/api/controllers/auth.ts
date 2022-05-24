import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';

import { UserInput, userRepo } from '@/entities/user';
import { RequestWithUser } from '@/middlewares/authorization';
import { QueryError, ValidationError } from '@/models/errors';
import { createToken } from '@/services/token';

type RequestWithUserInputBody = Request<unknown, unknown, UserInput>;

async function authenticate(
  req: RequestWithUserInputBody,
  res: Response,
  next: NextFunction
) {
  const { email, password, role } = req.body;

  try {
    const exist = await userRepo.selectByEmail(email);
    if (!exist) {
      const user = await userRepo.insert(req.body);
      const token = createToken(user);
      return res.status(201).json({ user, token });
    }

    const match = await bcrypt.compare(password, exist.password);
    if (!match || role !== exist.role) {
      return next(new ValidationError('Email or password is incorrect'));
    } else {
      return res.status(200).json({ user: exist, token: createToken(exist) });
    }
  } catch (e: any) {
    if (e instanceof ValidationError) {
      return next(e);
    }
    return next(new QueryError(e.message));
  }
}

export function getProfile(req: RequestWithUser, res: Response) {
  return res.status(200).json({ profile: req.user! });
}

export { authenticate };
