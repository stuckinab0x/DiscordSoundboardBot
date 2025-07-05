export default interface Environment {
  environment: string;
  botToken: string;
  homeGuildId: string;
  dbConnectionString: string;
  soundsBaseUrl: string;
  blobStorageConnectionString: string;
}

export interface WebServerEnvironment {
  appURL: string;
  environment: string;
  dbConnectionString: string
  blobStorageConnectionString: string;
  clientID: string;
  clientSecret: string;
  frontendSoundsBaseUrl: string;
  port: string | number;
}
