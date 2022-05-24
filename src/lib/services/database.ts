import { promisifyAll } from 'bluebird';
import pg from 'pg';

import logger from '@/utils/logger';

import { database } from '../../config';

const db = new pg.Client({
  user: database.user,
  password: database.password,
  database: database.database,
  host: database.host,
  port: database.port,
  connectionTimeoutMillis: 5 * 60 * 1000
});

db.on('error', logger.error);
db.on('end', () => {
  logger.info('Database connection closed');
});

export default promisifyAll(db);
