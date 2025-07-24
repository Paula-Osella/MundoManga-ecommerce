import winston from 'winston';
import morgan from 'morgan';
import dotenv from 'dotenv';


dotenv.config();




const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};


const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'blue',
};


winston.addColors(colors);


const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
);


const logger = winston.createLogger({
    levels: levels,
    transports: [

        new winston.transports.Console({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: logFormat, // Usa el formato definido
        }),

        new winston.transports.File({
            filename: 'logs/error.log', // Archivo para solo errores
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.json()
            ),
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.json()
            ),
        }),
    ],
});


const morganMiddleware = morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {

        stream: {
            write: (message) => logger.http(message.trim()),
        },

    }
);


export { logger, morganMiddleware };
