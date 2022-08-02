import { Configuration } from 'webpack';
import path from 'path';
import environment from './src/environment';

const config: Configuration = {
  mode: environment.environment === 'development' ? 'development' : 'production',
  entry: './src/scripts/main.js',
  output: {
    path: path.resolve(__dirname, './src/public'),
    filename: 'app.js',
  },
  watch: environment.environment === 'development',
  watchOptions: { poll: true },
};

export default config;
