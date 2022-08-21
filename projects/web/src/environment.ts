export default {
  environment: process.env.NODE_ENV,
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  botURL: process.env.BOT_URL,
  botApiKey: process.env.BOT_API_KEY,
  webServerURL: process.env.WEB_SERVER_URL,
  port: process.env.PORT ?? 80,
  dbConnectionString: process.env.DB_CONNECTION_STRING,
  blobStorageConnectionString: process.env.BLOB_STORAGE_CONNECTION_STRING,
  soundsBaseUrl: process.env.SOUNDS_BASE_URL,
  pubnub: {
    publishKey: process.env.PUBNUB_PUBLISH_KEY,
    subscribeKey: process.env.PUBNUB_SUBSCRIBE_KEY,
    secretKey: process.env.PUBNUB_SECRET_KEY,
  },
};
