module.exports = {
  messagePrefix: '!', // TODO: Change prefix to !botman.
  soundsDirectory: './sounds/',
  soundFileExtensions: ['.mp3', '.wav'],
  environment: process.env.NODE_ENV // TODO: Move this, it's not a bot constant (create environment file in ..)
};
