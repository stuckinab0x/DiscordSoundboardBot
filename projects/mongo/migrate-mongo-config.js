const connectionUri = process.env.MIGRATIONS_CONNECTION_URI || 'mongodb://localhost:27017';

const config = {
  mongodb: {
    url: connectionUri,
    databaseName: 'botman',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'migrations',
  changelogCollectionName: 'changelog',
  migrationFileExtension: '.js',
  useFileHash: false,
  moduleSystem: 'commonjs',
};

module.exports = config;
