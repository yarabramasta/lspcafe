import compression from 'compression';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { asyncHandler } from '@/middlewares/async_handler';
import { errorHandler } from '@/middlewares/error_handler';
import { notFoundHandler } from '@/middlewares/not_found_handler';
import userRoute from '@/routes/users';

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
		app.use('/api/v1', asyncHandler(route));
	});

	app.use(notFoundHandler);
	app.use(errorHandler);
}
