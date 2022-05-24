import { NextFunction, Request, Response } from 'express';

import { MenuInput, menuRepo } from '@/entities/menu';
import { QueryError, ValidationError } from '@/models/errors';

async function addMenu(
  req: Request<unknown, unknown, MenuInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const menu = await menuRepo.insert(req.body);
    return res.status(201).json({ menu });
  } catch (e: any) {
    if (e instanceof ValidationError) next(e);
    next(new QueryError(e.message));
  }
}

async function getMenus(req: Request, res: Response, next: NextFunction) {
  try {
    const menus = await menuRepo.selectAll();
    return res.json({ menus });
  } catch (e: any) {
    next(new QueryError(e.message));
  }
}

async function updateMenu(
  req: Request<{ id: string }, unknown, Partial<MenuInput>>,
  res: Response,
  next: NextFunction
) {
  try {
    await menuRepo.update(req.params.id, req.body);
    return res.status(200).json({ message: 'Menu updated' });
  } catch (e: any) {
    if (e instanceof ValidationError) next(e);
    next(new QueryError(e.message));
  }
}

async function deleteMenu(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    await menuRepo.delete(req.params.id);
    return res.status(200).json({ message: 'Menu deleted' });
  } catch (e: any) {
    next(new QueryError(e.message));
  }
}

export { addMenu, getMenus, updateMenu, deleteMenu };
