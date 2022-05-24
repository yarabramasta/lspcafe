import { Client } from 'pg';

import { menuRepo } from '@/entities/menu';
import logger from '@/utils/logger';

export default async function (client: Client) {
  try {
    logger.info('Connecting to Postgres...');
    const connection = await client.connect();
    await menuRepo.generateSeeds();
    logger.info('Database connection established');
    return connection;
  } catch (e) {
    logger.error(e);
    await client.end();
  }
}
