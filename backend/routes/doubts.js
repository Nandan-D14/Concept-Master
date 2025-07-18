const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, doubtRateLimit, trackActivity } = require('../middleware/auth');
const Doubt = require('../models/Doubt');
const User = require('../models/User');
const aiService = require('../services/aiService');

const router = express.Router();

// @route   POST /api/doubts
// @desc    Create a new doubt
// @access  Private
router.post('/', [
  auth,
  doubtRateLimit,
  trackActivity,
  body('title')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('subject')
    .isLength({ min: 2, max: 50 })
    .withMessage('Subject is required'),
  body('chapter')
    .isLength({ min: 2, max: 100 })
    .withMessage('Chapter is required'),
  body('type')
    .isIn(['conceptual', 'numerical', 'theory', 'practical', 'other'])
    .withMessage('Invalid doubt type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, subject, chapter, topic, type, difficulty } = req.body;

    // Get user details
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create doubt
    const doubt = new Doubt({
      student: user._id,
      title,
      description,
      subject,
      class: user.class,
      chapter,
      topic,
      type,
      difficulty: difficulty || 'Medium'
    });

    await doubt.save();

    // Update user stats
    user.stats.totalDoubtsAsked += 1;
    await user.save();

    // Try to get AI answer immediately
    try {
      const aiResponse = await aiService.solveDoubt(doubt, user.class, subject);
      
      // Add AI answer
      await doubt.addAnswer({
        answerType: 'ai',
        content: aiResponse.content,
        helpful: 0,
        notHelpful: 0
      });

      // Update AI analysis
      doubt.aiAnalysis = {
        confidence: aiResponse.confidence,
        suggestedTopics: aiResponse.suggestedTopics,
        requiresHumanReview: aiResponse.requiresHumanReview
      };
      
      await doubt.save();

      // Award XP for asking doubt
      await user.addXP(10, 'Doubt Asked');

      res.json({
        success: true,
        message: 'Doubt created and AI answer provided',
        data: {
          doubt,
          aiAnswer: aiResponse.content,
          hasAIAnswer: true
        }
      });

    } catch (aiError) {
      console.error('AI Answer Error:', aiError);
      
      // Award XP for asking doubt (even without AI answer)
      await user.addXP(10, 'Doubt Asked');

      res.json({
        success: true,
        message: 'Doubt created successfully. AI answer will be provided shortly.',
        data: {
          doubt,
          hasAIAnswer: false
        }
      });
    }

  } catch (error) {
    console.error('Create Doubt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create doubt'
    });
  }
});

// @route   GET /api/doubts
// @desc    Get user's doubts
// @access  Private
router.get('/', [auth, trackActivity], async (req, res) => {
  try {
    const { status, subject, page = 1, limit = 20 } = req.query;

    const query = { student: req.user.userId };
    if (status) query.status = status;
    if (subject) query.subject = subject;

    const skip = (page - 1) * limit;
    const doubts = await Doubt.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('assignedTo', 'name')
      .select('-__v');

    const total = await Doubt.countDocuments(query);

    res.json({
      success: true,
      message: 'Doubts retrieved successfully',
      data: {
        doubts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get Doubts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doubts'
    });
  }
});

// @route   GET /api/doubts/:id
// @desc    Get single doubt with answers
// @access  Private
router.get('/:id', [auth, trackActivity], async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id)
      .populate('student', 'name class')
      .populate('assignedTo', 'name')
      .populate('answers.answeredBy', 'name')
      .select('-__v');

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }

    // Check if user owns this doubt or if it's public
    if (doubt.student._id.toString() !== req.user.userId && !doubt.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Increment views
    await doubt.incrementViews();

    res.json({
      success: true,
      message: 'Doubt retrieved successfully',
      data: doubt
    });

  } catch (error) {
    console.error('Get Doubt by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve doubt'
    });
  }
});

// @route   POST /api/doubts/:id/answer
// @desc    Add answer to doubt (manual/teacher)
// @access  Private
router.post('/:id/answer', [
  auth,
  trackActivity,
  body('content')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Answer content must be between 10 and 2000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content } = req.body;
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Add answer
    const answer = {
      answeredBy: user._id,
      answerType: user.role === 'student' ? 'student' : 'teacher',
      content,
      helpful: 0,
      notHelpful: 0
    };

    await doubt.addAnswer(answer);

    // Award XP for answering
    if (user.role === 'teacher') {
      await user.addXP(20, 'Doubt Answered');
    }

    res.json({
      success: true,
      message: 'Answer added successfully',
      data: doubt
    });

  } catch (error) {
    console.error('Add Answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add answer'
    });
  }
});

// @route   POST /api/doubts/:id/resolve
// @desc    Mark doubt as resolved
// @access  Private
router.post('/:id/resolve', [auth, trackActivity], async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }

    // Check if user owns this doubt
    if (doubt.student.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await doubt.markResolved();

    // Award XP for resolving doubt
    const user = await User.findById(req.user.userId);
    if (user) {
      await user.addXP(5, 'Doubt Resolved');
    }

    res.json({
      success: true,
      message: 'Doubt marked as resolved',
      data: doubt
    });

  } catch (error) {
    console.error('Resolve Doubt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve doubt'
    });
  }
});

// @route   POST /api/doubts/:id/feedback
// @desc    Provide feedback on doubt answer
// @access  Private
router.post('/:id/feedback', [
  auth,
  trackActivity,
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('comment')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { rating, comment } = req.body;
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }

    // Check if user owns this doubt
    if (doubt.student.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Add feedback
    doubt.feedback = {
      rating,
      comment,
      givenAt: new Date()
    };

    await doubt.save();

    res.json({
      success: true,
      message: 'Feedback submitted successfully',
      data: doubt.feedback
    });

  } catch (error) {
    console.error('Doubt Feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

// @route   GET /api/doubts/popular
// @desc    Get popular doubts
// @access  Private
router.get('/popular', [auth, trackActivity], async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const popularDoubts = await Doubt.getPopular(10);

    res.json({
      success: true,
      message: 'Popular doubts retrieved successfully',
      data: popularDoubts
    });

  } catch (error) {
    console.error('Get Popular Doubts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve popular doubts'
    });
  }
});

// @route   GET /api/doubts/subject/:subject
// @desc    Get doubts by subject
// @access  Private
router.get('/subject/:subject', [auth, trackActivity], async (req, res) => {
  try {
    const { subject } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const skip = (page - 1) * limit;
    const doubts = await Doubt.getBySubjectClass(subject, user.class);
    
    const paginatedDoubts = doubts.slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      message: 'Subject doubts retrieved successfully',
      data: {
        doubts: paginatedDoubts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(doubts.length / limit),
          totalItems: doubts.length,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get Subject Doubts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve subject doubts'
    });
  }
});

// @route   POST /api/doubts/:id/vote
// @desc    Vote on doubt (upvote/downvote)
// @access  Private
router.post('/:id/vote', [
  auth,
  trackActivity,
  body('type')
    .isIn(['upvote', 'downvote'])
    .withMessage('Vote type must be upvote or downvote')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { type } = req.body;
    const doubt = await Doubt.findById(req.params.id);

    if (!doubt) {
      return res.status(404).json({
        success: false,
        message: 'Doubt not found'
      });
    }

    if (type === 'upvote') {
      await doubt.addUpvote();
    } else {
      await doubt.addDownvote();
    }

    res.json({
      success: true,
      message: `${type} registered successfully`,
      data: {
        upvotes: doubt.upvotes,
        downvotes: doubt.downvotes
      }
    });

  } catch (error) {
    console.error('Vote Doubt error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register vote'
    });
  }
});

module.exports = router;
