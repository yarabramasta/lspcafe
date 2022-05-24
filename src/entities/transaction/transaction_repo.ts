import Joi from 'joi';

import {
  Transaction,
  TransactionInput,
  TransactionItemInput,
  TransactionItemJoinResult,
  TransactionItemResult,
  TransactionResult
} from '@/entities/transaction';
import { ValidationError } from '@/models/errors';
import db from '@/services/database';

const transactionSchema = Joi.object<TransactionInput>({
  qty_total: Joi.number().required(),
  total_payment: Joi.number().required(),
  user_id: Joi.string().required()
});

const itemSchema = Joi.object<TransactionItemInput>({
  transaction_id: Joi.string().required(),
  menu_id: Joi.string().required(),
  qty: Joi.number().integer().required()
});

class TransactionRepo {
  public async insertItem(item: TransactionItemInput) {
    const { error } = itemSchema.validate(item);
    if (error) throw new ValidationError(error.message);

    const q = `
      INSERT INTO transaction_items (transaction_id, menu_id, qty, user_id)
      VALUES ($1, $2, $3, $4)
    `;
    await db.query(q, [
      item.transaction_id,
      item.menu_id,
      item.qty,
      item.user_id
    ]);
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
    const items = await this.itemInCart(user_id);
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
      const _items = await this.itemInCart(trx.user_id);
      items = [...items, ..._items];
    });
    return res.rows.map(trx => ({ ...trx, items }));
  }

  public async itemInCart(user_id: string) {
    const q = `
      SELECT ti.id AS id, ti.qty AS qty,
              m.id AS menu_id, m.name AS menu_name,
              m.image AS menu_image, m.price AS menu_price
      FROM transaction_items AS ti
      LEFT JOIN menus AS m ON ti.menu_id = m.id
      WHERE ti.user_id = $1
      GROUP BY m.id
    `;
    const items = await db.query<TransactionItemJoinResult>(q, [user_id]);
    return items.rows.map(this._itemToJson);
  }

  public async updateItemQty(id: string, qty: number) {
    const q = `
      UPDATE transaction_items
      SET qty = $2
      WHERE id = $1
    `;
    await db.query(q, [id, qty]);
  }

  private _itemToJson(item: TransactionItemJoinResult): TransactionItemResult {
    return {
      id: item.id,
      qty: item.qty,
      menu: {
        id: item.menu_id,
        name: item.menu_name,
        image: item.menu_image,
        price: item.menu_price
      }
    };
  }
}

export { itemSchema, transactionSchema };
export default TransactionRepo;
