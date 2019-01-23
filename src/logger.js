const winston = require('winston');
const fs = require('fs');

const logsDirectory = 'logs';

if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    winston.format.align(),
    winston.format.splat(),
    winston.format.printf(info => {
      return `${info.timestamp} ${info.level}: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/bot.log', maxFiles: 10, maxsize: 5 * 1000 * 1000, tailable: true, handleExceptions: true })
  ]
});

module.exports = logger;
