import { ChatInputCommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import axios from 'axios';
import { errors } from 'botman-sounds';
import Command from './command';
import BotContext from '../bot-context';
import constants from '../constants';

export class AddSoundCommand extends Command {
  constructor() {
    super('addsound', 'Upload a new sound.');
    this.commandData.options = [{
      name: 'soundfile',
      type: ApplicationCommandOptionType.Attachment,
      required: true,
      description: `The file to upload (${ constants.soundFileExtensions })`,
    },
    {
      name: 'soundname',
      type: ApplicationCommandOptionType.String,
      required: true,
      description: 'A name for the sound',
    }];
  }

  async execute(interaction: ChatInputCommandInteraction, context: BotContext): Promise<any> {
    try {
      const soundUrl = interaction.options.getAttachment('soundfile', true).url;
      const soundName = interaction.options.getString('soundname', true);
      const attachmentRes = await axios.get(soundUrl, { responseType: 'arraybuffer' });
      await context.soundsService.addSound({ name: soundName, file: attachmentRes.data });
    } catch (error: any) {
      if (error.message === errors.unsupportedFileExtension)
        return interaction.reply({ content: `Wrong file type, try ${ constants.soundFileExtensions }`, ephemeral: true });
      if (error.message === errors.soundAlreadyExists)
        return interaction.reply({ content: 'We already have a sound with that name! :stuck_out_tongue_winking_eye:', ephemeral: true });
      return interaction.reply({ content: 'Something went wrong :(', ephemeral: true });
    }

    return interaction.reply({ content: 'Your sound has been added!', ephemeral: true });
  }
}

export default new AddSoundCommand();
