import { Router } from 'express';

import QueryError from '@/models/query_error';
import { userRepo } from '@/repositories/user';

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
