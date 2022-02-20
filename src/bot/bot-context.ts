import { BaseGuildVoiceChannel } from 'discord.js';
import SoundFile from './sound-file';

export interface SoundQueueItem {
  sound: SoundFile;
  channel: BaseGuildVoiceChannel;
}

class SoundQueue extends Array<SoundQueueItem> {
  private subscribers: (() => void)[] = [];

  push(...items: SoundQueueItem[]): number {
    const result = super.push(...items);
    this.subscribers.forEach(x => x());
    return result;
  }

  onPush(subscriber: () => void) {
    this.subscribers.push(subscriber);
  }

  clear() {
    this.length = 0;
  }
}

export default class BotContext {
  soundQueue = new SoundQueue();
}
