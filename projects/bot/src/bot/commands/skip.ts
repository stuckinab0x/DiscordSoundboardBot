import { ChatInputCommandInteraction, ApplicationCommandOptionType, MessageFlags } from 'discord.js';
import BotContext from '../bot-context';
import Command from './command';

const skipCommandOption = 'count';
export class SkipCommand extends Command {
  constructor() {
    super('skip', 'Skip currently playing sound(s)');
    this.commandData.options = [{
      name: skipCommandOption,
      type: ApplicationCommandOptionType.String,
      required: false,
      description: 'Enter amount to skip (including currently playing) or "all" to clear the queue entirely.',
    }];
  }

  execute(interaction: ChatInputCommandInteraction, context: BotContext): Promise<any> {
    const skipOption = interaction.options.getString(skipCommandOption);
    if (context.botAudioPlayer.state === 'idle' && context.soundQueue.length === 0)
      return interaction.reply({ content: 'No sounds currently playing or in queue! Why not try "/sound limmy are you deaf" ? :ear_with_hearing_aid: :smile:', flags: MessageFlags.Ephemeral });
    if (!skipOption) {
      context.botAudioPlayer.stop();
      return interaction.reply({ content: 'Current sound skipped.', ephemeral: false });
    }
    if (skipOption === 'all') {
      context.botAudioPlayer.stop();
      context.soundQueue.clear();
      return interaction.reply({ content: 'Skipped all sounds. Queue is now empty.', ephemeral: false });
    }
    const count = Number(skipOption);
    if (Number.isInteger(count)) {
      const reply = (count > context.soundQueue.length) ? 'All sounds skipped (count option was >= number of current sounds.)' : `Skipped ${ skipOption } sound(s).`;
      context.botAudioPlayer.stop();
      context.soundQueue.skip(count);
      return interaction.reply({ content: reply, ephemeral: false });
    }
    return interaction.reply({ content: 'Invalid value for count entered. Try a whole number or "all" without quotes.', flags: MessageFlags.Ephemeral });
  }
}
export default new SkipCommand();
