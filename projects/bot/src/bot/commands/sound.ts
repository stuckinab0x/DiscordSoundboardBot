import { ButtonInteraction, CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton } from 'discord.js';
import { Sound } from 'botman-sounds';
import logger from '../../logger';
import BotContext from '../bot-context';
import { pickRandom } from '../utils';
import Command from './command';

const insults = ['dingus', 'doofus', 'dumb dumb'];
const soundOptionName = 'sound';

export class SoundCommand extends Command {
  constructor() {
    super('sound', 'Play a sound in your current voice channel.', { serverOnly: true });
    this.commandData.options = [{
      name: soundOptionName,
      type: 'STRING',
      required: true,
      description: 'The sound to play',
    }];
  }

  async execute(interaction: CommandInteraction, context: BotContext): Promise<any> {
    if (!(interaction.member instanceof GuildMember)) {
      logger.error('%s: Member wasn\'t real :(', interaction.id);
      return interaction.reply({
        content: 'Something went wrong :(.',
        ephemeral: true,
      });
    }

    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      logger.info('%s: User was not in a voice channel', interaction.id);
      return interaction.reply({
        content: 'You must be in a voice channel to use this command.',
        ephemeral: true,
      });
    }

    if (!voiceChannel.joinable) {
      logger.info('%s: User is in a private voice channel', interaction.id);
      return interaction.reply({
        content: `I'm not allowed in that channel, ${ pickRandom(insults) }.`,
        ephemeral: true,
      });
    }

    const soundName = interaction.options.getString(soundOptionName, true);

    if (!soundName) {
      logger.error('%s: No <soundname> argument was specified', interaction.id);
      return interaction.reply({
        content: 'You didn\'t tell me what to play!',
        ephemeral: true,
      });
    }

    const sound = await this.getSoundFile(soundName, interaction, context);

    if (!sound)
      return interaction.reply({
        content: `Couldn't find sound "${ soundName }".`,
        ephemeral: true,
      });

    context.soundQueue.add({ sound, channel: voiceChannel });
    logger.info('%s: Sound "%s" added to queue, length: %s', interaction.id, soundName, context.soundQueue.length);

    const successMessage = {
      content: `Your sound has been added to the queue at position #${ context.soundQueue.length }.`,
      ephemeral: true,
    };

    if (interaction.replied) return interaction.followUp(successMessage);
    return interaction.reply(successMessage);
  }

  private async getSoundFile(soundName: string, interaction: CommandInteraction, context: BotContext): Promise<Sound | null> {
    const sound = await context.soundsService.getSound(soundName);

    if (sound)
      return sound;

    logger.info('%s: No "%s" sound was found', interaction.id, soundName);

    const partialMatches = await context.soundsService.searchSounds(soundName);

    if (!partialMatches.length)
      return null;

    if (partialMatches.length === 1)
      return partialMatches[0];

    logger.info('%s: Found %s partial matches for "%s"', interaction.id, partialMatches.length, soundName);
    return this.getUserSoundChoice(soundName, interaction, partialMatches);
  }

  private async getUserSoundChoice(searchTerm: string, interaction: CommandInteraction, files: Sound[]): Promise<Sound> {
    const message = await interaction.reply({
      content: `Found multiple sounds that start with "${ searchTerm }", please choose one:`,
      ephemeral: true,
      components: this.createInteractionButtons(files.map(x => x.name)),
      fetchReply: true,
    });

    if (!(message instanceof Message)) {
      await interaction.editReply({
        content: 'Something went wrong, my bad, please try again.',
        components: [],
      });

      return Promise.reject(new Error('Interaction reply was not of expected type "Message"'));
    }

    let collectedButton: ButtonInteraction;
    try {
      collectedButton = await message.awaitMessageComponent({ componentType: 'BUTTON', time: 30000 });
    } catch (err) {
      logger.info('%s: User failed to make a selection within the time limit', interaction.id);

      await interaction.editReply({
        content: `No selection was made in time, try again ${ pickRandom(insults) }.`,
        components: [],
      });

      return Promise.reject(new Error('Timed out waiting for sound choice'));
    }

    const chosenFileIndex = Number(collectedButton.customId);
    const chosenFile = files[chosenFileIndex];
    interaction.editReply({ content: `You picked: ${ chosenFile.name }.`, components: [] });

    return chosenFile;
  }

  private createInteractionButtons(buttonLabels: string[]) {
    const buttons: MessageButton[] = buttonLabels.map((x, index) =>
      new MessageButton()
        .setCustomId(String(index))
        .setLabel(x)
        .setStyle(1));

    const components: MessageActionRow[] = [];

    while (buttons.length > 0) {
      const row = new MessageActionRow().addComponents(buttons.splice(0, 5));
      components.push(row);
    }

    return components;
  }
}

export default new SoundCommand();
