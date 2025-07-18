const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
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
  chapter: {
    type: String,
    required: true,
    trim: true
  },
  topic: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['conceptual', 'numerical', 'theory', 'practical', 'other']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  attachments: [{
    type: {
      type: String,
      enum: ['image', 'pdf', 'audio', 'video'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    filename: {
      type: String,
      required: true
    },
    size: {
      type: Number // in bytes
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'answered', 'resolved', 'closed'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User' // teacher or admin
  },
  answers: [{
    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    answerType: {
      type: String,
      enum: ['ai', 'teacher', 'admin'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    attachments: [{
      type: {
        type: String,
        enum: ['image', 'pdf', 'audio', 'video']
      },
      url: String,
      filename: String
    }],
    helpful: {
      type: Number,
      default: 0
    },
    notHelpful: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    isAccepted: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  aiAnalysis: {
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    suggestedTopics: [{
      type: String
    }],
    relatedConcepts: [{
      type: String
    }],
    estimatedDifficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard']
    },
    requiresHumanReview: {
      type: Boolean,
      default: false
    }
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
    },
    givenAt: {
      type: Date
    }
  },
  views: {
    type: Number,
    default: 0
  },
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  resolvedAt: {
    type: Date
  },
  timeToResolve: {
    type: Number // in minutes
  },
  followUp: [{
    question: String,
    answer: String,
    askedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
doubtSchema.index({ student: 1, createdAt: -1 });
doubtSchema.index({ subject: 1, class: 1 });
doubtSchema.index({ status: 1, priority: 1 });
doubtSchema.index({ assignedTo: 1, status: 1 });
doubtSchema.index({ tags: 1 });

// Virtual for response time
doubtSchema.virtual('responseTime').get(function() {
  if (this.answers.length > 0) {
    const firstAnswer = this.answers[0];
    return Math.round((firstAnswer.createdAt - this.createdAt) / (1000 * 60)); // in minutes
  }
  return null;
});

// Method to add answer
doubtSchema.methods.addAnswer = function(answer) {
  this.answers.push(answer);
  if (this.status === 'pending') {
    this.status = 'answered';
  }
  return this.save();
};

// Method to mark as resolved
doubtSchema.methods.markResolved = function() {
  this.status = 'resolved';
  this.resolvedAt = new Date();
  this.timeToResolve = Math.round((this.resolvedAt - this.createdAt) / (1000 * 60));
  return this.save();
};

// Method to assign to teacher
doubtSchema.methods.assignTo = function(teacherId) {
  this.assignedTo = teacherId;
  this.status = 'assigned';
  return this.save();
};

// Method to increment views
doubtSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Method to add upvote
doubtSchema.methods.addUpvote = function() {
  this.upvotes += 1;
  return this.save();
};

// Method to add downvote
doubtSchema.methods.addDownvote = function() {
  this.downvotes += 1;
  return this.save();
};

// Static method to get pending doubts
doubtSchema.statics.getPending = function(limit = 50) {
  return this.find({ status: 'pending' })
    .populate('student', 'name class')
    .sort({ priority: -1, createdAt: 1 })
    .limit(limit);
};

// Static method to get assigned doubts for a teacher
doubtSchema.statics.getAssignedTo = function(teacherId) {
  return this.find({ assignedTo: teacherId, status: 'assigned' })
    .populate('student', 'name class')
    .sort({ priority: -1, createdAt: 1 });
};

// Static method to get popular doubts
doubtSchema.statics.getPopular = function(limit = 10) {
  return this.find({ isPublic: true, status: 'resolved' })
    .sort({ views: -1, upvotes: -1 })
    .limit(limit);
};

// Static method to get doubts by subject and class
doubtSchema.statics.getBySubjectClass = function(subject, studentClass) {
  return this.find({ 
    subject: subject, 
    class: studentClass,
    isPublic: true,
    status: 'resolved'
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Doubt', doubtSchema);
