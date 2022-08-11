import { BaseGuildVoiceChannel } from 'discord.js';
import { createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnection } from '@discordjs/voice';
import { Sound, SoundsService } from 'botman-sounds';
import { Readable } from 'node:stream';

export interface SoundQueueItem {
  sound: Sound;
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

  play(stream: Readable): Promise<any> {
    const resource = createAudioResource(stream);
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
  readonly soundQueue = new SoundQueue();
  readonly botAudioPlayer = new BotAudioPlayer();
  currentSound?: SoundQueueItem;

  constructor(public readonly soundsService: SoundsService) {}
}
