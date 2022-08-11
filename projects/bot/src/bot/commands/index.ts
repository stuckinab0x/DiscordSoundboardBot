import disconnect from './disconnect';
import sound from './sound';
import sounds from './sounds';
import source from './source';
import coinflip from './coinflip';
import Command from './command';
import skip from './skip';
import addsound from './addsound';

const commands: Command[] = [sound, sounds, disconnect, source, coinflip, skip, addsound];

export default commands;
