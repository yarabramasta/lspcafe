import { faker } from '@faker-js/faker';
import Joi from 'joi';

import dynamicFieldUpdate from '@/helpers/dynamic_field_update';
import { QueryError, ValidationError } from '@/models/errors';
import db from '@/services/database';
import logger from '@/utils/logger';

import { isDev } from '../../config';
import { Menu, MenuInput } from '../menu';

const dummyImages = [
  'http://dummyimage.com/496x389.png/5fa2dd/ffffff',
  'http://dummyimage.com/366x500.png/dddddd/000000',
  'http://dummyimage.com/482x487.png/dddddd/000000',
  'http://dummyimage.com/457x397.png/dddddd/000000',
  'http://dummyimage.com/509x507.png/dddddd/000000',
  'http://dummyimage.com/496x497.png/ff4444/ffffff',
  'http://dummyimage.com/365x427.png/5fa2dd/ffffff',
  'http://dummyimage.com/462x452.png/5fa2dd/ffffff',
  'http://dummyimage.com/425x466.png/5fa2dd/ffffff',
  'http://dummyimage.com/378x414.png/dddddd/000000',
  'http://dummyimage.com/429x464.png/ff4444/ffffff',
  'http://dummyimage.com/367x442.png/5fa2dd/ffffff',
  'http://dummyimage.com/497x387.png/5fa2dd/ffffff',
  'http://dummyimage.com/464x370.png/dddddd/000000',
  'http://dummyimage.com/486x427.png/ff4444/ffffff',
  'http://dummyimage.com/452x409.png/dddddd/000000',
  'http://dummyimage.com/481x381.png/cc0000/ffffff',
  'http://dummyimage.com/472x481.png/dddddd/000000',
  'http://dummyimage.com/403x480.png/ff4444/ffffff',
  'http://dummyimage.com/377x442.png/dddddd/000000',
  'http://dummyimage.com/421x365.png/ff4444/ffffff',
  'http://dummyimage.com/502x415.png/5fa2dd/ffffff',
  'http://dummyimage.com/360x485.png/dddddd/000000',
  'http://dummyimage.com/512x361.png/ff4444/ffffff',
  'http://dummyimage.com/477x411.png/cc0000/ffffff',
  'http://dummyimage.com/475x404.png/5fa2dd/ffffff',
  'http://dummyimage.com/509x438.png/5fa2dd/ffffff',
  'http://dummyimage.com/473x457.png/dddddd/000000',
  'http://dummyimage.com/429x511.png/cc0000/ffffff',
  'http://dummyimage.com/507x454.png/cc0000/ffffff'
];

const schema = Joi.object<MenuInput>({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().integer().required()
});

const updateSchema = Joi.object<Partial<MenuInput>>({
  name: Joi.string(),
  description: Joi.string(),
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
          price: Math.floor(Math.random() * (50000 - 10000) + 10000),
          stock: parseInt(faker.random.numeric(2))
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
      INSERT INTO menus (name, description, price, stock, image)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const res = await db.query<Menu>(q, [
      menu.name,
      menu.description,
      menu.price,
      menu.stock,
      image
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
