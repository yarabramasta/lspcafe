import dotenv from 'dotenv';

const NODE_ENV = process.env.NODE_ENV;
const ENV_PATH = `${process.cwd()}/.env.${NODE_ENV}`;

dotenv.config({ path: ENV_PATH });

const server = {
	protocol: process.env.PROTOCOL || 'http',
	host: process.env.HOST || 'localhost',
	port: parseInt(process.env.PORT ?? '4000') || 4000
};

const database = {
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT ?? '5432') || 5432,
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || 'postgres',
	database: process.env.DB_NAME || 'postgres'
};

const isDev = NODE_ENV === 'development';
const isProd = NODE_ENV === 'production';
const isTest = NODE_ENV === 'test';

export { server, database, NODE_ENV, ENV_PATH, isDev, isProd, isTest };
