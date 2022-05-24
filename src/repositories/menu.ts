import { faker } from '@faker-js/faker';
import Joi from 'joi';

import dynamicFieldUpdate from '@/helpers/dynamic_field_update';
import { Menu, MenuInput } from '@/interfaces/menu';
import QueryError from '@/models/query_error';
import ValidationError from '@/models/validation_error';
import db from '@/services/database';
import logger from '@/utils/logger';

const schema = Joi.object<MenuInput>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().integer().required()
});

class MenuRepo {
  public async generateSeeds() {
    const inDb = await this.selectAll();

    if (inDb.length > 0) {
      const menus = [];
      for (let i = 0; i < 30; i++) {
        const menu = {
          name: faker.commerce.productName(),
          description: faker.lorem.paragraphs(2),
          price: Math.floor(Math.random() * (50000 - 10000) + 10000) / 100,
          stock: parseInt(faker.random.numeric())
        };
        menus.push(menu);
      }

      try {
        for await (const menu of menus) {
          this.insert(menu);
        }
      } catch (e) {
        logger.error(e);
        throw new QueryError('Failed to generate menu seeds');
      }
    }
  }

  public async insert(menu: MenuInput): Promise<Menu> {
    const { error } = schema.validate(menu);
    if (error) throw new ValidationError(error.message);

    const q = `
      INSERT INTO menus (name, description, price, stock)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const res = await db.query<Menu>(q, [
      menu.name,
      menu.description,
      menu.price,
      menu.stock
    ]);
    return res.rows[0];
  }

  public async selectAll(): Promise<Menu[]> {
    const q = `SELECT * FROM menus`;
    const res = await db.query<Menu>(q);
    return res.rows;
  }

  public async update(id: string, data: Partial<MenuInput>): Promise<void> {
    const { error } = schema.validate(data);
    if (error) throw new ValidationError(error.message);
    await dynamicFieldUpdate(id, data);
  }

  public async delete(id: string): Promise<void> {
    const q = `DELETE FROM menus WHERE id = $1`;
    await db.query(q, [id]);
  }
}

export const menuRepo = new MenuRepo();
export { schema as MenuSchema };
export default MenuRepo;
