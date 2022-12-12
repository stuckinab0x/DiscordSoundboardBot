import { Client, GatewayIntentBits, ActivityType, Interaction, VoiceState } from 'discord.js';
import { DiscordGatewayAdapterCreator, joinVoiceChannel, getVoiceConnection } from '@discordjs/voice';
import { SoundsService } from 'botman-sounds';
import axios from 'axios';
import { Readable } from 'node:stream';
import logger from '../logger';
import BotContext from './bot-context';
import commands from './commands';
import SoundRequestServer from './sound-request-server';
import Environment from '../environment';

export default class Bot {
  private readonly client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages],
    presence: { activities: [{ name: 'you', type: ActivityType.Watching }] },
  });

  private readonly context: BotContext;
  private readonly soundRequestServer: SoundRequestServer;

  private soundPlaying = false;

  constructor(private readonly environment: Environment) {
    this.client.on('ready', () => this.onReady());
    this.client.on('interactionCreate', interaction => this.onInteraction(interaction));
    this.client.on('warn', m => {
      logger.log('warn', m);
    });

    this.client.on('error', m => {
      logger.log('error', m);
    });

    this.client.on('voiceStateUpdate', oldState => this.onVoiceStateUpdate(oldState));

    const soundsService = new SoundsService(environment.soundsConnectionString, environment.blobStorageConnectionString);
    this.context = new BotContext(soundsService);
    this.context.soundQueue.onPush(() => this.onSoundQueuePush());

    this.soundRequestServer = new SoundRequestServer(80, environment);

    this.soundRequestServer.onSoundRequest((userID, soundRequest) => this.onServerSoundRequest(userID, soundRequest));
    this.soundRequestServer.onSkipRequest((userID, skipAll) => this.onServerSkipRequest(userID, skipAll));
  }

  start(): Promise<string> {
    logger.info('Starting bot, attempting to log in to Discord');
    return this.client.login(this.environment.botToken);
  }

  private onReady() {
    logger.info('Logged in as %s', this.client.user?.tag);

    commands.forEach(command => {
      this.client.application!.commands.create(command.commandData);
    });
  }

  private async onInteraction(interaction: Interaction) {
    if (!interaction.isCommand())
      return;

    logger.info('%s: Received command "%s" from "%s"', interaction.id, interaction.commandName, interaction.user.username);

    const command = commands.find(x => x.commandData.name === interaction.commandName);

    if (!command) {
      logger.error('%s: Command "%s" did not match any available commands', interaction.id, interaction.commandName);
      return;
    }

    if (await command.isValid(interaction))
      await command.execute(interaction, this.context);
  }

  private onVoiceStateUpdate(oldState: VoiceState) {
    if (oldState.channel?.members.every(x => x.id === this.client.user!.id)) {
      this.context.soundQueue.removeByChannel(oldState.channelId!);
      if (this.context.currentSound?.channel === oldState.channel) this.context.botAudioPlayer.stop();
      if (!this.context.soundQueue.length) getVoiceConnection(this.environment.homeGuildId)?.disconnect();
    }
  }

  private async onSoundQueuePush() {
    if (this.soundPlaying)
      return;

    this.soundPlaying = true;

    while (this.context.soundQueue.length) {
      const current = this.context.soundQueue.takeNext()!;
      this.context.currentSound = current;
      const connection = joinVoiceChannel({
        channelId: current.channel.id,
        guildId: current.channel.guild.id,
        adapterCreator: current.channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
        selfDeaf: false,
      });

      this.context.botAudioPlayer.subscribe(connection);
      logger.info('Playing sound "%s", %s sounds in the queue.', current.sound.name, this.context.soundQueue.length);

      const soundFileUrl = `${ this.environment.soundsBaseUrl }/${ current.sound.file.fullName }`;
      logger.info('Attempting to play file "%s"', soundFileUrl);

      let soundStream: Readable;

      try {
        // This probably isn't a Readable, but it seems to work as one and Axios is providing no help.
        // eslint-disable-next-line no-await-in-loop
        const soundStreamResponse = await axios.get<Readable>(soundFileUrl, { responseType: 'stream' });
        soundStream = soundStreamResponse.data;
      } catch (e) {
        logger.error('Failed to get sound "%s"', soundFileUrl);
        logger.error(e);
        this.context.currentSound = undefined;
        continue;
      }

      // eslint-disable-next-line no-await-in-loop
      await this.context.botAudioPlayer.play(soundStream);
      this.context.currentSound = undefined;
    }

    this.soundPlaying = false;
  }

  private async onServerSoundRequest(userID: string, soundRequest: string) {
    const soundBoardUser = (await this.client.guilds.fetch(this.environment.homeGuildId)).voiceStates.cache.find(x => x.id === userID);

    if (!soundBoardUser?.channel) {
      logger.info('Sound request received but user is not connected');
      return;
    }

    const sound = await this.context.soundsService.getSound(soundRequest);

    if (!sound) {
      logger.error('Couldn\'t find sound "%s"', soundRequest);
      return;
    }

    this.context.soundQueue.add({ sound, channel: soundBoardUser.channel });
    logger.info(`Server sound request. User: ${ userID }. Queue length: ${ this.context.soundQueue.length }.`);
  }

  private async onServerSkipRequest(userID: string, skipAll: boolean) {
    const soundBoardUser = (await this.client.guilds.fetch(this.environment.homeGuildId)).voiceStates.cache.find(x => x.id === userID);
    if (!soundBoardUser?.channel) {
      logger.info('Skip request received but user is not connected');
      return;
    }
    if (skipAll) this.context.soundQueue.clear();
    this.context.botAudioPlayer.stop();
  }
}
