const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, trackActivity } = require('../middleware/auth');
const Content = require('../models/Content');
const User = require('../models/User');

const router = express.Router();

// @route   GET /api/content
// @desc    Get all content with filters
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

    const {
      subject,
      chapter,
      type,
      difficulty,
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Build query
    const query = {
      isActive: true,
      class: user.class,
      board: user.board
    };

    if (subject) query.subject = subject;
    if (chapter) query.chapter = chapter;
    if (type) query.type = type;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    const content = await Content.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('createdBy', 'name')
      .select('-__v');

    const total = await Content.countDocuments(query);

    res.json({
      success: true,
      message: 'Content retrieved successfully',
      data: {
        content,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get Content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve content'
    });
  }
});

// @route   GET /api/content/:id
// @desc    Get single content item
// @access  Private
router.get('/:id', [auth, trackActivity], async (req, res) => {
  try {
    const content = await Content.findById(req.params.id)
      .populate('createdBy', 'name')
      .select('-__v');

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Increment views
    await content.incrementViews();

    // Award XP for content consumption
    const user = await User.findById(req.user.userId);
    if (user) {
      await user.addXP(3, 'Content Viewed');
    }

    res.json({
      success: true,
      message: 'Content retrieved successfully',
      data: content
    });

  } catch (error) {
    console.error('Get Content by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve content'
    });
  }
});

// @route   GET /api/content/subjects/:class
// @desc    Get all subjects for a class
// @access  Private
router.get('/subjects/:class', [auth, trackActivity], async (req, res) => {
  try {
    const studentClass = parseInt(req.params.class);
    
    if (studentClass < 1 || studentClass > 12) {
      return res.status(400).json({
        success: false,
        message: 'Invalid class number'
      });
    }

    const subjects = await Content.distinct('subject', {
      class: studentClass,
      isActive: true
    });

    res.json({
      success: true,
      message: 'Subjects retrieved successfully',
      data: subjects
    });

  } catch (error) {
    console.error('Get Subjects error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve subjects'
    });
  }
});

// @route   GET /api/content/chapters/:subject
// @desc    Get all chapters for a subject
// @access  Private
router.get('/chapters/:subject', [auth, trackActivity], async (req, res) => {
  try {
    const { subject } = req.params;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const chapters = await Content.distinct('chapter', {
      subject,
      class: user.class,
      board: user.board,
      isActive: true
    });

    // Get chapter details with progress
    const chapterDetails = await Content.aggregate([
      {
        $match: {
          subject,
          class: user.class,
          board: user.board,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$chapter',
          chapterNumber: { $first: '$chapterNumber' },
          totalContent: { $sum: 1 },
          types: { $addToSet: '$type' },
          difficulties: { $addToSet: '$difficulty' }
        }
      },
      {
        $sort: { chapterNumber: 1 }
      }
    ]);

    res.json({
      success: true,
      message: 'Chapters retrieved successfully',
      data: chapterDetails
    });

  } catch (error) {
    console.error('Get Chapters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chapters'
    });
  }
});

// @route   GET /api/content/featured
// @desc    Get featured content
// @access  Private
router.get('/featured', [auth, trackActivity], async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const featuredContent = await Content.getFeatured(10);
    
    res.json({
      success: true,
      message: 'Featured content retrieved successfully',
      data: featuredContent
    });

  } catch (error) {
    console.error('Get Featured Content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve featured content'
    });
  }
});

// @route   GET /api/content/popular
// @desc    Get popular content
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

    const popularContent = await Content.getPopular(10);
    
    res.json({
      success: true,
      message: 'Popular content retrieved successfully',
      data: popularContent
    });

  } catch (error) {
    console.error('Get Popular Content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve popular content'
    });
  }
});

