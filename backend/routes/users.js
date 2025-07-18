const express = require('express');
const { auth, trackActivity } = require('../middleware/auth');
const User = require('../models/User');
const Doubt = require('../models/Doubt');
const { Test, TestAttempt } = require('../models/Test');

const router = express.Router();

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data
// @access  Private
router.get('/dashboard', [auth, trackActivity], async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get recent doubts
    const recentDoubts = await Doubt.find({ student: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt');

    // Get recent test attempts
    const recentTests = await TestAttempt.find({ student: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('test', 'title subject')
      .select('score result createdAt');

    // Get upcoming tests
    const upcomingTests = await Test.find({
      class: user.class,
      board: user.board,
      isActive: true,
      isPublished: true,
      'schedule.startDate': { $gte: new Date() }
    })
      .sort({ 'schedule.startDate': 1 })
      .limit(5)
      .select('title subject schedule');

    // Calculate streak
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const wasActiveYesterday = user.stats.lastActiveDate >= yesterday;
    const isActiveToday = user.stats.lastActiveDate >= today;

    if (isActiveToday && wasActiveYesterday) {
      user.stats.studyStreak += 1;
    } else if (!isActiveToday) {
      user.stats.studyStreak = 0;
    }

    await user.save();

    const dashboardData = {
      user: {
        name: user.name,
        class: user.class,
        board: user.board,
        subscription: user.subscription,
        remainingDays: user.getRemainingDays()
      },
      progress: {
        totalXP: user.progress.totalXP,
        currentLevel: user.progress.currentLevel,
        completedChapters: user.progress.completedChapters.length,
        totalBookmarks: user.progress.bookmarks.length,
        badges: user.progress.badges.slice(-3) // Latest 3 badges
      },
      stats: {
        totalDoubtsAsked: user.stats.totalDoubtsAsked,
        totalTestsAttempted: user.stats.totalTestsAttempted,
        averageScore: user.stats.averageScore,
        studyStreak: user.stats.studyStreak
      },
      recent: {
        doubts: recentDoubts,
        tests: recentTests,
        upcomingTests
      }
    };

    res.json({
      success: true,
      message: 'Dashboard data retrieved successfully',
      data: dashboardData
    });

  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard data'
    });
  }
});

// @route   GET /api/users/leaderboard
// @desc    Get leaderboard data
// @access  Private
router.get('/leaderboard', [auth, trackActivity], async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get top users by XP in same class
    const topUsers = await User.find({
      class: user.class,
      board: user.board,
      role: 'student'
    })
      .sort({ 'progress.totalXP': -1 })
      .limit(10)
      .select('name progress.totalXP progress.currentLevel');

    // Get user's rank
    const userRank = await User.countDocuments({
      class: user.class,
      board: user.board,
      role: 'student',
      'progress.totalXP': { $gt: user.progress.totalXP }
    }) + 1;

    res.json({
      success: true,
      message: 'Leaderboard retrieved successfully',
      data: {
        topUsers,
        userRank,
        userXP: user.progress.totalXP,
        userLevel: user.progress.currentLevel
      }
    });

  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve leaderboard'
    });
  }
});

module.exports = router;
