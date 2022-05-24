import { Router } from 'express';

import { userRepo } from '@/entities/user';
import { QueryError } from '@/models/errors';

const router = Router();

router.get('/users', async (req, res, next) => {
  try {
    const users = await userRepo.selectAll();
    res.status(200).json({ users });
  } catch (e: any) {
    next(new QueryError(e.message));
  }
});

export default router;
