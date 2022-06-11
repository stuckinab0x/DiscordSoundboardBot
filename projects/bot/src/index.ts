import { setup as setupApplicationInsights } from 'applicationinsights';
import Bot from './bot/bot';
import logger from './logger';
import Environment from './environment';

function isEnvironmentVariableValid<T>(value: T | undefined, name: string): value is T {
  const isValid = !!value;

  if (!isValid) logger.error(`No ${ name } provided`);

  return isValid;
}

process.env.TZ = 'Europe/Copenhagen';

if (process.env.NODE_ENV === 'production')
  setupApplicationInsights().start();

if (
  isEnvironmentVariableValid(process.env.BOT_TOKEN, 'BOT_TOKEN')
  && isEnvironmentVariableValid(process.env.HOME_GUILD_ID, 'HOME_GUILD_ID')
  && isEnvironmentVariableValid(process.env.API_KEY, 'API_KEY')
) {
  const environment: Environment = {
    environment: process.env.NODE_ENV || 'development',
    botToken: process.env.BOT_TOKEN,
    homeGuildId: process.env.HOME_GUILD_ID,
    apiKey: process.env.API_KEY,
  };

  logger.info('Starting in %s environment', environment.environment);

  new Bot(environment)
    .start()
    .then(() => logger.info('Bot started'))
    .catch(logger.error);
} else {
  process.exitCode = 1;
}
