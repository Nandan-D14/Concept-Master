const express = require('express');
const { body, validationResult } = require('express-validator');
const { auth, requireSubscription, trackActivity } = require('../middleware/auth');
const aiService = require('../services/aiService');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/ai/simplify
// @desc    Simplify text using AI
// @access  Private
router.post('/simplify', [
  auth,
  trackActivity,
  body('text')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Text must be between 10 and 2000 characters'),
  body('subject')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Subject must be between 2 and 50 characters')
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

    const { text, subject } = req.body;
    
    // Get user details
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Simplify text using AI
    const simplifiedResult = await aiService.simplifyText(
      text, 
      user.class, 
      subject || 'General'
    );

    // Award XP for using AI simplifier
    await user.addXP(5, 'AI Simplifier Usage');

    res.json({
      success: true,
      message: 'Text simplified successfully',
      data: simplifiedResult
    });

  } catch (error) {
    console.error('AI Simplify error:', error);
    
    // Fallback response
    res.json({
      success: true,
      message: 'Text simplified (fallback)',
      data: {
        simplified: req.body.text,
        example: "AI service is temporarily unavailable. Please try again later.",
        keyPoints: ["Please refer to your textbook for detailed explanations"],
        definitions: {}
      }
    });
  }
});

// @route   POST /api/ai/explain
// @desc    Explain concept using AI
// @access  Private
router.post('/explain', [
  auth,
  trackActivity,
  body('concept')
    .isLength({ min: 2, max: 200 })
    .withMessage('Concept must be between 2 and 200 characters'),
  body('subject')
    .isLength({ min: 2, max: 50 })
    .withMessage('Subject is required')
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

    const { concept, subject } = req.body;
    
    // Get user details
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Explain concept using AI
    const explanation = await aiService.explainConcept(
      concept, 
      user.class, 
      subject
    );

    // Award XP for using AI explainer
    await user.addXP(10, 'AI Concept Explainer Usage');

    res.json({
      success: true,
      message: 'Concept explained successfully',
      data: {
        concept,
        explanation,
        subject,
        studentClass: user.class
      }
    });

  } catch (error) {
    console.error('AI Explain error:', error);
    
    // Fallback response
    res.json({
      success: true,
      message: 'Concept explanation (fallback)',
      data: {
        concept: req.body.concept,
        explanation: "AI service is temporarily unavailable. Please refer to your textbook or ask a human tutor for detailed explanation.",
        subject: req.body.subject,
        studentClass: req.user.class
      }
    });
  }
});

// @route   POST /api/ai/generate-summary
// @desc    Generate summary using AI
// @access  Private
router.post('/generate-summary', [
  auth,
  trackActivity,
  body('content')
    .isLength({ min: 50, max: 5000 })
    .withMessage('Content must be between 50 and 5000 characters'),
  body('topic')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Topic must be between 2 and 100 characters')
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

    const { content, topic } = req.body;
    
    // Get user details
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate summary using AI
    const summary = await aiService.generateSummary(content, user.class);

    // Award XP for using AI summary generator
    await user.addXP(8, 'AI Summary Generator Usage');

    res.json({
      success: true,
      message: 'Summary generated successfully',
      data: {
        originalContent: content,
        summary,
        topic,
        studentClass: user.class
      }
    });

  } catch (error) {
    console.error('AI Generate Summary error:', error);
    
    // Fallback response
    res.json({
      success: true,
      message: 'Summary generation (fallback)',
      data: {
        originalContent: req.body.content,
        summary: "AI service is temporarily unavailable. Please create summary manually by identifying key points from the content.",
        topic: req.body.topic,
        studentClass: req.user.class
      }
    });
  }
});

// @route   POST /api/ai/generate-questions
// @desc    Generate practice questions using AI
// @access  Private (Premium feature)
router.post('/generate-questions', [
  auth,
  requireSubscription(['premium']),
  trackActivity,
  body('subject')
    .isLength({ min: 2, max: 50 })
    .withMessage('Subject is required'),
  body('chapter')
    .isLength({ min: 2, max: 100 })
    .withMessage('Chapter is required'),
  body('difficulty')
    .optional()
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Difficulty must be Easy, Medium, or Hard'),
  body('count')
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage('Count must be between 1 and 20')
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

    const { subject, chapter, difficulty = 'Medium', count = 10 } = req.body;
    
    // Get user details
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate questions using AI
    const questions = await aiService.generateTestQuestions(
      subject, 
      chapter, 
      difficulty, 
      count
    );

    // Award XP for using AI question generator
    await user.addXP(15, 'AI Question Generator Usage');

    res.json({
      success: true,
      message: 'Questions generated successfully',
      data: {
        subject,
        chapter,
        difficulty,
        count,
        questions,
        studentClass: user.class
      }
    });

  } catch (error) {
    console.error('AI Generate Questions error:', error);
    
    // Fallback response
    res.json({
      success: true,
      message: 'Question generation (fallback)',
      data: {
        subject: req.body.subject,
        chapter: req.body.chapter,
        difficulty: req.body.difficulty || 'Medium',
        count: req.body.count || 10,
        questions: [{
          question: "AI service is temporarily unavailable. Please refer to your textbook for practice questions.",
          options: ["A. Try again later", "B. Use textbook", "C. Contact support", "D. All of the above"],
          correctAnswer: "D",
          explanation: "When AI service is unavailable, these are the recommended alternatives."
        }],
        studentClass: req.user.class
      }
    });
  }
});

