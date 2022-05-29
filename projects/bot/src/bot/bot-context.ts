import { BaseGuildVoiceChannel } from 'discord.js';
import { createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection } from '@discordjs/voice';
import SoundFile from './sound-file';
import logger from '../logger';

export interface SoundQueueItem {
  sound: SoundFile;
  channel: BaseGuildVoiceChannel;
}

type SoundQueueOnPushSubscriber = () => void;

class SoundQueue {
  private subscribers: SoundQueueOnPushSubscriber[] = [];
  private items: SoundQueueItem[] = [];

  add(...items: SoundQueueItem[]): number {
    const result = this.items.push(...items);
    this.subscribers.forEach(x => x());
    return result;
  }

  onPush(subscriber: SoundQueueOnPushSubscriber) {
    this.subscribers.push(subscriber);
  }

  clear() {
    this.items = [];
  }

  skip(count?: number) {
    if (count) this.items.splice(0, count - 1);
  }

  removeByChannel(channelId: string | number) {
    this.items = this.items.filter(x => x.channel.id !== channelId);
  }

  takeNext() {
    return this.items.shift();
  }

  get length() {
    return this.items.length;
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
  currentSound?: SoundQueueItem;
}
