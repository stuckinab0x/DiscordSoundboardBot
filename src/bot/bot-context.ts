import { BaseGuildVoiceChannel } from 'discord.js';
import { createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection } from '@discordjs/voice';
import SoundFile from './sound-file';
import logger from '../logger';

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
class BotAudioPlayer {
  private player = createAudioPlayer();

  subscribe(connection: VoiceConnection) {
    connection.subscribe(this.player);
  }

  play(fileName: string): Promise<any> {
    logger.debug('Attempting to play file %s', fileName);
    const resource = createAudioResource(fileName);
    this.player.play(resource);
    return new Promise(resolve => {
      this.player.on(AudioPlayerStatus.Idle, resolve);
    });
  }

  stop() {
    this.player.stop();
  }

  get state() {
    return this.player.state.status;
  }
}

export default class BotContext {
  soundQueue = new SoundQueue();
  botAudioPlayer = new BotAudioPlayer();
}
