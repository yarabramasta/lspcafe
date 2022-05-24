import bcrypt from 'bcryptjs';
import Joi from 'joi';

import { EntityNotFoundError, ValidationError } from '@/models/errors';
import db from '@/services/database';

import { User, UserInput, UserResult, UserRole } from '../user';

const schema = Joi.object<UserInput>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('cashier', 'manager', 'admin').required()
});

class UserRepo {
  public async insert(user: UserInput): Promise<UserResult> {
    const { error } = schema.validate(user);
    if (error) throw new ValidationError(error.message);

    const salt = await bcrypt.genSalt(6);
    const password = await bcrypt.hash(user.password, salt);

    const q = `
      INSERT INTO users (email, password, role, name)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, role
    `;

    const result = await db.query<UserResult>(q, [
      user.email,
      password,
      user.role,
      user.name
    ]);
    return result.rows[0];
  }

  public async selectAll(): Promise<UserResult[]> {
    const q = `SELECT id, name, email, role FROM users ORDER BY email ASC`;
    const res = await db.query<UserResult>(q);
    return res.rows;
  }

  public async selectById(id: string): Promise<UserResult | undefined> {
    const q = `SELECT id, name, email, role FROM users WHERE id = $1`;
    const res = await db.query<UserResult>(q, [id]);
    return res.rows.at(0);
  }

  public async selectByEmail(email: string): Promise<User | undefined> {
    const q = `SELECT * FROM users WHERE email = $1`;
    const res = await db.query<User>(q, [email]);
    return res.rows.at(0);
  }

  public async updateRole(id: string, role: UserRole): Promise<void> {
    const { error } = Joi.object({
      role: Joi.string().valid('cashier', 'manager', 'admin')
    }).validate({ role });
    if (error) throw new ValidationError(error.message);
    const exist = await this.selectById(id);
    if (!exist) throw new EntityNotFoundError('User not found');
    const q = `UPDATE users SET role = $2 WHERE id = $1`;
    await db.query<UserResult>(q, [id, role]);
  }

  /**
   * WARNING: This method is only for development purposes.
   */
  public async delete(id: string): Promise<void> {
    const exist = await this.selectById(id);
    if (!exist) throw new EntityNotFoundError('User not found');
    const q = `DELETE FROM users WHERE id = $1`;
    await db.query<UserResult>(q, [id]);
  }
}

export { schema };
export default UserRepo;
