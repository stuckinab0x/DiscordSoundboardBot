import addsound from './addsound';
import disconnect from './disconnect';
import HelpCommand from './help';
import sound from './sound';
import sounds from './sounds';
import source from './source';
import coinflip from './coinflip';

const commands = [sound, sounds, addsound, disconnect, source, coinflip];

export const helpCommand = new HelpCommand(commands);

export default [
  ...commands,
  helpCommand
];
