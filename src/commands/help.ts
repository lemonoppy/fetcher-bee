import {
  ButtonInteraction,
  ChatInputCommandInteraction,
  ComponentType,
  InteractionEditReplyOptions,
  MessagePayload,
  SlashCommandBuilder,
} from 'discord.js';
import { withErrorHandling } from 'src/lib/errorHandling';
import {
  getMainHelpButtons,
  handleHelpButtons,
} from 'src/lib/helpers/buttons/helpButton';
import { logger } from 'src/lib/logger';
import { SlashCommand } from 'typings/command';

const execute = async (interaction: ChatInputCommandInteraction) => {
  const row = getMainHelpButtons();

  await interaction.reply({
    content: 'Loading help information...',
    components: [row],
  });

  const reply = await interaction.fetchReply();

  const fakeButtonInteraction = {
    customId: 'help_main',
    client: interaction.client,
    user: interaction.user,
    member: interaction.member,
    update: async (
      data: string | MessagePayload | InteractionEditReplyOptions,
    ) => {
      return await interaction.editReply(data);
    },
  } as unknown as ButtonInteraction;

  await handleHelpButtons(fakeButtonInteraction);

  const collector = reply.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
  });

  collector.on('collect', async (i: ButtonInteraction) => {
    if (i.user.id !== interaction.user.id) {
      await i
        .reply({
          content: 'Only the command user can use these buttons.',
          ephemeral: true,
        })
        .catch((error) => {
          logger.error(error);
        });
      return;
    }
    await handleHelpButtons(i);
  });

  collector.on('end', async () => {
    try {
      await interaction.editReply({
        components: [],
      });
    } catch (error) {
      logger.error(error);
    }
  });
};

export default {
  command: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display all available commands'),
  execute: withErrorHandling(execute, 'Failed to display help information.'),
} satisfies SlashCommand;
