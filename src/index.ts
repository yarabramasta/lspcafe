import http from 'http';

import express from 'express';

import expressLoader from '@/loaders/express';
import postgresLoader from '@/loaders/postgres';

import { isProd, server } from './config';
import db from './lib/services/database';
import logger from './lib/utils/logger';

const app = express();
const _server = http.createServer(app);

async function dispose(exit: boolean, code: number) {
  await db.end();
  _server.close();
  exit && process.exit(code);
}

(async () => {
  expressLoader(app);
  await postgresLoader(db);

  _server.listen(server.port);
  _server.on('listening', () => {
    logger.info(
      `Server is running at ${server.protocol}://${server.host}:${server.port}`
    );
  });
})();

process.on('uncaughtException', e => {
  logger.error(e);
  dispose(isProd, 1);
});

process.on('unhandledRejection', (r: any, p: any) => {
  logger.warn(r, p);
});

process.on('SIGTERM', () => dispose(true, 0));
