const express = require('express');
const router = express.Router();
const CautionItem = require('../models/CautionItem');
const RSSFeed = require('../models/RSSFeed');
const RSSService = require('../services/RSSService');
const { protect } = require('../middleware/auth');
const User = require('../models/User');

/**
 * @route   GET /api/cautions
 * @desc    Get caution items for current user's persona
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.selectedPersona) {
      return res.status(400).json({
        success: false,
        message: 'Please select a persona first'
      });
    }

    const {
      page = 1,
      limit = 20,
      category,
      severity,
      startDate
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const options = {
      limit: parseInt(limit),
      skip,
      category,
      severity,
      startDate
    };

    const result = await RSSService.getCautionItemsForPersona(
      user.selectedPersona,
      options
    );

    res.json({
      success: true,
      data: result.items,
      pagination: {
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(result.total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching caution items',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/cautions/categories
 * @desc    Get available caution categories
 * @access  Public
 */
router.get('/categories', async (req, res) => {
  try {
    const categories = await CautionItem.distinct('category');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/cautions/:id
 * @desc    Get a specific caution item
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const cautionItem = await CautionItem.findById(req.params.id);

    if (!cautionItem) {
      return res.status(404).json({
        success: false,
        message: 'Caution item not found'
      });
    }

    // Increment view count
    cautionItem.viewCount += 1;
    await cautionItem.save();

    res.json({
      success: true,
      data: cautionItem
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching caution item',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/cautions/stats/summary
 * @desc    Get caution statistics for user's persona
 * @access  Private
 */
router.get('/stats/summary', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.selectedPersona) {
      return res.status(400).json({
        success: false,
        message: 'Please select a persona first'
      });
    }

    const query = {
      personas: user.selectedPersona,
      isActive: true
    };

    // Get counts by severity
    const bySeverity = await CautionItem.aggregate([
      { $match: query },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Get counts by category
    const byCategory = await CautionItem.aggregate([
      { $match: query },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Get recent items (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentCount = await CautionItem.countDocuments({
      ...query,
      publishedDate: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      data: {
        bySeverity,
        byCategory,
        recentCount,
        totalActive: await CautionItem.countDocuments(query)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching caution statistics',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/cautions/refresh
 * @desc    Manually trigger RSS feed refresh (admin only)
 * @access  Private/Admin
 */
router.post('/refresh', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }

    const results = await RSSService.processAllFeeds();

    res.json({
      success: true,
      message: 'RSS feeds refreshed successfully',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error refreshing feeds',
      error: error.message
    });
  }
});

module.exports = router;
