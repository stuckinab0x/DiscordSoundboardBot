const logger = require('./logger');
const environment = require('./environment');
const Bot = require('./bot/bot');

logger.info('Starting in %s environment', environment.environment);

new Bot()
  .start(environment.botToken)
  .then(() => logger.info('Bot started'))
  .catch(logger.error);