// @route   POST /api/content/bookmark/:id
// @desc    Bookmark/unbookmark content
// @access  Private
router.post('/bookmark/:id', [auth, trackActivity], async (req, res) => {
  try {
    const contentId = req.params.id;
    const user = await User.findById(req.user.userId);
    const content = await Content.findById(contentId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check if already bookmarked
    const existingBookmark = user.progress.bookmarks.find(
      bookmark => bookmark.subject === content.subject && 
                  bookmark.chapter === content.chapter && 
                  bookmark.topic === content.topic
    );

    if (existingBookmark) {
      // Remove bookmark
      user.progress.bookmarks = user.progress.bookmarks.filter(
        bookmark => !(bookmark.subject === content.subject && 
                     bookmark.chapter === content.chapter && 
                     bookmark.topic === content.topic)
      );
      await content.removeBookmark();
      await user.save();

      res.json({
        success: true,
        message: 'Bookmark removed successfully',
        data: { bookmarked: false }
      });
    } else {
      // Add bookmark
      user.progress.bookmarks.push({
        subject: content.subject,
        chapter: content.chapter,
        topic: content.topic,
        bookmarkedAt: new Date()
      });
      await content.addBookmark();
      await user.save();

      // Award XP for bookmarking
      await user.addXP(2, 'Content Bookmarked');

      res.json({
        success: true,
        message: 'Content bookmarked successfully',
        data: { bookmarked: true }
      });
    }

  } catch (error) {
    console.error('Bookmark Content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to bookmark content'
    });
  }
});

// @route   GET /api/content/bookmarks
// @desc    Get user's bookmarked content
// @access  Private
router.get('/bookmarks', [auth, trackActivity], async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const bookmarks = user.progress.bookmarks.sort((a, b) => 
      new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt)
    );

    res.json({
      success: true,
      message: 'Bookmarks retrieved successfully',
      data: bookmarks
    });

  } catch (error) {
    console.error('Get Bookmarks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookmarks'
    });
  }
});

// @route   POST /api/content/complete/:id
// @desc    Mark content as completed
// @access  Private
router.post('/complete/:id', [auth, trackActivity], async (req, res) => {
  try {
    const contentId = req.params.id;
    const { score } = req.body;
    
    const user = await User.findById(req.user.userId);
    const content = await Content.findById(contentId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Content not found'
      });
    }

    // Check if already completed
    const existingCompletion = user.progress.completedChapters.find(
      completion => completion.subject === content.subject && 
                    completion.chapter === content.chapter
    );

    if (!existingCompletion) {
      // Add completion
      user.progress.completedChapters.push({
        subject: content.subject,
        chapter: content.chapter,
        completedAt: new Date(),
        score: score || 0
      });

      // Award XP for completion
      await user.addXP(15, 'Chapter Completed');
    } else {
      // Update score if better
      if (score && score > existingCompletion.score) {
        existingCompletion.score = score;
        await user.addXP(5, 'Improved Score');
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Content marked as completed',
      data: { completed: true, score: score || 0 }
    });

  } catch (error) {
    console.error('Complete Content error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark content as completed'
    });
  }
});

// @route   GET /api/content/progress
// @desc    Get user's learning progress
// @access  Private
router.get('/progress', [auth, trackActivity], async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get total content available for user's class and board
    const totalContentBySubject = await Content.aggregate([
      {
        $match: {
          class: user.class,
          board: user.board,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$subject',
          totalChapters: { $addToSet: '$chapter' },
          totalContent: { $sum: 1 }
        }
      },
      {
        $project: {
          subject: '$_id',
          totalChapters: { $size: '$totalChapters' },
          totalContent: 1
        }
      }
    ]);

    // Calculate progress by subject
    const subjectProgress = totalContentBySubject.map(subjectData => {
      const completedChapters = user.progress.completedChapters.filter(
        completion => completion.subject === subjectData.subject
      ).length;

      return {
        subject: subjectData.subject,
        totalChapters: subjectData.totalChapters,
        completedChapters,
        progressPercentage: Math.round((completedChapters / subjectData.totalChapters) * 100)
      };
    });

    const overallProgress = {
      totalXP: user.progress.totalXP,
      currentLevel: user.progress.currentLevel,
      completedChapters: user.progress.completedChapters.length,
      totalBookmarks: user.progress.bookmarks.length,
      badges: user.progress.badges,
      subjectProgress
    };

    res.json({
      success: true,
      message: 'Progress retrieved successfully',
      data: overallProgress
    });

  } catch (error) {
    console.error('Get Progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve progress'
    });
  }
});

module.exports = router;
