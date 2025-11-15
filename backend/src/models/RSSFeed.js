const mongoose = require('mongoose');

const rssFeedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true
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
    type: String,
    ref: 'Persona'
  }],
  updateFrequency: {
    type: Number,
    default: 3600000, // 1 hour in milliseconds
    min: 300000 // minimum 5 minutes
  },
  lastFetched: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

rssFeedSchema.index({ category: 1, isActive: 1 });
rssFeedSchema.index({ personas: 1 });

module.exports = mongoose.model('RSSFeed', rssFeedSchema);
