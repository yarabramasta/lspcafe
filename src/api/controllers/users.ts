import { NextFunction, Request, Response } from 'express';

import { userRepo } from '@/entities/user';
import { HttpError, QueryError } from '@/models/errors';

async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await userRepo.selectAll();
    return res.status(200).json({ users });
  } catch (e: any) {
    next(new QueryError(e.message));
  }
}

async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userRepo.selectById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({ user });
  } catch (e: any) {
    next(new QueryError(e.message));
  }
}

async function updateRole(req: Request, res: Response, next: NextFunction) {
  try {
    await userRepo.updateRole(req.params.id, req.body.role);
    return res.status(200).json({ message: 'User role updated' });
  } catch (e: any) {
    if (e instanceof HttpError) return next(e);
    next(new QueryError(e.message));
  }
}

/**
 * WARNING: This controller is only for development purposes.
 */
async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    await userRepo.delete(req.params.id);
    return res.status(200).json({ message: 'User deleted' });
  } catch (e: any) {
    if (e instanceof HttpError) return next(e);
    next(new QueryError(e.message));
  }
}

export { getUsers, getUserById, updateRole, deleteUser };
