const logger = require('./logger');
const environment = require('./environment');
const Bot = require('./bot/bot');
const http = require('http');

logger.info('Starting in %s environment', environment.environment);

new Bot()
  .start(environment.botToken)
  .then(() => logger.info('Bot started'))
  .catch(logger.error);

http
  .createServer((req, res) => {
    res.writeHead(204);
    res.end();
  })
  .listen(80);
