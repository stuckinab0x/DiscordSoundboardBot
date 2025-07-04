import * as dockerbuild from '@pulumi/docker-build';
import * as pulumi from '@pulumi/pulumi';
import * as app from '@pulumi/azure-native/app';
import * as containerregistry from '@pulumi/azure-native/containerregistry';
import * as operationalinsights from '@pulumi/azure-native/operationalinsights';
import * as resources from '@pulumi/azure-native/resources';

const config = new pulumi.Config();

const apiKey = config.getSecret('apiKey');
const applicationInsightsConnectionString = config.getSecret('applicationInsightsConnectionString');
const blobStorageConnectionString = config.getSecret('blobStorageConnectionString');
const botToken = config.getSecret('botToken');
const clientId = config.getSecret('clientId');
const clientSecret = config.getSecret('clientSecret');
const dockerEnableCI = config.getBoolean('dockerEnableCI');
const frontendSoundsBaseUrl = config.get('frontendSoundsBaseUrl');
const homeGuildId = config.getSecret('homeGuildId');
const soundsBaseUrl = config.get('soundsBaseUrl');
const soundsConnectionString = config.getSecret('soundsConnectionString');
const webServerUrl = config.get('webServerUrl');

const envArgs = [
  {
    name: 'API_KEY',
    value: apiKey,
  },
  {
    name: 'APPLICATIONINSIGHTS_CONNECTION_STRING',
    value: applicationInsightsConnectionString,
  },
  {
    name: 'BLOB_STORAGE_CONNECTION_STRING',
    value: blobStorageConnectionString,
  },
  {
    name: 'BOT_TOKEN',
    value: botToken,
  },
  {
    name: 'CLIENT_ID',
    value: clientId,
  },
  {
    name: 'CLIENT_SECRET',
    value: clientSecret,
  },
  {
    name: 'DOCKER_ENABLE_CI',
    value: dockerEnableCI?.toString(),
  },
  {
    name: 'FRONTEND_SOUNDS_BASE_URL',
    value: frontendSoundsBaseUrl,
  },
  {
    name: 'HOME_GUILD_ID',
    value: homeGuildId,
  },
  {
    name: 'SOUNDS_BASE_URL',
    value: soundsBaseUrl,
  },
  {
    name: 'SOUNDS_CONNECTION_STRING',
    value: soundsConnectionString,
  },
  {
    name: 'WEB_SERVER_URL',
    value: webServerUrl,
  },
];

const resourceGroup = new resources.ResourceGroup('spydoorman-az');

const workspace = new operationalinsights.Workspace('loganalytics', {
  resourceGroupName: resourceGroup.name,
  sku: { name: 'PerGB2018' },
  retentionInDays: 30,
});

const workspaceSharedKeys = operationalinsights.getSharedKeysOutput({
  resourceGroupName: resourceGroup.name,
  workspaceName: workspace.name,
});

const managedEnv = new app.ManagedEnvironment('env', {
  resourceGroupName: resourceGroup.name,
  appLogsConfiguration: {
    destination: 'log-analytics',
    logAnalyticsConfiguration: {
      customerId: workspace.customerId,
      sharedKey: workspaceSharedKeys.apply((r: operationalinsights.GetSharedKeysResult) => r.primarySharedKey!),
    },
  },
});

const registry = new containerregistry.Registry('registry', {
  resourceGroupName: resourceGroup.name,
  sku: { name: 'Basic' },
  adminUserEnabled: true,
});

const credentials = containerregistry.listRegistryCredentialsOutput({
  resourceGroupName: resourceGroup.name,
  registryName: registry.name,
});
const adminUsername = credentials.apply((c: containerregistry.ListRegistryCredentialsResult) => c.username!);
const adminPassword = credentials.apply((c: containerregistry.ListRegistryCredentialsResult) => c.passwords![0].value!);

const customImage = 'spydoorman';

const image = new dockerbuild.Image('image', {
  tags: [pulumi.interpolate`${ registry.loginServer }/${ customImage }`],
  dockerfile: { location: '../bot/Dockerfile' },
  context: { location: '../..' },
  platforms: ['linux/amd64'],
  push: true,
  registries: [{
    address: registry.loginServer,
    username: adminUsername,
    password: adminPassword,
  }],
});

const containerApp = new app.ContainerApp('spydoorman-az', {
  resourceGroupName: resourceGroup.name,
  managedEnvironmentId: managedEnv.id,
  configuration: {
    ingress: {
      external: true,
      targetPort: 80,
    },
    registries: [{
      server: registry.loginServer,
      username: adminUsername,
      passwordSecretRef: 'pwd',
    }],
    secrets: [{
      name: 'pwd',
      value: adminPassword,
    }],
  },
  template: {
    containers: [{
      name: 'spydoorman-az',
      image: image.ref,
      env: [
        ...envArgs,
      ],
    }],
  },
});

// eslint-disable-next-line import/prefer-default-export
export const url = pulumi.interpolate`https://${ containerApp.configuration.apply((c: any) => c?.ingress?.fqdn) }`;
