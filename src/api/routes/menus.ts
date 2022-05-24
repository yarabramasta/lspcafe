import { Router } from 'express';

import { addMenu, deleteMenu, getMenus, updateMenu } from '@/controllers/menus';
import authorization from '@/middlewares/authorization';
import roleGuard from '@/middlewares/role_guard';

const router = Router();

/**
 * @api {get} /api/menus Get all menus
 * @roles [cashier, manager]
 */
router.get('/menus', authorization, roleGuard('cashier', 'manager'), getMenus);
/**
 * @api {post} /api/menus Add menu
 * @roles [manager]
 */
router.post('/menus', authorization, roleGuard('manager'), addMenu);
/**
 * @api {put} /api/menus/:id Update menu
 * @roles [manager]
 */
router.put(
  '/menus/:id/update',
  authorization,
  roleGuard('manager'),
  updateMenu
);
/**
 * @api {delete} /api/menus/:id Delete menu
 * @roles [manager]
 */
router.delete(
  '/menus/:id/delete',
  authorization,
  roleGuard('manager'),
  deleteMenu
);
