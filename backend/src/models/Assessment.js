const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  answeredAt: {
    type: Date,
    default: Date.now
  }
});

const categoryScoreSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  maxPossibleScore: {
    type: Number,
    required: true
  },
  questionCount: {
    type: Number,
    required: true
  },
  averageScore: {
    type: Number,
    required: true
  }
});

const actionItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  questionId: {
    type: String,
    required: true
  },
  steps: [{
    type: String,
    required: true
  }],
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
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: Date,
  dueDate: Date,
  estimatedTime: {
    type: String,
    default: '15 minutes'
  }
});

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['exposure', 'privacy-rights', 'security', 'complete'],
    required: true
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  answers: [answerSchema],
  results: {
    totalScore: {
      type: Number,
      required: true,
      min: 0
    },
    maxPossibleScore: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    userLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    categoryScores: [categoryScoreSchema],
    overallRiskLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    strengths: [{
      category: String,
      score: Number,
      description: String
    }],
    weaknesses: [{
      category: String,
      score: Number,
      description: String,
      priority: String
    }]
  },
  actionPlan: [actionItemSchema],
  recommendations: [{
    type: {
      type: String,
      enum: ['immediate', 'short-term', 'long-term'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true
    },
    category: {
      type: String,
      required: true
    },
    estimatedTime: String,
    resources: [{
      title: String,
      url: String,
      type: String
    }]
  }],
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  deviceInfo: {
    userAgent: String,
    platform: String,
    browser: String,
    version: String
  },
  ipAddress: String,
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
assessmentSchema.index({ userId: 1, type: 1 });
assessmentSchema.index({ userId: 1, status: 1 });
assessmentSchema.index({ 'results.overallRiskLevel': 1 });
assessmentSchema.index({ completedAt: -1 });
assessmentSchema.index({ createdAt: -1 });

// Virtual for duration
assessmentSchema.virtual('duration').get(function() {
  if (this.completedAt && this.startedAt) {
    return Math.round((this.completedAt - this.startedAt) / 1000 / 60); // in minutes
  }
  return null;
});

// Method to calculate category scores
assessmentSchema.methods.calculateCategoryScores = function() {
  const categoryTotals = {};
  const categoryCounts = {};
  const categoryMaxScores = {};

  this.answers.forEach(answer => {
    const question = this.getQuestionById(answer.questionId);
    if (question) {
      const category = question.category;
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        categoryCounts[category] = 0;
        categoryMaxScores[category] = 0;
      }
      
      categoryTotals[category] += answer.score;
      categoryCounts[category]++;
      categoryMaxScores[category] += 3; // Max score per question
    }
  });

  const categoryScores = Object.keys(categoryTotals).map(category => {
    const totalScore = categoryTotals[category];
    const maxScore = categoryMaxScores[category];
    const percentage = Math.round((totalScore / maxScore) * 100);
    
    return {
      category,
      score: percentage,
      maxPossibleScore: maxScore,
      questionCount: categoryCounts[category],
      averageScore: Math.round(totalScore / categoryCounts[category] * 10) / 10
    };
  });

  return categoryScores;
};

// Method to get question by ID (would need to import question data)
assessmentSchema.methods.getQuestionById = function() {
  // This would typically fetch from a questions collection or static data
  // For now, return null - this would be implemented with actual question data
  return null;
};

// Method to generate action plan
assessmentSchema.methods.generateActionPlan = function() {
  const actionItems = [];
  
  this.results.categoryScores.forEach(category => {
    if (category.score < 70) { // Below 70% needs improvement
      const priority = category.score < 40 ? 'critical' : 
                     category.score < 60 ? 'high' : 'medium';
      
      actionItems.push({
        title: `Improve ${category.category}`,
        description: `Your ${category.category} score is ${category.score}%. Focus on improving this area.`,
        priority,
        category: category.category,
        questionId: 'category-improvement',
        steps: [
          `Review ${category.category} best practices`,
          'Update your privacy settings',
          'Implement recommended security measures',
          'Monitor your progress regularly'
        ],
        resources: [
          {
            title: `${category.category} Privacy Guide`,
            url: `/resources/guides/${category.category.toLowerCase().replace(/\s+/g, '-')}`,
            type: 'guide'
          }
        ],
        estimatedTime: priority === 'critical' ? '2 hours' : '1 hour'
      });
    }
  });

  return actionItems;
};

// Method to get assessment summary
assessmentSchema.methods.getSummary = function() {
  return {
    id: this._id,
    type: this.type,
    status: this.status,
    score: this.results.percentage,
    level: this.results.userLevel,
    riskLevel: this.results.overallRiskLevel,
    completedAt: this.completedAt,
    duration: this.duration,
    actionItemsCount: this.actionPlan.length,
    completedActionItems: this.actionPlan.filter(item => item.isCompleted).length
  };
};

module.exports = mongoose.model('Assessment', assessmentSchema);