const cron = require('node-cron');
const RSSService = require('../services/RSSService');
const logger = require('../utils/logger');

/**
 * Schedule RSS feed updates
 * Runs every hour
 */
function startRSSCronJob() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    logger.info('Starting scheduled RSS feed update');

    try {
      const results = await RSSService.processAllFeeds();
      logger.info('Scheduled RSS feed update completed', { results });
    } catch (error) {
      logger.error('Error in scheduled RSS feed update:', error);
    }
  });

  // Cleanup old items every day at 2 AM
  cron.schedule('0 2 * * *', async () => {
    logger.info('Starting cleanup of old caution items');

    try {
      const deletedCount = await RSSService.cleanupOldItems(90);
      logger.info(`Cleanup completed: ${deletedCount} items deleted`);
    } catch (error) {
      logger.error('Error in cleanup job:', error);
    }
  });

  logger.info('RSS cron jobs scheduled');
}

module.exports = { startRSSCronJob };
