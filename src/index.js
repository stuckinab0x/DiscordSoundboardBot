const Bot = require('./soundboard-bot/bot');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

new Bot().start();

// TODO: Delete sound files from source control when testing is ovah.
