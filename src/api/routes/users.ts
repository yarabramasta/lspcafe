import { Router } from 'express';

import {
  deleteUser,
  getUserById,
  getUsers,
  updateRole
} from '@/controllers/users';
import { UserRole } from '@/entities/user';
import authorization from '@/middlewares/authorization';
import roleGuard from '@/middlewares/role_guard';

const router = Router();
/**
 * @api {get} /users Get all users
 * @roles [admin]
 */
router.get('/users', authorization, roleGuard('admin'), getUsers);
/**
 * @api {get} /users/:id Get user by id
 * @roles [cashier, manager, admin]
 */
const roles: UserRole[] = ['cashier', 'manager', 'admin'];
router.get('/users/:id', authorization, roleGuard(...roles), getUserById);
/**
 * @api {put} /api/v1/users/:id/role Update user role
 * @roles [admin]
 */
router.put('/users/:id/role', authorization, roleGuard('admin'), updateRole);
/**
 * WARNING: This routes is only for development purposes.
 * @api {delete} /api/v1/users/:id/delete Delete user
 */
router.delete('/users/:id/delete', deleteUser);

export default router;