// @route   POST /api/ai/study-plan
// @desc    Generate personalized study plan using AI
// @access  Private (Premium feature)
router.post('/study-plan', [
  auth,
  requireSubscription(['premium']),
  trackActivity,
  body('subject')
    .isLength({ min: 2, max: 50 })
    .withMessage('Subject is required'),
  body('timeFrame')
    .optional()
    .isIn(['1 week', '2 weeks', '1 month', '3 months'])
    .withMessage('Time frame must be 1 week, 2 weeks, 1 month, or 3 months')
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

    const { subject, timeFrame = '1 month' } = req.body;
    
    // Get user details
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate study plan using AI
    const studyPlan = await aiService.generateStudyPlan(user, subject, timeFrame);

    // Award XP for using AI study planner
    await user.addXP(20, 'AI Study Planner Usage');

    res.json({
      success: true,
      message: 'Study plan generated successfully',
      data: {
        subject,
        timeFrame,
        studyPlan,
        studentClass: user.class
      }
    });

  } catch (error) {
    console.error('AI Study Plan error:', error);
    
    // Fallback response
    res.json({
      success: true,
      message: 'Study plan generation (fallback)',
      data: {
        subject: req.body.subject,
        timeFrame: req.body.timeFrame || '1 month',
        studyPlan: {
          weeklyPlan: ["AI service is temporarily unavailable"],
          dailySchedule: ["Please create a manual study schedule"],
          priorities: ["Focus on weak areas", "Practice regularly", "Revise frequently"],
          practiceSchedule: ["Solve practice questions daily"],
          revisionStrategy: ["Review topics weekly", "Take mock tests"]
        },
        studentClass: req.user.class
      }
    });
  }
});

// @route   GET /api/ai/usage-stats
// @desc    Get AI usage statistics for user
// @access  Private
router.get('/usage-stats', [auth, trackActivity], async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate AI usage stats (this would be stored in a separate collection in production)
    const stats = {
      totalAIInteractions: user.progress.totalXP / 10, // Approximate based on XP
      simplifierUsage: Math.floor(user.progress.totalXP / 50),
      explainerUsage: Math.floor(user.progress.totalXP / 100),
      questionGeneratorUsage: Math.floor(user.progress.totalXP / 150),
      studyPlannerUsage: Math.floor(user.progress.totalXP / 200),
      subscriptionType: user.subscription.type,
      remainingDays: user.getRemainingDays()
    };

    res.json({
      success: true,
      message: 'AI usage statistics retrieved successfully',
      data: stats
    });

  } catch (error) {
    console.error('AI Usage Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve AI usage statistics'
    });
  }
});

// @route   POST /api/ai/feedback
// @desc    Submit feedback for AI responses
// @access  Private
router.post('/feedback', [
  auth,
  trackActivity,
  body('type')
    .isIn(['simplify', 'explain', 'summary', 'questions', 'study-plan'])
    .withMessage('Type must be one of: simplify, explain, summary, questions, study-plan'),
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

    const { type, rating, comment } = req.body;
    
    // In production, store feedback in a separate collection
    console.log('AI Feedback received:', {
      userId: req.user.userId,
      type,
      rating,
      comment,
      timestamp: new Date()
    });

    // Award XP for providing feedback
    const user = await User.findById(req.user.userId);
    if (user) {
      await user.addXP(2, 'AI Feedback Provided');
    }

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('AI Feedback error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback'
    });
  }
});

// @route   POST /api/ai/chat
// @desc    Chat with AI agent
// @access  Private
router.post('/chat', [
  auth,
  trackActivity,
  body('message')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('history')
    .isArray()
    .withMessage('History must be an array'),
  body('systemInstruction')
    .optional()
    .isString()
    .withMessage('System instruction must be a string')
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

    const { message, history, systemInstruction } = req.body;

    // Get user details (optional, but good for context if needed by AI)
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Call the enhanced generateContent from aiService
    const aiResponse = await aiService.generateContent(
      message,
      history,
      systemInstruction
    );

    // Award XP for AI chat usage
    await user.addXP(3, 'AI Chat Usage');

    res.json({
      success: true,
      message: 'AI response generated successfully',
      data: {
        response: aiResponse
      }
    });

  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI response',
      data: {
        response: "I'm sorry, I'm having trouble responding right now. Please try again later."
      }
    });
  }
});

module.exports = router;
