const logger = require('./logger');
const environment = require('./environment');
const Bot = require('./soundboard-bot/bot');

logger.info('Starting in %s environment', environment.environment);

new Bot()
  .start(environment.botToken)
  .then(() => logger.info('Bot started'))
  .catch(logger.error);

// TODO: Bind the bot to a specified channel. Join when a sound is requested (+ delay). Leave when the last person leaves.
// TODO: Error handling & recovery.
