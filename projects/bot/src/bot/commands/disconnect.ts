import { CommandInteraction, MessageFlags } from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import Command from './command';
import { pickRandom } from '../utils';

const byeMessages = ['Bye then :(', 'https://youtu.be/95nJtU6hSeg?t=46', 'Oh, okay...', 'Whatever.', 'Server fuckin\' sucks anyway.'];
const notInAChannelMessages = ['I\'m not even in a channel, wtf bro?', 'No.', 'Nyet.', 'Nej.', 'Make me.', 'I wouldn\'t.'];

export class DisconnectCommand extends Command {
  constructor() {
    super('disconnect', 'Disconnect the bot from a voice channel.', { serverOnly: true });
  }

  async execute(interaction: CommandInteraction): Promise<any> {
    let reply: string;

    const connection = getVoiceConnection(interaction.guild!.id);
    if (connection) {
      connection.disconnect();
      reply = pickRandom(byeMessages);
    } else {
      reply = pickRandom(notInAChannelMessages);
    }

    return interaction.reply({
      content: reply,
      flags: MessageFlags.Ephemeral,
    });
  }
}

export default new DisconnectCommand();
