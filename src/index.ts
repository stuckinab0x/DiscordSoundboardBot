import Bot from './bot/bot';
import environment from './environment';
import logger from './logger';

logger.info('Starting in %s environment', environment.environment);

new Bot()
  .start(environment.botToken)
  .then(() => logger.info('Bot started'))
  .catch(logger.error);
