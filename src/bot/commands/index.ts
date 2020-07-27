import addsound from './addsound';
import disconnect from './disconnect';
import help from './help';
import sound from './sound';
import sounds from './sounds';

const commands = [sound, sounds, addsound, disconnect];

export const helpCommand = help(commands);

export default [
  ...commands,
  helpCommand
];
