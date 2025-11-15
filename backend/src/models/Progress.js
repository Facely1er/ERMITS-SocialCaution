const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  currentLevelPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  nextLevelPoints: {
    type: Number,
    default: 100,
    min: 0
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  assessmentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  socialShares: {
    type: Number,
    default: 0,
    min: 0
  },
  badges: [{
    type: String,
    enum: [
      'first-assessment', 'assessment-master', 'action-hero', 'action-champion',
      'streak-starter', 'streak-master', 'social-butterfly', 'security-expert',
      '30day-challenge-starter', '30day-week-one', '30day-week-two', 
      '30day-week-three', '30day-complete', 'privacy-protector', 'data-guardian',
      'security-champion', 'privacy-advocate', 'digital-citizen'
    ]
  }],
  statistics: {
    totalAssessments: {
      type: Number,
      default: 0
    },
    completedAssessments: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    totalActionItems: {
      type: Number,
      default: 0
    },
    completedActionItems: {
      type: Number,
      default: 0
    },
    totalChallenges: {
      type: Number,
      default: 0
    },
    completedChallenges: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    }
  },
  preferences: {
    showProgress: {
      type: Boolean,
      default: true
    },
    showBadges: {
      type: Boolean,
      default: true
    },
    showStreak: {
      type: Boolean,
      default: true
    },
    notifications: {
      achievements: {
        type: Boolean,
        default: true
      },
      milestones: {
        type: Boolean,
        default: true
      },
      streakReminders: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
progressSchema.index({ userId: 1 });
progressSchema.index({ totalPoints: -1 });
progressSchema.index({ level: -1 });
progressSchema.index({ streak: -1 });

// Virtual for level progress percentage
progressSchema.virtual('levelProgressPercentage').get(function() {
  if (this.nextLevelPoints === 0) return 100;
  return Math.round((this.currentLevelPoints / this.nextLevelPoints) * 100);
});

// Virtual for points needed for next level
progressSchema.virtual('pointsToNextLevel').get(function() {
  return Math.max(0, this.nextLevelPoints - this.currentLevelPoints);
});

// Method to add points
progressSchema.methods.addPoints = async function(points, source = 'general') {
  this.totalPoints += points;
  this.currentLevelPoints += points;
  
  // Check if level up
  while (this.currentLevelPoints >= this.nextLevelPoints) {
    this.currentLevelPoints -= this.nextLevelPoints;
    this.level += 1;
    this.nextLevelPoints = this.calculateNextLevelPoints(this.level);
  }
  
  // Update statistics based on source
  this.updateStatistics(source);
  
  return this.save();
};

// Method to calculate next level points
progressSchema.methods.calculateNextLevelPoints = function(level) {
  // Progressive point requirements: 100, 200, 300, 500, 750, 1000, etc.
  if (level <= 5) {
    return level * 100;
  } else if (level <= 10) {
    return 500 + (level - 5) * 150;
  } else {
    return 1250 + (level - 10) * 200;
  }
};

// Method to update statistics
progressSchema.methods.updateStatistics = function(source) {
  switch (source) {
    case 'assessment':
      this.statistics.totalAssessments += 1;
      break;
    case 'action':
      this.statistics.totalActionItems += 1;
      break;
    case 'challenge':
      this.statistics.totalChallenges += 1;
      break;
    case 'social':
      this.statistics.socialShares += 1;
      break;
  }
};

// Method to update streak
progressSchema.methods.updateStreak = function() {
  const today = new Date();
  const lastActivity = new Date(this.lastActivityDate);
  const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    this.streak += 1;
    this.statistics.currentStreak = this.streak;
    if (this.streak > this.statistics.longestStreak) {
      this.statistics.longestStreak = this.streak;
    }
  } else if (daysDiff > 1) {
    this.streak = 1;
    this.statistics.currentStreak = 1;
  }
  
  this.lastActivityDate = today;
  return this.save();
};

// Method to add badge
progressSchema.methods.addBadge = function(badgeId) {
  if (!this.badges.includes(badgeId)) {
    this.badges.push(badgeId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Method to check and award badges
progressSchema.methods.checkBadges = function() {
  const badges = [];
  
  // Assessment badges
  if (this.statistics.totalAssessments >= 1 && !this.badges.includes('first-assessment')) {
    badges.push('first-assessment');
  }
  if (this.statistics.totalAssessments >= 5 && !this.badges.includes('assessment-master')) {
    badges.push('assessment-master');
  }
  
  // Action badges
  if (this.statistics.completedActionItems >= 1 && !this.badges.includes('action-hero')) {
    badges.push('action-hero');
  }
  if (this.statistics.completedActionItems >= 10 && !this.badges.includes('action-champion')) {
    badges.push('action-champion');
  }
  
  // Streak badges
  if (this.streak >= 3 && !this.badges.includes('streak-starter')) {
    badges.push('streak-starter');
  }
  if (this.streak >= 7 && !this.badges.includes('streak-master')) {
    badges.push('streak-master');
  }
  
  // Social badges
  if (this.socialShares >= 5 && !this.badges.includes('social-butterfly')) {
    badges.push('social-butterfly');
  }
  
  // Security badges
  if (this.statistics.averageScore >= 90 && !this.badges.includes('security-expert')) {
    badges.push('security-expert');
  }
  
  // Challenge badges
  if (this.statistics.totalChallenges >= 1 && !this.badges.includes('30day-challenge-starter')) {
    badges.push('30day-challenge-starter');
  }
  if (this.statistics.completedChallenges >= 1 && !this.badges.includes('privacy-protector')) {
    badges.push('privacy-protector');
  }
  
  // Add all new badges
  badges.forEach(badge => this.addBadge(badge));
  
  return badges;
};

// Method to get progress summary
progressSchema.methods.getSummary = function() {
  return {
    id: this._id,
    userId: this.userId,
    totalPoints: this.totalPoints,
    level: this.level,
    currentLevelPoints: this.currentLevelPoints,
    nextLevelPoints: this.nextLevelPoints,
    levelProgressPercentage: this.levelProgressPercentage,
    pointsToNextLevel: this.pointsToNextLevel,
    streak: this.streak,
    badges: this.badges,
    statistics: this.statistics,
    lastActivityDate: this.lastActivityDate
  };
};

// Static method to get leaderboard
progressSchema.statics.getLeaderboard = function(limit = 10) {
  return this.find()
    .populate('userId', 'firstName lastName avatar')
    .sort({ totalPoints: -1, level: -1 })
    .limit(limit)
    .select('userId totalPoints level streak badges statistics');
};

module.exports = mongoose.model('Progress', progressSchema);