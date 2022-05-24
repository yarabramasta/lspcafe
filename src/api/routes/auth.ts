import { Router } from 'express';

import { authenticate, getProfile } from '@/controllers/auth';
import authorization from '@/middlewares/authorization';

const router = Router();

/**
 * @api {post} /auth Authenticate
 */
router.post('/auth', authenticate);
/**
 * @api {get} /auth/profile Get profile of current signed user
 */
router.get('/auth/profile', authorization, getProfile);

export default router;
