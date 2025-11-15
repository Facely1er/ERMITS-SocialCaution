const mongoose = require('mongoose');

const analysisResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['digital-footprint', 'data-breach-check', 'privacy-scan', 'password-strength']
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  analyzedAt: {
    type: Date,
    default: Date.now
  },
  summary: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, {
  timestamps: true
});

// Index for efficient queries
analysisResultSchema.index({ userId: 1, analyzedAt: -1 });
analysisResultSchema.index({ userId: 1, type: 1, analyzedAt: -1 });

// Virtual for risk level
analysisResultSchema.virtual('riskLevel').get(function() {
  if (this.data && this.data.riskLevel) {
    return this.data.riskLevel;
  }
  return 'unknown';
});

// Method to get formatted summary
analysisResultSchema.methods.getFormattedSummary = function() {
  if (this.summary) {
    return this.summary;
  }
  
  // Generate summary if not present
  if (this.data && this.data.results) {
    const results = this.data.results;
    const totalFound = results.filter(r => r.found).length;
    const highRiskFound = results.filter(r => r.risk === 'high' && r.found).length;
    const mediumRiskFound = results.filter(r => r.risk === 'medium' && r.found).length;
    const lowRiskFound = results.filter(r => r.risk === 'low' && r.found).length;
    
    return {
      totalFound,
      highRiskFound,
      mediumRiskFound,
      lowRiskFound,
      riskDistribution: {
        high: highRiskFound,
        medium: mediumRiskFound,
        low: lowRiskFound
      },
      overallRisk: this.data.riskLevel || 'unknown'
    };
  }
  
  return null;
};

// Static method to get user's analysis statistics
analysisResultSchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        lastAnalyzed: { $max: '$analyzedAt' },
        avgRiskLevel: {
          $avg: {
            $switch: {
              branches: [
                { case: { $eq: ['$data.riskLevel', 'high'] }, then: 3 },
                { case: { $eq: ['$data.riskLevel', 'medium'] }, then: 2 },
                { case: { $eq: ['$data.riskLevel', 'low'] }, then: 1 }
              ],
              default: 0
            }
          }
        }
      }
    }
  ]);
  
  return stats;
};

// Static method to get recent analyses
analysisResultSchema.statics.getRecentAnalyses = function(userId, limit = 5) {
  return this.find({ userId })
    .sort({ analyzedAt: -1 })
    .limit(limit)
    .select('type data.riskLevel analyzedAt createdAt')
    .lean();
};

module.exports = mongoose.model('AnalysisResult', analysisResultSchema);