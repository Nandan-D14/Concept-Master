const express = require('express');
const { auth, trackActivity } = require('../middleware/auth');
const { Test, TestAttempt } = require('../models/Test');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/tests
// @desc    Get available tests
// @access  Private
router.get('/', [auth, trackActivity], async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const { type, subject, page = 1, limit = 20 } = req.query;

    const filters = {
      class: user.class,
      board: user.board
    };

    if (type) filters.type = type;
    if (subject) filters.subject = subject;

    const tests = await Test.getActiveTests(filters)
      .limit(parseInt(limit))
      .skip((page - 1) * limit);

    const total = await Test.countDocuments({
      ...filters,
      isActive: true,
      isPublished: true,
      'schedule.startDate': { $lte: new Date() },
      'schedule.endDate': { $gte: new Date() }
    });

    res.json({
      success: true,
      message: 'Tests retrieved successfully',
      data: {
        tests,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get Tests error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tests'
    });
  }
});

// @route   POST /api/tests/:id/start
// @desc    Start a test
// @access  Private
router.post('/:id/start', [auth, trackActivity], async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);
    const user = await User.findById(req.user.userId);

    if (!test || !user) {
      return res.status(404).json({
        success: false,
        message: 'Test or user not found'
      });
    }

    if (!test.isAvailableFor(user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Test is not available'
      });
    }

    // Check if user has already attempted this test
    const existingAttempt = await TestAttempt.findOne({
      test: test._id,
      student: user._id,
      status: 'started'
    });

    if (existingAttempt) {
      return res.json({
        success: true,
        message: 'Test already started',
        data: {
          attemptId: existingAttempt._id,
          startTime: existingAttempt.startTime,
          timeRemaining: test.duration * 60 - Math.floor((Date.now() - existingAttempt.startTime) / 1000)
        }
      });
    }

    // Create new attempt
    const attempt = new TestAttempt({
      test: test._id,
      student: user._id,
      score: { total: test.totalMarks },
      answers: test.questions.map(q => ({
        questionId: q._id,
        isSkipped: true
      }))
    });

    await attempt.save();

    res.json({
      success: true,
      message: 'Test started successfully',
      data: {
        attemptId: attempt._id,
        test: {
          title: test.title,
          duration: test.duration,
          totalMarks: test.totalMarks,
          questions: test.getShuffledQuestions()
        },
        startTime: attempt.startTime
      }
    });

  } catch (error) {
    console.error('Start Test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start test'
    });
  }
});

// @route   GET /api/tests/attempts
// @desc    Get user's test attempts
// @access  Private
router.get('/attempts', [auth, trackActivity], async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const attempts = await TestAttempt.find({ student: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((page - 1) * limit)
      .populate('test', 'title subject type totalMarks')
      .select('-answers');

    const total = await TestAttempt.countDocuments({ student: req.user.userId });

    res.json({
      success: true,
      message: 'Test attempts retrieved successfully',
      data: {
        attempts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get Test Attempts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve test attempts'
    });
  }
});

module.exports = router;
