export default interface Environment {
  environment: string;
  botToken: string;
  homeGuildId: string;
  dbConnectionString: string;
  soundsBaseUrl: string;
  blobStorageConnectionString: string;
}

export interface WebServerEnvironment {
  environment: string;
  dbConnectionString: string
  blobStorageConnectionString: string;
  clientID: string;
  clientSecret: string;
  webServerUrl: string;
  frontendSoundsBaseUrl: string;
  port: string | number;
}
