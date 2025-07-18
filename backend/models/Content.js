const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
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
  chapter: {
    type: String,
    required: true,
    trim: true
  },
  chapterNumber: {
    type: Number,
    required: true
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['notes', 'video', 'practice', 'formula', 'diagram', 'summary']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  content: {
    text: {
      type: String
    },
    videoUrl: {
      type: String
    },
    pdfUrl: {
      type: String
    },
    imageUrls: [{
      type: String
    }],
    audioUrl: {
      type: String
    }
  },
  keyPoints: [{
    type: String,
    trim: true
  }],
  formulas: [{
    name: String,
    formula: String,
    description: String
  }],
  practiceQuestions: [{
    question: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['MCQ', 'Short', 'Long', 'Numerical'],
      required: true
    },
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    correctAnswer: String,
    explanation: String,
    marks: {
      type: Number,
      default: 1
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  ncertAligned: {
    type: Boolean,
    default: true
  },
  prerequisites: [{
    subject: String,
    chapter: String,
    topic: String
  }],
  learningOutcomes: [{
    type: String,
    trim: true
  }],
  estimatedTime: {
    type: Number, // in minutes
    default: 30
  },
  aiSummary: {
    type: String,
    trim: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  bookmarks: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
contentSchema.index({ subject: 1, class: 1, board: 1 });
contentSchema.index({ chapter: 1, chapterNumber: 1 });
contentSchema.index({ type: 1, difficulty: 1 });
contentSchema.index({ tags: 1 });
contentSchema.index({ createdAt: -1 });

// Virtual for content URL
contentSchema.virtual('contentUrl').get(function() {
  if (this.content.videoUrl) return this.content.videoUrl;
  if (this.content.pdfUrl) return this.content.pdfUrl;
  if (this.content.imageUrls && this.content.imageUrls.length > 0) return this.content.imageUrls[0];
  return null;
});

// Method to increment views
contentSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add bookmark
contentSchema.methods.addBookmark = function() {
  this.bookmarks += 1;
  return this.save();
};

// Method to remove bookmark
contentSchema.methods.removeBookmark = function() {
  this.bookmarks = Math.max(0, this.bookmarks - 1);
  return this.save();
};

// Static method to get content by filters
contentSchema.statics.getByFilters = function(filters) {
  const query = { isActive: true };
  
  if (filters.subject) query.subject = filters.subject;
  if (filters.class) query.class = filters.class;
  if (filters.board) query.board = filters.board;
  if (filters.chapter) query.chapter = filters.chapter;
  if (filters.type) query.type = filters.type;
  if (filters.difficulty) query.difficulty = filters.difficulty;
  if (filters.tags) query.tags = { $in: filters.tags };
  
  return this.find(query).sort({ createdAt: -1 });
};

// Static method to get popular content
contentSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isActive: true })
    .sort({ views: -1, likes: -1 })
    .limit(limit);
};

// Static method to get featured content
contentSchema.statics.getFeatured = function(limit = 5) {
  return this.find({ isActive: true, featured: true })
    .sort({ createdAt: -1 })
    .limit(limit);
};

module.exports = mongoose.model('Content', contentSchema);
