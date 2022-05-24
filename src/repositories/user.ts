import bcrypt from 'bcryptjs';
import Joi from 'joi';

import { UserInput, UserResult, UserRole } from '@/interfaces/user';
import ValidationError from '@/models/validation_error';
import db from '@/services/database';

const schema = Joi.object<UserInput>({
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	role: Joi.string().valid('kasir', 'manajer', 'admin').required()
});

class UserRepo {
	public async insert(user: UserInput): Promise<UserResult> {
		const { error } = schema.validate(user);
		if (error) throw new ValidationError(error.message);

		const salt = await bcrypt.genSalt(6);
		const password = await bcrypt.hash(user.password, salt);

		const q = `
      INSERT INTO users (email, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, email, role
    `;

		const result = await db.query<UserResult>(q, [
			user.email,
			password,
			user.role
		]);
		return result.rows[0];
	}

	public async selectAll(): Promise<UserResult[]> {
		const q = `SELECT id, email, role FROM users ORDER BY email ASC`;
		const res = await db.query<UserResult>(q);
		return res.rows;
	}

	public async selectById(id: string): Promise<UserResult | undefined> {
		const q = `SELECT id, email, role FROM users WHERE id = $1`;
		const res = await db.query<UserResult>(q, [id]);
		return res.rows.at(0);
	}

	public async selectByEmail(email: string): Promise<UserResult | undefined> {
		const q = `SELECT id, email, role FROM users WHERE email = $1`;
		const res = await db.query<UserResult>(q, [email]);
		return res.rows.at(0);
	}

	public async updateRole(
		id: string,
		role: UserRole
	): Promise<UserResult | undefined> {
		const q = `UPDATE users SET role = $2 WHERE id = $1 RETURNING id, email, role`;
		const res = await db.query<UserResult>(q, [id, role]);
		return res.rows.at(0);
	}
}

export const userRepo = new UserRepo();
export { schema as UserSchema };
export default UserRepo;
