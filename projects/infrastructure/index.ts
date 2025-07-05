import * as dockerbuild from '@pulumi/docker-build';
import * as pulumi from '@pulumi/pulumi';
import { app, containerregistry, operationalinsights, resources } from '@pulumi/azure-native';
import envArgs from './bot-env';

const appName = 'spydoorman-az';

const resourceGroup = new resources.ResourceGroup(appName);

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

const appUrl = pulumi.interpolate`https://${ appName }.${ managedEnv.defaultDomain }`;

const image = new dockerbuild.Image(appName, {
  tags: [pulumi.interpolate`${ registry.loginServer }/${ appName }`],
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

// eslint-disable-next-line no-new
new app.ContainerApp(appName, {
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
      name: appName,
      image: image.ref,
      env: [
        ...envArgs,
        {
          name: 'APP_URL',
          value: appUrl,
        },
      ],
    }],
  },
});

// eslint-disable-next-line import/prefer-default-export
export const url = appUrl;
