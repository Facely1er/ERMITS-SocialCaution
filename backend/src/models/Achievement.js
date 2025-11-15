const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  achievementId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [255, 'Title cannot be more than 255 characters']
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true,
    maxlength: [10, 'Icon cannot be more than 10 characters']
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['assessment', 'action', 'streak', 'social', 'security', 'challenge', 'milestone', 'special']
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  unlocked: {
    type: Boolean,
    default: false
  },
  unlockedAt: {
    type: Date,
    default: null
  },
  requirements: {
    type: {
      type: String,
      enum: ['points', 'assessments', 'actions', 'streak', 'score', 'challenges', 'social', 'custom'],
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true
    }
  },
  metadata: {
    source: {
      type: String,
      enum: ['system', 'challenge', 'assessment', 'action', 'social'],
      default: 'system'
    },
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      default: null
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      default: null
    }
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for user and achievement uniqueness
achievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });
achievementSchema.index({ userId: 1, unlocked: 1 });
achievementSchema.index({ category: 1, rarity: 1 });
achievementSchema.index({ unlockedAt: -1 });

// Virtual for time since unlocked
achievementSchema.virtual('timeSinceUnlocked').get(function() {
  if (!this.unlocked || !this.unlockedAt) return null;
  const now = new Date();
  const diffMs = now - this.unlockedAt;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Method to unlock achievement
achievementSchema.methods.unlock = function() {
  if (this.unlocked) return Promise.resolve(this);
  
  this.unlocked = true;
  this.unlockedAt = new Date();
  
  return this.save();
};

// Method to check if requirements are met
achievementSchema.methods.checkRequirements = async function(userProgress) {
  if (this.unlocked) return false;
  
  const { type, value } = this.requirements;
  
  switch (type) {
    case 'points':
      return userProgress.totalPoints >= value;
    case 'assessments':
      return userProgress.statistics.totalAssessments >= value;
    case 'actions':
      return userProgress.statistics.completedActionItems >= value;
    case 'streak':
      return userProgress.streak >= value;
    case 'score':
      return userProgress.statistics.averageScore >= value;
    case 'challenges':
      return userProgress.statistics.completedChallenges >= value;
    case 'social':
      return userProgress.socialShares >= value;
    default:
      return false;
  }
};

// Static method to create initial achievements for user
achievementSchema.statics.createInitialAchievements = async function(userId) {
  const initialAchievements = [
    {
      achievementId: 'first-assessment',
      title: 'Privacy Explorer',
      description: 'Complete your first privacy assessment',
      icon: '🔍',
      points: 50,
      category: 'assessment',
      rarity: 'common',
      requirements: {
        type: 'assessments',
        value: 1,
        description: 'Complete 1 assessment'
      }
    },
    {
      achievementId: 'assessment-master',
      title: 'Assessment Master',
      description: 'Complete 5 privacy assessments',
      icon: '🏆',
      points: 200,
      category: 'assessment',
      rarity: 'uncommon',
      requirements: {
        type: 'assessments',
        value: 5,
        description: 'Complete 5 assessments'
      }
    },
    {
      achievementId: 'action-hero',
      title: 'Action Hero',
      description: 'Complete your first action item',
      icon: '⚡',
      points: 25,
      category: 'action',
      rarity: 'common',
      requirements: {
        type: 'actions',
        value: 1,
        description: 'Complete 1 action item'
      }
    },
    {
      achievementId: 'action-champion',
      title: 'Action Champion',
      description: 'Complete 10 action items',
      icon: '💪',
      points: 150,
      category: 'action',
      rarity: 'uncommon',
      requirements: {
        type: 'actions',
        value: 10,
        description: 'Complete 10 action items'
      }
    },
    {
      achievementId: 'streak-starter',
      title: 'Streak Starter',
      description: 'Maintain a 3-day activity streak',
      icon: '🔥',
      points: 100,
      category: 'streak',
      rarity: 'common',
      requirements: {
        type: 'streak',
        value: 3,
        description: 'Maintain a 3-day streak'
      }
    },
    {
      achievementId: 'streak-master',
      title: 'Streak Master',
      description: 'Maintain a 7-day activity streak',
      icon: '🌟',
      points: 300,
      category: 'streak',
      rarity: 'rare',
      requirements: {
        type: 'streak',
        value: 7,
        description: 'Maintain a 7-day streak'
      }
    },
    {
      achievementId: 'social-butterfly',
      title: 'Social Butterfly',
      description: 'Share your progress 5 times',
      icon: '🦋',
      points: 75,
      category: 'social',
      rarity: 'common',
      requirements: {
        type: 'social',
        value: 5,
        description: 'Share progress 5 times'
      }
    },
    {
      achievementId: 'security-expert',
      title: 'Security Expert',
      description: 'Achieve a 90%+ privacy score',
      icon: '🛡️',
      points: 500,
      category: 'security',
      rarity: 'epic',
      requirements: {
        type: 'score',
        value: 90,
        description: 'Achieve 90%+ privacy score'
      }
    },
    {
      achievementId: '30day-challenge-starter',
      title: 'Privacy Protector',
      description: 'Start your 30-day privacy protection plan',
      icon: '📅',
      points: 100,
      category: 'challenge',
      rarity: 'common',
      requirements: {
        type: 'challenges',
        value: 1,
        description: 'Start 1 challenge'
      }
    },
    {
      achievementId: '30day-complete',
      title: 'Privacy Master',
      description: 'Complete all 30 days of the protection plan',
      icon: '👑',
      points: 1000,
      category: 'challenge',
      rarity: 'legendary',
      requirements: {
        type: 'challenges',
        value: 1,
        description: 'Complete 1 full challenge'
      }
    }
  ];
  
  const achievements = initialAchievements.map(achievement => ({
    ...achievement,
    userId
  }));
  
  return this.insertMany(achievements);
};

// Static method to check and unlock achievements for user
achievementSchema.statics.checkAndUnlockAchievements = async function(userId, userProgress) {
  const achievements = await this.find({
    userId,
    unlocked: false
  });
  
  const unlockedAchievements = [];
  
  for (const achievement of achievements) {
    const requirementsMet = await achievement.checkRequirements(userProgress);
    if (requirementsMet) {
      await achievement.unlock();
      unlockedAchievements.push(achievement);
    }
  }
  
  return unlockedAchievements;
};

// Method to get achievement summary
achievementSchema.methods.getSummary = function() {
  return {
    id: this._id,
    achievementId: this.achievementId,
    title: this.title,
    description: this.description,
    icon: this.icon,
    points: this.points,
    category: this.category,
    rarity: this.rarity,
    unlocked: this.unlocked,
    unlockedAt: this.unlockedAt,
    timeSinceUnlocked: this.timeSinceUnlocked,
    requirements: this.requirements,
    isHidden: this.isHidden
  };
};

module.exports = mongoose.model('Achievement', achievementSchema);