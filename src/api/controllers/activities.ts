import { Request, Response } from 'express';

import { ActivityInput, activityRepo } from '@/entities/activity';
import { RequestWithUser } from '@/middlewares/authorization';

async function createLog(req: RequestWithUser<ActivityInput>, res: Response) {
  await activityRepo.insert(req.body);
  return res
    .status(201)
    .json({ message: `User ${req.user!.id}: ${req.body.action}` });
}

async function getAllActs(req: Request, res: Response) {
  const activities = await activityRepo.selectAll();
  return res.status(200).json({ activities });
}

export { createLog, getAllActs };
