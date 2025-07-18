const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    enum: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Social Science', 'Computer Science']
  },
  class: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  board: {
    type: String,
    required: true,
    enum: ['CBSE', 'ICSE', 'State'],
    default: 'CBSE'
  },
  chapters: [{
    type: String,
    required: true,
    trim: true
  }],
  type: {
    type: String,
    required: true,
    enum: ['weekly', 'monthly', 'mock', 'practice', 'assessment', 'quiz']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard', 'Mixed'],
    default: 'Medium'
  },
  duration: {
    type: Number, // in minutes
    required: true,
    min: 5,
    max: 180
  },
  totalMarks: {
    type: Number,
    required: true,
    min: 1
  },
  passingMarks: {
    type: Number,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['MCQ', 'MSQ', 'True/False', 'Short', 'Long', 'Numerical'],
      required: true
    },
    options: [{
      text: {
        type: String,
        required: true
      },
      isCorrect: {
        type: Boolean,
        default: false
      }
    }],
    correctAnswer: {
      type: String // For non-MCQ questions
    },
    marks: {
      type: Number,
      required: true,
      min: 0.5
    },
    negativeMarks: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    chapter: {
      type: String,
      required: true
    },
    topic: {
      type: String,
      trim: true
    },
    explanation: {
      type: String,
      trim: true
    },
    hints: [{
      type: String,
      trim: true
    }],
    tags: [{
      type: String,
      trim: true
    }],
    imageUrl: {
      type: String
    },
    order: {
      type: Number,
      required: true
    }
  }],
  instructions: [{
    type: String,
    trim: true
  }],
  schedule: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    isScheduled: {
      type: Boolean,
      default: false
    }
  },
  settings: {
    showResultsImmediately: {
      type: Boolean,
      default: true
    },
    showCorrectAnswers: {
      type: Boolean,
      default: true
    },
    allowReview: {
      type: Boolean,
      default: true
    },
    shuffleQuestions: {
      type: Boolean,
      default: false
    },
    shuffleOptions: {
      type: Boolean,
      default: false
    },
    allowSkipping: {
      type: Boolean,
      default: true
    },
    webcamProctoring: {
      type: Boolean,
      default: false
    },
    limitAttempts: {
      type: Number,
      default: 1,
      min: 1,
      max: 5
    }
  },
  analytics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    },
    passRate: {
      type: Number,
      default: 0
    },
    topScore: {
      type: Number,
      default: 0
    },
    questionAnalytics: [{
      questionId: mongoose.Schema.Types.ObjectId,
      correctAttempts: {
        type: Number,
        default: 0
      },
      totalAttempts: {
        type: Number,
        default: 0
      },
      averageTime: {
        type: Number,
        default: 0
      }
    }]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Test attempt schema
const testAttemptSchema = new mongoose.Schema({
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  attemptNumber: {
    type: Number,
    required: true,
    default: 1
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  timeSpent: {
    type: Number // in minutes
  },
  status: {
    type: String,
    enum: ['started', 'submitted', 'auto-submitted', 'abandoned'],
    default: 'started'
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    selectedOption: {
      type: String
    },
    textAnswer: {
      type: String
    },
    isCorrect: {
      type: Boolean
    },
    marksObtained: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number // in seconds
    },
    isSkipped: {
      type: Boolean,
      default: false
    },
    reviewFlag: {
      type: Boolean,
      default: false
    }
  }],
  score: {
    obtained: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      default: 0
    }
  },
  result: {
    type: String,
    enum: ['Pass', 'Fail', 'Pending'],
    default: 'Pending'
  },
  rank: {
    type: Number
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    }
  },
  analysis: {
    strongTopics: [{
      type: String
    }],
    weakTopics: [{
      type: String
    }],
    timeManagement: {
      type: String,
      enum: ['Excellent', 'Good', 'Average', 'Poor']
    },
    suggestions: [{
      type: String
    }]
  }
}, {
  timestamps: true
});

// Indexes for Test model
testSchema.index({ subject: 1, class: 1, board: 1 });
testSchema.index({ type: 1, difficulty: 1 });
testSchema.index({ 'schedule.startDate': 1, 'schedule.endDate': 1 });
testSchema.index({ isActive: 1, isPublished: 1 });
testSchema.index({ createdBy: 1 });

// Indexes for TestAttempt model
testAttemptSchema.index({ test: 1, student: 1 });
testAttemptSchema.index({ student: 1, createdAt: -1 });
testAttemptSchema.index({ test: 1, 'score.percentage': -1 });

// Virtual for test status
testSchema.virtual('status').get(function() {
  const now = new Date();
  if (!this.isPublished) return 'draft';
  if (this.schedule.startDate > now) return 'upcoming';
  if (this.schedule.endDate < now) return 'completed';
  return 'active';
});

// Method to calculate analytics
testSchema.methods.updateAnalytics = function() {
  // This would be implemented to calculate analytics from test attempts
  return this.save();
};

// Method to shuffle questions
testSchema.methods.getShuffledQuestions = function() {
  if (!this.settings.shuffleQuestions) return this.questions;
  return [...this.questions].sort(() => Math.random() - 0.5);
};

// Method to check if test is available for student
testSchema.methods.isAvailableFor = function(studentId) {
  const now = new Date();
  return this.isActive && 
         this.isPublished && 
         this.schedule.startDate <= now && 
         this.schedule.endDate >= now;
};

// Static method to get active tests
testSchema.statics.getActiveTests = function(filters = {}) {
  const query = { 
    isActive: true, 
    isPublished: true,
    'schedule.startDate': { $lte: new Date() },
    'schedule.endDate': { $gte: new Date() }
  };
  
  if (filters.subject) query.subject = filters.subject;
  if (filters.class) query.class = filters.class;
  if (filters.type) query.type = filters.type;
  if (filters.difficulty) query.difficulty = filters.difficulty;
  
  return this.find(query).sort({ createdAt: -1 });
};

// Method to calculate result for test attempt
testAttemptSchema.methods.calculateResult = function() {
  let totalObtained = 0;
  
  this.answers.forEach(answer => {
    totalObtained += answer.marksObtained;
  });
  
  this.score.obtained = totalObtained;
  this.score.percentage = (totalObtained / this.score.total) * 100;
  
  // Determine pass/fail based on test's passing marks
  // This would need to be populated from the test document
  this.result = this.score.obtained >= this.passingMarks ? 'Pass' : 'Fail';
  
  return this.save();
};

// Method to submit test attempt
testAttemptSchema.methods.submit = function() {
  this.endTime = new Date();
  this.timeSpent = Math.round((this.endTime - this.startTime) / (1000 * 60));
  this.status = 'submitted';
  
  return this.calculateResult();
};

const Test = mongoose.model('Test', testSchema);
const TestAttempt = mongoose.model('TestAttempt', testAttemptSchema);

module.exports = { Test, TestAttempt };
