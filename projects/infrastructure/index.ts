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

const config = new pulumi.Config();

const imageRegistryUsername = config.get('imageRegistryUsername');
const imageRegistryPassword = config.get('imageRegistryPassword');

const registryLoginServer = 'docker.io';

const appUrl = pulumi.interpolate`https://${ appName }.${ managedEnv.defaultDomain }`;

const image = new dockerbuild.Image(appName, {
  tags: [pulumi.interpolate`${ imageRegistryUsername }/${ appName }:latest`],
  dockerfile: { location: '../bot/Dockerfile' },
  context: { location: '../..' },
  platforms: ['linux/amd64'],
  push: true,
  registries: [{
    address: registryLoginServer,
    username: imageRegistryUsername,
    password: imageRegistryPassword,
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
      server: registryLoginServer,
      username: imageRegistryUsername,
      passwordSecretRef: 'pwd',
    }],
    secrets: [{
      name: 'pwd',
      value: imageRegistryPassword,
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
