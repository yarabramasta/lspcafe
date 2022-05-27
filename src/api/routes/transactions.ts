import { Router } from 'express';

import {
  addItemToCart,
  addTransaction,
  deleteItem,
  getItemsInCart,
  getTransactions,
  qtyMin,
  qtyPlus
} from '@/controllers/transactions';
import authorization from '@/middlewares/authorization';
import roleGuard from '@/middlewares/role_guard';

const router = Router();

/**
 * @api {get} /api/v1/trx Add transaction
 * @roles [cashier]
 */
router.get(
  '/trx',
  authorization,
  roleGuard('cashier', 'manager'),
  getTransactions
);
/**
 * @api {post} /api/v1/trx Get all transactions
 * @roles [cashier]
 */
router.post('/trx', authorization, roleGuard('cashier'), addTransaction);
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
 * @api {put} /api/v1/cart/item/:id/min -1 quantity of menu in cart
 * @roles [cashier]
 */
router.put('/cart/item/:id/min', authorization, roleGuard('cashier'), qtyMin);
/**
 * @api {put} /api/v1/cart/item/:id/plus +1 quantity of menu in cart
 * @roles [cashier]
 */
router.put('/cart/item/:id/plus', authorization, roleGuard('cashier'), qtyPlus);
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
