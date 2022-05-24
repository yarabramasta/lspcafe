import compression from 'compression';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';

import HttpError from '@/models/http_error';
import userRoute from '@/routes/users';
import logger from '@/utils/logger';

import { isDev } from '../config';

export default function (app: express.Application) {
	app.use(express.json({ limit: '100kb' }));
	app.use(express.urlencoded({ extended: true }));

	app.disabled('x-powered-by');

	app.use(cors());
	app.use(compression());

	isDev && app.use(morgan('dev'));

	const routes: any[] = [userRoute];
	routes.forEach(route => {
		app.use('/api/v1', (req, res, next) =>
			Promise.resolve(route(req, res, next)).catch(next)
		);
	});

	app.use((req, res, next) => next(new HttpError(404, 'Not found')));
	app.use((e: any, req: Request, res: Response, _next: NextFunction) => {
		if (e instanceof HttpError) {
			return res.status(e.status).json({
				type: isDev ? e.name : undefined,
				status: e.status,
				message: e.message
			});
		} else {
			logger.error(e);
			return res.status(500).json({
				type: isDev ? e.name : undefined,
				status: 500,
				message: e.message
			});
		}
	});
}
