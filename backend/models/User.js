const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: function() { return !this.googleId; }, // Required if not signing in with Google
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() { return !this.googleId; } // Required if not signing in with Google
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows null values to be unique
  },
  name: {
    type: String,
    required: true,
    trim: true
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
  state: {
    type: String,
    trim: true
  },
  subscription: {
    type: {
      type: String,
      enum: ['demo', 'basic', 'premium'],
      default: 'demo'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days free
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  progress: {
    totalXP: {
      type: Number,
      default: 0
    },
    currentLevel: {
      type: Number,
      default: 1
    },
    badges: [{
      name: String,
      earnedAt: Date,
      description: String
    }],
    completedChapters: [{
      subject: String,
      chapter: String,
      completedAt: Date,
      score: Number
    }],
    bookmarks: [{
      subject: String,
      chapter: String,
      topic: String,
      bookmarkedAt: Date
    }]
  },
  preferences: {
    language: {
      type: String,
      enum: ['English', 'Hindi', 'Kannada'],
      default: 'English'
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  },
  stats: {
    totalTestsAttempted: {
      type: Number,
      default: 0
    },
    totalDoubtsAsked: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    studyStreak: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    }
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ class: 1, board: 1 });
userSchema.index({ 'subscription.type': 1, 'subscription.isActive': 1 });

// Virtual for subscription status
userSchema.virtual('subscriptionStatus').get(function() {
  if (!this.subscription.isActive) return 'inactive';
  if (this.subscription.endDate < new Date()) return 'expired';
  return 'active';
});

// Method to add XP
userSchema.methods.addXP = function(points, reason) {
  this.progress.totalXP += points;
  this.progress.currentLevel = Math.floor(this.progress.totalXP / 100) + 1;
  
  // Check for level-up badges
  if (this.progress.currentLevel > 1 && this.progress.currentLevel % 5 === 0) {
    this.progress.badges.push({
      name: `Level ${this.progress.currentLevel} Achiever`,
      earnedAt: new Date(),
      description: `Reached level ${this.progress.currentLevel}!`
    });
  }
  
  return this.save();
};

// Method to check subscription validity
userSchema.methods.hasActiveSubscription = function() {
  return this.subscription.isActive && this.subscription.endDate > new Date();
};

// Method to get remaining subscription days
userSchema.methods.getRemainingDays = function() {
  if (!this.hasActiveSubscription()) return 0;
  const diffTime = this.subscription.endDate - new Date();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

module.exports = mongoose.model('User', userSchema);

