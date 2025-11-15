const mongoose = require('mongoose');

const cautionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: [
      'data-breach',
      'phishing',
      'social-media',
      'identity-theft',
      'online-safety',
      'financial-fraud',
      'privacy-laws',
      'device-security',
      'scams',
      'parental-controls',
      'general-security'
    ]
  },
  personas: [{
    type: String
  }],
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  source: {
    name: String,
    url: String
  },
  publishedDate: {
    type: Date,
    required: true
  },
  expiresAt: {
    type: Date
  },
  link: {
    type: String
  },
  rssFeedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RSSFeed'
  },
  tags: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  viewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
cautionItemSchema.index({ personas: 1, publishedDate: -1 });
cautionItemSchema.index({ category: 1, isActive: 1 });
cautionItemSchema.index({ publishedDate: -1 });
cautionItemSchema.index({ severity: 1 });

module.exports = mongoose.model('CautionItem', cautionItemSchema);
