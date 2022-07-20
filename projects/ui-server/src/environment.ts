export default {
  environment: process.env.NODE_ENV,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  botURL: process.env.BOT_URL,
  botApiKey: process.env.BOT_API_KEY,
  UIServerURL: process.env.UI_SERVER_URL,
  port: process.env.PORT ?? 80,
  soundsConnectionString: process.env.SOUNDS_CONNECTION_STRING,
  soundsDirectory: process.env.SOUNDS_DIRECTORY,
};
