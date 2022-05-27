import { NextFunction, Request, Response } from 'express';

import { menuRepo } from '@/entities/menu';
import {
  TransactionInput,
  TransactionItemInput,
  trxRepo
} from '@/entities/transaction';
import { RequestWithUser } from '@/middlewares/authorization';
import { EntityNotFoundError, HttpError } from '@/models/errors';

async function addTransaction(
  req: RequestWithUser<TransactionInput>,
  res: Response
) {
  await trxRepo.insertTransaction(req.user?.id ?? '', req.body);
  return res.status(201).json({ message: 'Transaction created.' });
}

async function getTransactions(req: RequestWithUser, res: Response) {
  const transactions = await trxRepo.selectTransactionsByUserId(
    req.user?.id ?? ''
  );
  return res.status(200).json({ transactions });
}

async function addItemToCart(
  req: RequestWithUser<TransactionItemInput>,
  res: Response,
  next: NextFunction
) {
  const menu = await menuRepo.selectById(req.body.menu_id);
  if (menu) {
    if (menu.stock >= 1) {
      await trxRepo.insertItem(req.user?.id ?? '', req.body);
      await menuRepo.update(req.body.menu_id, {
        stock: menu.stock - 1
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

async function qtyMin(
  req: Request<{ id: string }, unknown, { menu_id: string }>,
  res: Response
) {
  const menu = await menuRepo.selectById(req.body.menu_id);
  const item = await trxRepo.selectItemById(req.params.id);
  if (menu) {
    await trxRepo.updateItemQty(req.params.id, req.body.menu_id, item.qty - 1);
    await menuRepo.update(req.body.menu_id, { stock: menu.stock + 1 });
    return res.status(200).json({ message: 'Quantity updated.' });
  }
}

async function qtyPlus(
  req: Request<{ id: string }, unknown, { menu_id: string }>,
  res: Response
) {
  const menu = await menuRepo.selectById(req.body.menu_id);
  const item = await trxRepo.selectItemById(req.params.id);
  if (menu) {
    await trxRepo.updateItemQty(req.params.id, req.body.menu_id, item.qty + 1);
    await menuRepo.update(req.body.menu_id, { stock: menu.stock - 1 });
    return res.status(200).json({ message: 'Quantity updated.' });
  }
}

async function deleteItem(
  req: Request<{ id: string; menu_id: string }>,
  res: Response
) {
  const menu = await menuRepo.selectById(req.body.menu_id);
  if (menu) {
    await trxRepo.deleteItem(req.params.id);
    await menuRepo.update(req.params.menu_id, {
      stock: menu.stock + 1
    });
    return res.status(200).json({ message: 'Item deleted.' });
  }
}

export {
  addTransaction,
  getTransactions,
  addItemToCart,
  getItemsInCart,
  qtyMin,
  qtyPlus,
  deleteItem
};
