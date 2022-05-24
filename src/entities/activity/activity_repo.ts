import Joi from 'joi';

import { ValidationError } from '@/models/errors';
import db from '@/services/database';

import { ActivityInput, ActivityJoinResult, ActivityResult } from '../activity';

const schema = Joi.object<ActivityInput>({
  user_id: Joi.number().integer().required(),
  action: Joi.string().required()
});

class ActivityRepo {
  public async insert(activity: ActivityInput): Promise<void> {
    const { error } = schema.validate(activity);
    if (error) throw new ValidationError(error.message);

    const q = `
      INSERT INTO activities (user_id, action)
      VALUES ($1, $2)
    `;
    await db.query<ActivityResult>(q, [activity.user_id, activity.action]);
  }

  public async selectAll(): Promise<ActivityResult[]> {
    const q = `
      SELECT act.id AS id, act.action AS action, act.created_at AS created_at,
              usr.id AS user_id, usr.email AS user_email, usr.role AS user_role
      FROM activities act
      LEFT JOIN users usr ON act.user_id = usr.id
      GROUP BY usr.id
      ORDER BY act.created_at DESC
    `;

    const res = await db.query<ActivityJoinResult>(q);
    return res.rows.map(row => this._toResult(row));
  }

  private _toResult(row: ActivityJoinResult) {
    return {
      id: row.id,
      action: row.action,
      user: {
        id: row.user_id,
        email: row.user_email,
        role: row.user_role
      },
      created_at: row.created_at
    };
  }
}

export { schema };
export default ActivityRepo;
