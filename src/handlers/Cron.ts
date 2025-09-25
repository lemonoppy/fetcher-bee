import { logger } from 'src/lib/logger';

// Update this file to add cron jobs as well as initial data for the bot.
module.exports = async () => {
  // Add any initial data loading here
  // await SomeClient.reload();

  if (process.env.NODE_ENV !== 'production') {
    logger.info('✔ Successfully loaded initial data');
    return;
  }

  // Example cron jobs (uncomment and modify as needed):

  // Check for something every 30 minutes
  // new CronJob('0 */30 * * *', async () => {
  //   // Your periodic task here
  // }).start();

  // Daily task at midnight (00:00)
  // new CronJob('0 0 * * *', async () => {
  //   logger.info('Starting daily task...');
  //   // Your daily task here
  //   logger.info('Daily task completed');
  // }).start();

  logger.info('✔ Successfully loaded initial data and started cron jobs.');
};