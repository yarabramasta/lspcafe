import { Router } from 'express';

import { createLog, getAllActs } from '@/controllers/activities';
import authorization from '@/middlewares/authorization';
import roleGuard from '@/middlewares/role_guard';

const router = Router();

/**
 * @api {get} /api/v1/activities Get all activities
 * @roles [admin, manager]
 */
router.get('/act', authorization, roleGuard('admin', 'manager'), getAllActs);
/**
 * @api {post} /api/v1/activities User activities logging
 */
router.post('/act', authorization, createLog);

export default router;
