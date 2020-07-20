const logger = require('./logger');
const constants = require('./soundboard-bot/constants');
const Bot = require('./soundboard-bot/bot');

logger.info('Starting in %s environment', constants.environment);

new Bot()
  .start()
  .then(() => logger.info('Bot started'))
  .catch(logger.error);

// TODO: Delete sound files from source control when testing is ovah.
// TODO: Bind the bot to a specified channel. Join when a sound is requested (+ delay). Leave when the last person leaves.
// TODO: Error handling & recovery.
