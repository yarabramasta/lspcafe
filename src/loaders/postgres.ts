import { Client } from 'pg';

import logger from '@/utils/logger';

export default async function (client: Client) {
  try {
    const connection = await client.connect();
    logger.info('Database connection established');
    return connection;
  } catch {
    await client.end();
  }
}
