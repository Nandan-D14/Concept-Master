const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth'); // Keep auth middleware

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register user with email and password
// @access  Public
router.post('/register', [
  body('name')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('class')
    .isInt({ min: 1, max: 12 })
    .withMessage('Class must be between 1 and 12'),
  body('board')
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

    const { name, email, password, class: studentClass, board, state } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    user = new User({
      name,
      email,
      password,
      class: studentClass,
      board,
      state,
      isVerified: true // Assuming email verification is handled later or not required for initial registration
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email, // Use email in payload
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: user.class,
        board: user.board,
        subscription: user.subscription,
        role: user.role,
        progress: user.progress
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user with email and password
// @access  Public
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .exists()
    .withMessage('Password is required')
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

    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email, // Use email in payload
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: user.class,
        board: user.board,
        subscription: user.subscription,
        role: user.role,
        progress: user.progress
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   POST /api/auth/google
// @desc    Authenticate user with Google (Register/Login)
// @access  Public
router.post('/google', [
  body('idToken')
    .exists()
    .withMessage('Google ID token is required')
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

    const { idToken } = req.body;

    // Verify Google ID token (using firebase-admin or google-auth-library)
    // For simplicity, we'll assume a valid token and extract user info.
    // In a real app, you'd use: admin.auth().verifyIdToken(idToken)
    // For now, we'll mock the token verification and user data extraction.
    // This part needs actual implementation with a Google Auth Library.
    const decodedToken = {
      email: 'google.user@example.com', // Replace with actual decoded email
      name: 'Google User', // Replace with actual decoded name
      sub: 'google_user_id_123' // Google user ID (unique identifier)
    };

    // Check if user exists by googleId
    let user = await User.findOne({ googleId: decodedToken.sub });
    let isNewUser = false;

    if (!user) {
      // Check if user exists by email (if they previously registered with email/password)
      user = await User.findOne({ email: decodedToken.email });
      if (user) {
        // Link Google account to existing email account
        user.googleId = decodedToken.sub;
        await user.save();
      } else {
        // Register new user with Google info
        isNewUser = true;
        user = new User({
          name: decodedToken.name,
          email: decodedToken.email,
          googleId: decodedToken.sub,
          isVerified: true,
          // Default values for class and board for new Google users
          // In a real app, you might prompt them for this info on first login
          class: 10, // Default class
          board: 'CBSE' // Default board
        });
        await user.save();
      }
    }

    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email, // Use email in payload
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: isNewUser ? 'Google registration successful' : 'Google login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        class: user.class,
        board: user.board,
        subscription: user.subscription,
        role: user.role,
        progress: user.progress
      }
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google'
    });
  }
});


// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-__v -password'); // Exclude password
    
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
        name: user.name,
        email: user.email,
        class: user.class,
        board: user.board,
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
        email: user.email, // Use email in payload
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
    .withMessage('Please enter a valid email')
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error('This email is already in use');
      }
      return true;
    }),
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
        name: user.name,
        email: user.email,
        class: user.class,
        board: user.board,
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