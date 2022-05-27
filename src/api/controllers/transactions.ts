import { NextFunction, Request, Response } from 'express';

import { menuRepo } from '@/entities/menu';
import { TransactionItemInput, trxRepo } from '@/entities/transaction';
import { RequestWithUser } from '@/middlewares/authorization';
import { EntityNotFoundError, HttpError } from '@/models/errors';

async function addItemToCart(
  req: RequestWithUser<TransactionItemInput>,
  res: Response,
  next: NextFunction
) {
  const menu = await menuRepo.selectById(req.body.menu_id);
  if (menu) {
    if (menu.stock >= req.body.qty) {
      await trxRepo.insertItem(req.user?.id ?? '', req.body);
      await menuRepo.update(req.body.menu_id, {
        stock: menu.stock - req.body.qty
      });
      return res.status(201).json({ message: 'Menu added to cart.' });
    } else {
      next(new HttpError(400, 'Quantity exceeds stock.'));
    }
  } else {
    next(new EntityNotFoundError('Menu not found.'));
  }
}

async function getItemsInCart(req: RequestWithUser, res: Response) {
  const items = await trxRepo.selectItemInCart(req.user?.id ?? '');
  return res.status(200).json({ items });
}

async function updateQty(
  req: Request<
    { id: string },
    unknown,
    { menu_id: string; qty: number; type: 'min' | 'plus' }
  >,
  res: Response,
  next: NextFunction
) {
  await trxRepo.updateItemQty(req.params.id, req.body.menu_id, req.body.qty);
  const menu = await menuRepo.selectById(req.body.menu_id);
  if (menu) {
    if (req.body.type === 'min') {
      await menuRepo.update(req.body.menu_id, {
        stock: menu.stock + req.body.qty
      });
    } else {
      await menuRepo.update(req.body.menu_id, {
        stock: menu.stock - req.body.qty
      });
    }
    return res.status(200).json({ message: 'Quantity updated.' });
  }
  next(new EntityNotFoundError('Menu not found.'));
}

async function deleteItem(req: Request<{ id: string }>, res: Response) {
  await trxRepo.deleteItem(req.params.id);
  return res.status(200).json({ message: 'Item deleted.' });
}

export { addItemToCart, getItemsInCart, updateQty, deleteItem };
