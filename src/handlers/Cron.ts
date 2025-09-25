import { CronJob } from 'cron';
import { Client, TextChannel } from 'discord.js';
import { getRandomCube, trackCubeSelection } from 'src/lib/cubes';
import { logger } from 'src/lib/logger';

// Update this file to add cron jobs as well as initial data for the bot.
module.exports = async (client: Client) => {
  // Add any initial data loading here
  // await SomeClient.reload();

  // Load initial data
  logger.info('✔ Successfully loaded initial data');

  if (process.env.NODE_ENV !== 'production') {
    logger.info('Development mode: Cron jobs will still be started for testing');
  }
  // Hourly rp1p1 from 9:30 AM to 7:30 PM
  // Cron pattern: minute hour * * * (18 9-19 means at 18 minutes past each hour from 9 AM to 7 PM)
  new CronJob('30 9-19 * * *', async () => {
    try {
      logger.info('Starting hourly rp1p1 posting...');

      const channelId = process.env.RP1P1_CHANNEL_ID;
      if (!channelId) {
        logger.warn('RP1P1_CHANNEL_ID not configured, skipping hourly rp1p1');
        return;
      }

      const channel = client.channels.cache.get(channelId) as TextChannel;
      if (!channel) {
        logger.error(`Channel with ID ${channelId} not found`);
        return;
      }

      const { key, cube } = getRandomCube();

      // Track the cube selection with bot user info
      await trackCubeSelection(
        key,
        client.user?.id || 'bot',
        'Fetcher Bee'
      );

      // Generate a random integer for the pack image
      const randomInt = Math.floor(Math.random() * 1000000);

      // Construct the CubeCobra sample pack image URL
      const imageUrl = `https://www.cubecobra.com/cube/samplepackimage/${cube.id}/${randomInt}.png`;

      await channel.send({
        content: `**Fetcher Bee's Gift**\n**${key}** - ${cube.description}\n${imageUrl}`,
      });

      logger.info(`Posted hourly rp1p1 for ${key} to channel ${channelId}`);
    } catch (error) {
      logger.error('Error posting hourly rp1p1:', error);
    }
  }).start();

  logger.info('✔ Successfully loaded initial data and started cron jobs.');
};