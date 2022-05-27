import { Router } from 'express';

import {
  addItemToCart,
  deleteItem,
  getItemsInCart,
  updateQty
} from '@/controllers/transactions';
import authorization from '@/middlewares/authorization';
import roleGuard from '@/middlewares/role_guard';

const router = Router();

/**
 * @api {get} /api/v1/cart Get all items in cart
 * @roles [cashier]
 */
router.get('/cart', authorization, roleGuard('cashier'), getItemsInCart);
/**
 * @api {post} /api/v1/cart Add menu to cart
 * @roles [cashier]
 */
router.post('/cart', authorization, roleGuard('cashier'), addItemToCart);

/**
 * @api {put} /api/v1/cart/item/:id/update Update quantity of menu in cart
 * @roles [cashier]
 */
router.put(
  '/cart/item/:id/update',
  authorization,
  roleGuard('cashier'),
  updateQty
);

/**
 * @api {delete} /api/v1/cart/item/:id/delete Delete menu from cart
 * @roles [cashier]
 */
router.delete(
  '/cart/item/:id/delete',
  authorization,
  roleGuard('cashier'),
  deleteItem
);

export default router;
