import http from 'http';

import express from 'express';

import expressLoader from '@/loaders/express';
import postgresPoolLoader from '@/loaders/postgres_pool';

import { isProd, server } from './config';
import db from './utils/database';
import logger from './utils/logger';

const app = express();
const _server = http.createServer(app);

async function dispose(exit: boolean, code: number) {
	await db.end();
	_server.close();
	exit && process.exit(code);
}

(() => {
	expressLoader(app);
	postgresPoolLoader(db);

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

process.on('unhandledRejection', (r, _p) => {
	logger.warn(r);
});

process.on('SIGTERM', () => dispose(true, 0));
