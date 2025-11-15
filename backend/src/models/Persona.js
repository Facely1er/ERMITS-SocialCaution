const mongoose = require('mongoose');

const personaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '👤'
  },
  riskCategories: [{
    type: String,
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
      'parental-controls'
    ]
  }],
  privacyRights: [{
    title: String,
    description: String,
    actionable: Boolean
  }],
  targetAudience: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Persona', personaSchema);
