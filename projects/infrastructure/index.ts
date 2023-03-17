import * as pulumi from '@pulumi/pulumi';
import * as resources from '@pulumi/azure-native/resources';
import * as storage from '@pulumi/azure-native/storage';
import * as web from '@pulumi/azure-native/web';
import * as insights from '@pulumi/azure-native/insights';

const baseName = `botman-${ pulumi.getStack() }`;

function name(resourceName: string): string {
  return `${ baseName }-${ resourceName }`;
}

const resourceGroup = new resources.ResourceGroup(baseName);

const storageAccount = new storage.StorageAccount(
  `botman${ pulumi.getStack() }`,
  {
    resourceGroupName: resourceGroup.name,
    sku: { name: storage.SkuName.Standard_LRS },
    kind: storage.Kind.StorageV2,
    accessTier: storage.AccessTier.Hot,
    allowBlobPublicAccess: true,
    allowSharedKeyAccess: true,
    enableHttpsTrafficOnly: true,
  },
  { protect: true, parent: resourceGroup },
);

const soundsBlobContainer = new storage.BlobContainer(
  'sounds',
  {
    resourceGroupName: resourceGroup.name,
    accountName: storageAccount.name,
  },
  { parent: storageAccount },
);

const storageAccountKeys = storage.listStorageAccountKeysOutput({
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
});

const appServicePlan = new web.AppServicePlan(
  baseName,
  {
    resourceGroupName: resourceGroup.name,
    kind: 'linux',
    sku: {
      name: 'F1',
      tier: 'Free',
    },
    reserved: true,
  },
  { parent: resourceGroup },
);

const appInsights = new insights.Component(
  baseName,
  {
    resourceGroupName: resourceGroup.name,
    kind: 'web',
    applicationType: insights.ApplicationType.Web,
  },
  { parent: resourceGroup },
);

const config = new pulumi.Config();

interface SharedAppServiceConfigItem {
  name: string;
  value: pulumi.Input<string>;
}

const sharedAppServiceConfig: SharedAppServiceConfigItem[] = [{
  name: 'APPLICATIONINSIGHTS_CONNECTION_STRING',
  value: appInsights.connectionString,
}, {
  name: 'BLOB_STORAGE_CONNECTION_STRING',
  value: pulumi.interpolate`DefaultEndpointsProtocol=https;AccountName=${ storageAccount.name };AccountKey=${ storageAccountKeys.keys[0].value };EndpointSuffix=core.windows.net`,
}, {
  name: 'SOUNDS_BASE_URL',
  value: pulumi.concat(storageAccount.primaryEndpoints.blob, soundsBlobContainer.name),
}, {
  name: 'NODE_ENV',
  value: 'production',
}];

const botApiKey = config.requireSecret('botApiKey');
const dbConnectionString = config.requireSecret('dbConnectionString');
const botImageName = 'uncledave/botman:latest';

const botAppService = new web.WebApp(
  name('bot'),
  {
    resourceGroupName: resourceGroup.name,
    serverFarmId: appServicePlan.name,
    httpsOnly: true,
    clientAffinityEnabled: false,
    reserved: true,
    siteConfig: {
      linuxFxVersion: `DOCKER|${ botImageName }`,
      appSettings: [
        ...sharedAppServiceConfig,
        {
          name: 'API_KEY',
          value: botApiKey,
        },
        {
          name: 'BOT_TOKEN',
          value: config.requireSecret('botToken'),
        },
        {
          name: 'HOME_GUILD_ID',
          value: config.require('botHomeGuildId'),
        },
        {
          name: 'SOUNDS_CONNECTION_STRING',
          value: dbConnectionString,
        },
      ],
    },
  },
  { parent: appServicePlan },
);

const previousWebServerUrl = new pulumi.StackReference(`UncleDave/${ pulumi.getProject() }/${ pulumi.getStack() }`).outputs.apply(x => x.webServerUrl);
const webImageName = 'uncledave/botman-web:latest';

const webAppService = new web.WebApp(
  name('web'),
  {
    resourceGroupName: resourceGroup.name,
    serverFarmId: appServicePlan.name,
    httpsOnly: true,
    clientAffinityEnabled: false,
    reserved: true,
    siteConfig: {
      linuxFxVersion: `DOCKER|${ webImageName }`,
      appSettings: [
        ...sharedAppServiceConfig,
        {
          name: 'BOT_API_KEY',
          value: botApiKey,
        },
        {
          name: 'BOT_URL',
          value: pulumi.concat('https://', botAppService.defaultHostName),
        },
        {
          name: 'CLIENT_ID',
          value: config.requireSecret('webClientId'),
        },
        {
          name: 'CLIENT_SECRET',
          value: config.requireSecret('webClientSecret'),
        },
        {
          name: 'DB_CONNECTION_STRING',
          value: dbConnectionString,
        },
        {
          name: 'WEB_SERVER_URL',
          value: previousWebServerUrl,
        },
      ],
    },
  },
  { parent: appServicePlan },
);

// TODO: Log analytics

export const webServerUrl = pulumi.concat('https://', webAppService.defaultHostName);
