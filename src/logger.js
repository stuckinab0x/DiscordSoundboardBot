const winston = require('winston');
const fs = require('fs');
const environment = require('./environment');

const logsDirectory = (process.env.ROOT_PATH || '.') + '/logs';

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const logger = winston.createLogger({
  level: environment.environment === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.align(),
    winston.format.splat(),
    winston.format.printf(info => {
      return `${ info.timestamp } ${ info.level }: ${ info.message }`;
    })
  ),
  transports: [
    new winston.transports.Console({ handleExceptions: true, handleRejections: true }),
    new winston.transports.File({ filename: 'logs/bot.log', maxFiles: 10, maxsize: 5 * 1000 * 1000, tailable: true, handleExceptions: true, handleRejections: true })
  ]
});

module.exports = logger;
