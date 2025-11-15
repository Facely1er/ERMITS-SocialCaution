const Parser = require('rss-parser');
const CautionItem = require('../models/CautionItem');
const RSSFeed = require('../models/RSSFeed');
const logger = require('../utils/logger');

class RSSService {
  constructor() {
    this.parser = new Parser({
      timeout: 10000,
      customFields: {
        item: [
          ['description', 'description'],
          ['content:encoded', 'content'],
          ['dc:creator', 'creator'],
          ['pubDate', 'publishedDate']
        ]
      }
    });
  }

  /**
   * Fetch and parse an RSS feed
   */
  async fetchFeed(feedUrl) {
    try {
      const feed = await this.parser.parseURL(feedUrl);
      return feed;
    } catch (error) {
      logger.error(`Error fetching RSS feed ${feedUrl}:`, error);
      throw error;
    }
  }

  /**
   * Determine severity based on keywords in title/description
   */
  determineSeverity(title, description) {
    const text = `${title} ${description}`.toLowerCase();

    const criticalKeywords = ['critical', 'zero-day', 'urgent', 'breach', 'ransomware', 'exploit'];
    const highKeywords = ['vulnerability', 'malware', 'attack', 'threat', 'phishing', 'hack'];
    const mediumKeywords = ['warning', 'alert', 'risk', 'concern', 'caution'];

    if (criticalKeywords.some(keyword => text.includes(keyword))) {
      return 'critical';
    }
    if (highKeywords.some(keyword => text.includes(keyword))) {
      return 'high';
    }
    if (mediumKeywords.some(keyword => text.includes(keyword))) {
      return 'medium';
    }
    return 'low';
  }

  /**
   * Extract tags from content
   */
  extractTags(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const tags = [];

    const tagKeywords = {
      'password': ['password', 'credential'],
      'email': ['email', 'phishing'],
      'social-media': ['facebook', 'twitter', 'instagram', 'tiktok', 'social media'],
      'mobile': ['mobile', 'smartphone', 'android', 'ios', 'iphone'],
      'financial': ['bank', 'credit card', 'financial', 'payment'],
      'children': ['children', 'kids', 'parental', 'teen'],
      'government': ['government', 'regulation', 'law', 'policy']
    };

    Object.keys(tagKeywords).forEach(tag => {
      if (tagKeywords[tag].some(keyword => text.includes(keyword))) {
        tags.push(tag);
      }
    });

    return tags;
  }

  /**
   * Process a single RSS feed and save caution items
   */
  async processFeed(rssFeedDoc) {
    try {
      logger.info(`Processing RSS feed: ${rssFeedDoc.name} (${rssFeedDoc.url})`);

      const feed = await this.fetchFeed(rssFeedDoc.url);
      let newItemsCount = 0;

      for (const item of feed.items) {
        // Check if item already exists
        const existingItem = await CautionItem.findOne({
          link: item.link,
          rssFeedId: rssFeedDoc._id
        });

        if (!existingItem) {
          const cautionItem = new CautionItem({
            title: item.title,
            description: item.contentSnippet || item.description || '',
            content: item.content || item['content:encoded'] || item.description || '',
            category: rssFeedDoc.category,
            personas: rssFeedDoc.personas,
            severity: this.determineSeverity(item.title, item.contentSnippet || ''),
            source: {
              name: rssFeedDoc.source,
              url: rssFeedDoc.url
            },
            publishedDate: item.pubDate ? new Date(item.pubDate) : new Date(),
            link: item.link,
            rssFeedId: rssFeedDoc._id,
            tags: this.extractTags(item.title, item.contentSnippet || ''),
            isActive: true
          });

          await cautionItem.save();
          newItemsCount++;
        }
      }

      // Update last fetched time
      rssFeedDoc.lastFetched = new Date();
      await rssFeedDoc.save();

      logger.info(`Processed ${newItemsCount} new items from ${rssFeedDoc.name}`);
      return { success: true, newItemsCount };

    } catch (error) {
      logger.error(`Error processing feed ${rssFeedDoc.name}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process all active RSS feeds
   */
  async processAllFeeds() {
    try {
      const feeds = await RSSFeed.find({ isActive: true });
      logger.info(`Processing ${feeds.length} active RSS feeds`);

      const results = [];
      for (const feed of feeds) {
        // Check if feed needs to be updated based on updateFrequency
        const now = new Date();
        const shouldUpdate = !feed.lastFetched ||
          (now - feed.lastFetched) >= feed.updateFrequency;

        if (shouldUpdate) {
          const result = await this.processFeed(feed);
          results.push({ feed: feed.name, ...result });
        } else {
          logger.info(`Skipping ${feed.name} - not due for update yet`);
        }
      }

      return results;
    } catch (error) {
      logger.error('Error processing all feeds:', error);
      throw error;
    }
  }

  /**
   * Get caution items for specific persona(s)
   */
  async getCautionItemsForPersona(personaName, options = {}) {
    const {
      limit = 50,
      skip = 0,
      category = null,
      severity = null,
      startDate = null
    } = options;

    const query = {
      personas: personaName,
      isActive: true
    };

    if (category) query.category = category;
    if (severity) query.severity = severity;
    if (startDate) query.publishedDate = { $gte: new Date(startDate) };

    try {
      const items = await CautionItem.find(query)
        .sort({ publishedDate: -1 })
        .limit(limit)
        .skip(skip)
        .lean();

      const total = await CautionItem.countDocuments(query);

      return { items, total };
    } catch (error) {
      logger.error('Error getting caution items:', error);
      throw error;
    }
  }

  /**
   * Clean up old caution items (older than specified days)
   */
  async cleanupOldItems(daysToKeep = 90) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const result = await CautionItem.deleteMany({
        publishedDate: { $lt: cutoffDate }
      });

      logger.info(`Cleaned up ${result.deletedCount} old caution items`);
      return result.deletedCount;
    } catch (error) {
      logger.error('Error cleaning up old items:', error);
      throw error;
    }
  }
}

module.exports = new RSSService();
