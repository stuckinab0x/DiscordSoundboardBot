const logger = require('./logger');

if (process.env.NODE_ENV !== 'production') {
  logger.info('Not running in production environment');
  require('dotenv').config();
  logger.info('Environment variables loaded from file');
}

const Bot = require('./soundboard-bot/bot');

new Bot()
  .start()
  .then(() => logger.info('Bot started'))
  .catch(logger.error);

// TODO: Delete sound files from source control when testing is ovah.
