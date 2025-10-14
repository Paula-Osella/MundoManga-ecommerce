import winston from 'winston';
import morgan from 'morgan';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
dotenv.config();

// Utilidades para ESM (__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Flags de entorno
const isVercel = !!process.env.VERCEL;                   // Vercel setea esta env
const isProd = process.env.NODE_ENV === 'production';   // Modo producción
// Si no estás en Vercel, por defecto permitimos archivo (podés forzarlo con LOG_TO_FILE=false)
const logToFile = !isVercel && process.env.LOG_TO_FILE !== 'false';

// Definición de niveles y colores (multinivel personalizado)
const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const colors = { error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'blue' };
winston.addColors(colors);

// Formato para consola (legible y coloreado)
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  // En producción los colores pueden “ensuciar” logs externos; si preferís, apagalo con: !isProd
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

// Transports base (siempre consola; Vercel captura y muestra en Runtime Logs)
const transports = [
  new winston.transports.Console({
    level: isProd ? 'info' : 'debug',
    format: consoleFormat,
  }),
];

// Si estamos en local/servidor tradicional y queremos archivos, los agregamos
if (logToFile) {
  // Asegurar carpeta ./logs (NO ejecutar en Vercel)
  const logsDir = path.resolve(process.cwd(), 'logs');
  try {
    // recursive: true evita error si ya existe (y crea subdirectorios si hacen falta)
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (e) {
    // Si falla crear carpeta local, dejamos constancia y seguimos solo con consola
    // (no lanzamos excepción para no romper la app)
    // eslint-disable-next-line no-console
    console.warn('[logger] No se pudo crear la carpeta ./logs. Se continuará solo con consola.', e);
  }

  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'), // Solo errores
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
      ),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'), // info+ (incluye http)
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.json()
      ),
    })
  );
}

// Crear instancia de logger
const logger = winston.createLogger({
  levels,
  transports,
});

// Middleware de Morgan → manda access logs al nivel http del logger
const morganMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});

export { logger, morganMiddleware };