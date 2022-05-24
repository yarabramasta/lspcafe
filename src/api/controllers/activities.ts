import { NextFunction, Request, Response } from 'express';

import { ActivityInput, activityRepo } from '@/entities/activity';
import { RequestWithUser } from '@/middlewares/authorization';
import { QueryError } from '@/models/errors';

async function createLog(req: RequestWithUser<ActivityInput>, res: Response) {
  await activityRepo.insert(req.user!.id, req.body);
  return res
    .status(201)
    .json({ message: `User ${req.user!.email}: ${req.body.action}` });
}

async function getAllActs(req: Request, res: Response, next: NextFunction) {
  try {
    const activities = await activityRepo.selectAll();
    return res.status(200).json({ activities });
  } catch (e: any) {
    next(new QueryError(e.message));
  }
}

export { createLog, getAllActs };
