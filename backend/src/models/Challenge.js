const mongoose = require('mongoose');

const dailyTaskSchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
    min: 1,
    max: 30
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
  category: {
    type: String,
    required: true,
    enum: ['password', 'browser', 'social', 'device', 'data', 'privacy-settings', 'education', 'tools']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  estimatedTime: {
    type: String,
    required: true,
    default: '15 minutes'
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: null
  },
  resources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['guide', 'tool', 'article', 'video'],
      default: 'guide'
    }
  }],
  tips: [{
    type: String,
    required: true
  }],
  points: {
    type: Number,
    default: 10,
    min: 0
  }
}, {
  timestamps: true
});

const challengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  currentDay: {
    type: Number,
    default: 1,
    min: 1,
    max: 30
  },
  completedDays: {
    type: Number,
    default: 0,
    min: 0,
    max: 30
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  totalPoints: {
    type: Number,
    default: 0,
    min: 0
  },
  milestones: {
    day7: {
      type: Boolean,
      default: false
    },
    day14: {
      type: Boolean,
      default: false
    },
    day21: {
      type: Boolean,
      default: false
    },
    day30: {
      type: Boolean,
      default: false
    }
  },
  achievements: {
    firstWeek: {
      type: Boolean,
      default: false
    },
    secondWeek: {
      type: Boolean,
      default: false
    },
    thirdWeek: {
      type: Boolean,
      default: false
    },
    privacyMaster: {
      type: Boolean,
      default: false
    },
    streakKeeper: {
      type: Boolean,
      default: false
    }
  },
  dailyTasks: [dailyTaskSchema],
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'abandoned'],
    default: 'active'
  },
  completedAt: Date,
  lastActivityDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
challengeSchema.index({ userId: 1, status: 1 });
challengeSchema.index({ startDate: -1 });
challengeSchema.index({ 'dailyTasks.day': 1 });
challengeSchema.index({ 'dailyTasks.completed': 1 });

// Virtual for progress percentage
challengeSchema.virtual('progressPercentage').get(function() {
  if (this.dailyTasks.length === 0) return 0;
  const completedTasks = this.dailyTasks.filter(task => task.completed).length;
  return Math.round((completedTasks / this.dailyTasks.length) * 100);
});

// Virtual for current streak
challengeSchema.virtual('currentStreak').get(function() {
  const today = new Date();
  const startDate = new Date(this.startDate);
  const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
  return Math.min(daysDiff, 30);
});

// Method to generate daily tasks
challengeSchema.methods.generateDailyTasks = function() {
  const taskTemplates = require('../data/challengeTasks');
  const tasks = [];
  
  for (let day = 1; day <= 30; day++) {
    const dayTasks = taskTemplates[day] || [];
    dayTasks.forEach(taskTemplate => {
      tasks.push({
        day,
        title: taskTemplate.title,
        description: taskTemplate.description,
        category: taskTemplate.category,
        difficulty: taskTemplate.difficulty,
        estimatedTime: taskTemplate.estimatedTime,
        resources: taskTemplate.resources || [],
        tips: taskTemplate.tips || [],
        points: taskTemplate.points || 10
      });
    });
  }
  
  this.dailyTasks = tasks;
  return this.save();
};

// Method to complete a task
challengeSchema.methods.completeTask = async function(taskId) {
  const task = this.dailyTasks.id(taskId);
  if (!task) {
    throw new Error('Task not found');
  }
  
  if (task.completed) {
    throw new Error('Task already completed');
  }
  
  task.completed = true;
  task.completedAt = new Date();
  
  // Update challenge progress
  this.completedDays = this.dailyTasks.filter(t => t.completed).length;
  this.totalPoints += task.points;
  
  // Update streak
  const today = new Date();
  const lastActivity = new Date(this.lastActivityDate);
  const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    this.streak += 1;
  } else if (daysDiff > 1) {
    this.streak = 1;
  }
  
  this.lastActivityDate = today;
  
  // Check milestones
  this.checkMilestones();
  
  return this.save();
};

// Method to check and update milestones
challengeSchema.methods.checkMilestones = function() {
  const completedDays = this.completedDays;
  
  if (completedDays >= 7 && !this.milestones.day7) {
    this.milestones.day7 = true;
  }
  if (completedDays >= 14 && !this.milestones.day14) {
    this.milestones.day14 = true;
  }
  if (completedDays >= 21 && !this.milestones.day21) {
    this.milestones.day21 = true;
  }
  if (completedDays >= 30 && !this.milestones.day30) {
    this.milestones.day30 = true;
    this.status = 'completed';
    this.completedAt = new Date();
  }
  
  // Check achievements
  if (completedDays >= 7 && !this.achievements.firstWeek) {
    this.achievements.firstWeek = true;
  }
  if (completedDays >= 14 && !this.achievements.secondWeek) {
    this.achievements.secondWeek = true;
  }
  if (completedDays >= 21 && !this.achievements.thirdWeek) {
    this.achievements.thirdWeek = true;
  }
  if (completedDays >= 30 && !this.achievements.privacyMaster) {
    this.achievements.privacyMaster = true;
  }
  if (this.streak >= 7 && !this.achievements.streakKeeper) {
    this.achievements.streakKeeper = true;
  }
};

// Method to get challenge summary
challengeSchema.methods.getSummary = function() {
  return {
    id: this._id,
    userId: this.userId,
    startDate: this.startDate,
    currentDay: this.currentDay,
    completedDays: this.completedDays,
    streak: this.streak,
    totalPoints: this.totalPoints,
    progressPercentage: this.progressPercentage,
    status: this.status,
    milestones: this.milestones,
    achievements: this.achievements,
    completedAt: this.completedAt
  };
};

module.exports = mongoose.model('Challenge', challengeSchema);