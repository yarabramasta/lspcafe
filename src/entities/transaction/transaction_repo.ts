import Joi from 'joi';

import { menuRepo } from '@/entities/menu';
import {
  Transaction,
  TransactionInput,
  TransactionItemInput,
  TransactionItemJoinResult,
  TransactionItemResult,
  TransactionResult
} from '@/entities/transaction';
import {
  EntityNotFoundError,
  HttpError,
  ValidationError
} from '@/models/errors';
import db from '@/services/database';

const transactionSchema = Joi.object<TransactionInput>({
  qty_total: Joi.number().required(),
  total_payment: Joi.number().required(),
  user_id: Joi.string().required()
});

const itemSchema = Joi.object<TransactionItemInput>({
  menu_id: Joi.string().required(),
  qty: Joi.number().integer().required()
});

class TransactionRepo {
  public async insertItem(user_id: string, item: TransactionItemInput) {
    const { error } = itemSchema.validate(item);
    if (error) throw new ValidationError(error.message);

    const q = `
      INSERT INTO transaction_items (menu_id, qty, user_id)
      VALUES ($1, $2, $3)
    `;
    await db.query(q, [item.menu_id, item.qty, user_id]);
  }

  public async insertTransaction(trx: TransactionInput) {
    const { error } = transactionSchema.validate(trx);
    if (error) throw new ValidationError(error.message);
    const q = `
      INSERT INTO transactions (qty_total, total_payment, user_id)
      VALUES ($1, $2, $3)
    `;
    await db.query(q, [trx.qty_total, trx.total_payment, trx.user_id]);
  }

  public async selectTransactionsByUserId(
    user_id: string
  ): Promise<TransactionResult[]> {
    const items = await this.selectItemInCart(user_id);
    const q = `
      SELECT id, transaction_code, table_code, qty_total,
              total_payment, created_at
      FROM transactions WHERE user_id = $1
    `;
    const res = await db.query<TransactionResult>(q, [user_id]);
    return res.rows.map(trx => ({ ...trx, items }));
  }

  public async selectTransactionsByUserName(nameChar: string) {
    const q = `
      SELECT * FROM transactions
      WHERE user_id IN (
        SELECT id FROM users WHERE name LIKE $1
      )
    `;
    const res = await db.query<Omit<Transaction, 'items'>>(q, [
      `%${nameChar}%`
    ]);
    let items: any[] = [];
    res.rows.forEach(async trx => {
      const _items = await this.selectItemInCart(trx.user_id);
      items = [...items, ..._items];
    });
    return res.rows.map(trx => ({ ...trx, items }));
  }

  public async selectItemInCart(user_id: string) {
    const q = `
      SELECT ti.id AS id, ti.qty AS qty,
              m.id AS menu_id, m.name AS menu_name,
              m.image AS menu_image, m.price AS menu_price,
              m.stock AS menu_stock
      FROM transaction_items AS ti
      LEFT JOIN menus AS m ON ti.menu_id = m.id
      WHERE ti.user_id = $1
      GROUP BY m.id, ti.id
      ORDER BY m.name ASC
    `;
    const items = await db.query<TransactionItemJoinResult>(q, [user_id]);
    return items.rows.map(this._itemToJson);
  }

  public async updateItemQty(id: string, menu_id: string, qty: number) {
    const item = await menuRepo.selectById(menu_id);
    if (!item) throw new EntityNotFoundError('Menu not found');
    if (item.stock < qty) throw new HttpError(400, 'Stock is not enough');
    if (!item) throw new EntityNotFoundError('Item not found');
    const q = `
        UPDATE transaction_items
        SET qty = $2
        WHERE id = $1
      `;
    await db.query(q, [id, qty]);
  }

  public async updateItemTransactionId(
    item_id: string,
    transaction_id: string
  ) {
    const q = `
      UPDATE transaction_items
      SET transaction_id = $2
      WHERE id = $1
    `;
    await db.query(q, [item_id, transaction_id]);
  }

  public async deleteItem(id: string) {
    const q = `
      DELETE FROM transaction_items
      WHERE id = $1
    `;
    await db.query(q, [id]);
  }

  private _itemToJson(item: TransactionItemJoinResult): TransactionItemResult {
    return {
      id: item.id,
      qty: item.qty,
      menu: {
        id: item.menu_id,
        name: item.menu_name,
        image: item.menu_image,
        price: item.menu_price,
        stock: item.menu_stock
      }
    };
  }
}

export { itemSchema, transactionSchema };
export default TransactionRepo;
