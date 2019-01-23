if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const Bot = require('./soundboard-bot/bot');

new Bot().start();

// TODO: Delete sound files from source control when testing is ovah.
