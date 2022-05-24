import winston from 'winston';

import { isDev } from '../config';

const logger = winston.createLogger({
	level: isDev ? 'debug' : 'info',
	format: winston.format.combine(
		winston.format.colorize({ all: false }),
		winston.format.timestamp(),
		winston.format.ms(),
		winston.format.printf(
			info => `${info.timestamp}  [${info.ms}] ${info.level}: ${info.message}`
		)
	),
	transports: [new winston.transports.Console()]
});

export default logger;
