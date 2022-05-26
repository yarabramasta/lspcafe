import { Router } from 'express';

import { addItemToCart, getItemsInCart } from '@/controllers/transactions';
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

export default router;
