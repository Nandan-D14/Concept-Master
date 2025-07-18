const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../utils/otpService');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Store OTPs in memory (in production, use Redis)
const otpStore = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to phone number
// @access  Public
router.post('/send-otp', [
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit phone number')
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

    const { phone } = req.body;
    const otp = generateOTP();

    // Store OTP with expiration (5 minutes)
    otpStore.set(phone, {
      otp,
      expires: Date.now() + 5 * 60 * 1000,
      attempts: 0
    });

    // In production, integrate with SMS service (like Twilio, AWS SNS, etc.)
    // For now, we'll just log the OTP
    console.log(`OTP for ${phone}: ${otp}`);

    // For demo purposes, we'll send the OTP in response
    // In production, remove this and only send success message
    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });

  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login/register user
// @access  Public
router.post('/verify-otp', [
  body('phone')
    .matches(/^[6-9]\d{9}$/)
    .withMessage('Please enter a valid 10-digit phone number'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits'),
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('class')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Class must be between 1 and 12'),
  body('board')
    .optional()
    .isIn(['CBSE', 'ICSE', 'State'])
    .withMessage('Board must be CBSE, ICSE, or State')
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

    const { phone, otp, name, class: studentClass, board, email } = req.body;

    // Check if OTP exists and is valid
    const otpData = otpStore.get(phone);
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    // Check if OTP is expired
    if (Date.now() > otpData.expires) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      });
    }

    // Check attempt limit
    if (otpData.attempts >= 3) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'Too many failed attempts'
      });
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      otpData.attempts++;
      otpStore.set(phone, otpData);
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // OTP is valid, remove from store
    otpStore.delete(phone);

    // Check if user exists
    let user = await User.findOne({ phone });

    if (!user) {
      // Register new user
      if (!name || !studentClass || !board) {
        return res.status(400).json({
          success: false,
          message: 'Name, class, and board are required for registration'
        });
      }

      user = new User({
        phone,
        name,
        class: studentClass,
        board,
        email,
        isVerified: true
      });

      await user.save();
    } else {
      // Update existing user's last login
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        phone: user.phone,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: user.isNew ? 'Registration successful' : 'Login successful',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        class: user.class,
        board: user.board,
        email: user.email,
        subscription: user.subscription,
        role: user.role,
        progress: user.progress
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        class: user.class,
        board: user.board,
        email: user.email,
        subscription: user.subscription,
        role: user.role,
        progress: user.progress,
        preferences: user.preferences,
        stats: user.stats,
        subscriptionStatus: user.subscriptionStatus,
        remainingDays: user.getRemainingDays()
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user information'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate token)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // In a real application, you might want to maintain a blacklist of tokens
    // or use Redis to store valid tokens
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to logout'
    });
  }
});

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate new token
    const token = jwt.sign(
      { 
        userId: user._id,
        phone: user.phone,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      token
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to refresh token'
    });
  }
});

// @route   POST /api/auth/update-profile
// @desc    Update user profile
// @access  Private
router.post('/update-profile', [
  auth,
  body('name')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('class')
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage('Class must be between 1 and 12'),
  body('board')
    .optional()
    .isIn(['CBSE', 'ICSE', 'State'])
    .withMessage('Board must be CBSE, ICSE, or State')
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

    const { name, email, class: studentClass, board, state, preferences } = req.body;

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (studentClass) user.class = studentClass;
    if (board) user.board = board;
    if (state) user.state = state;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        class: user.class,
        board: user.board,
        email: user.email,
        state: user.state,
        preferences: user.preferences
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

module.exports = router;
