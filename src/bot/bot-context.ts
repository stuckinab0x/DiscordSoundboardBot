import { VoiceChannel } from 'discord.js';
import SoundFile from './sound-file';

export interface SoundQueueItem {
  sound: SoundFile;
  channel: VoiceChannel;
}

export default interface BotContext {
  soundPlaying?: boolean;
  soundQueue: SoundQueueItem[];
}
