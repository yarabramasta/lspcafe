import { faker } from '@faker-js/faker';
import Joi from 'joi';

import dynamicFieldUpdate from '@/helpers/dynamic_field_update';
import { QueryError, ValidationError } from '@/models/errors';
import db from '@/services/database';
import logger from '@/utils/logger';

import { isDev } from '../../config';
import { Menu, MenuInput, MenuType } from '../menu';

const menuType: MenuType[] = ['makanan', 'minuman'];
const dummyImages = [
  'http://dummyimage.com/496x389.png/5fa2dd/ffffff',
  'http://dummyimage.com/366x500.png/dddddd/000000',
  'http://dummyimage.com/482x487.png/dddddd/000000',
  'http://dummyimage.com/457x397.png/dddddd/000000',
  'http://dummyimage.com/509x507.png/dddddd/000000',
  'http://dummyimage.com/496x497.png/ff4444/ffffff'
];

const schema = Joi.object<MenuInput>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().integer().required(),
  menu_type: Joi.string().valid('makanan', 'minuman').required()
});

const updateSchema = Joi.object<Partial<MenuInput>>({
  name: Joi.string(),
  description: Joi.string(),
  menu_type: Joi.string().valid('makanan', 'minuman').required(),
  price: Joi.number(),
  stock: Joi.number().integer()
});

class MenuRepo {
  public async generateSeeds() {
    const inDb = await this.selectAll();

    if (inDb.length === 0 && isDev) {
      logger.info('Generating seeds for menu...');
      const menus = [];
      for (let i = 0; i < 30; i++) {
        const menu = {
          name: faker.commerce.productName(),
          description: faker.lorem.paragraphs(2),
          menu_type: menuType[Math.floor(Math.random() * menuType.length)],
          price: Math.floor(Math.random() * (50000 - 10000) + 10000),
          stock: parseInt(faker.random.numeric(1))
        };
        menus.push(menu);
      }

      try {
        logger.info('Saving to database...');
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

    const image = dummyImages[Math.floor(Math.random() * dummyImages.length)];

    const q = `
      INSERT INTO menus (name, description, price, stock, image, menu_type)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const res = await db.query<Menu>(q, [
      menu.name,
      menu.description,
      menu.price,
      menu.stock,
      image,
      menu.menu_type
    ]);
    return res.rows[0];
  }

  public async selectAll(): Promise<Menu[]> {
    const q = `SELECT * FROM menus`;
    const res = await db.query<Menu>(q);
    return res.rows;
  }

  public async update(id: string, data: Partial<MenuInput>): Promise<void> {
    const { error } = updateSchema.validate(data);
    if (error) throw new ValidationError(error.message);
    await dynamicFieldUpdate(id, data);
  }

  public async delete(id: string): Promise<void> {
    const q = `DELETE FROM menus WHERE id = $1`;
    await db.query(q, [id]);
  }
}

export { schema, updateSchema };
export default MenuRepo;
