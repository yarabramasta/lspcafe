import { Router } from 'express';

import { authenticate } from '@/controllers/auth';

const router = Router();

/**
 * @api {post} /auth Authenticate
 */
router.post('/auth', authenticate);

export default router;
