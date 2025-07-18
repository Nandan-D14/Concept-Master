const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, authorization denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    
    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found, authorization denied'
      });
    }

    // Check if user has active subscription for protected routes
    if (!user.hasActiveSubscription() && req.path.includes('/premium')) {
      return res.status(403).json({
        success: false,
        message: 'Premium subscription required'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token, authorization denied'
    });
  }
};

// Role-based authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

// Subscription-based authorization middleware
const requireSubscription = (subscriptionTypes = ['basic', 'premium']) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      if (!user.hasActiveSubscription()) {
        return res.status(403).json({
          success: false,
          message: 'Active subscription required'
        });
      }

      if (!subscriptionTypes.includes(user.subscription.type)) {
        return res.status(403).json({
          success: false,
          message: `${subscriptionTypes.join(' or ')} subscription required`
        });
      }

      next();
    } catch (error) {
      console.error('Subscription middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Authorization check failed'
      });
    }
  };
};

// Rate limiting middleware for doubts
const doubtRateLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check daily doubt limit based on subscription
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const Doubt = require('../models/Doubt');
    const todayDoubts = await Doubt.countDocuments({
      student: user._id,
      createdAt: { $gte: today }
    });

    let dailyLimit = 2; // Demo limit
    if (user.subscription.type === 'basic') dailyLimit = 5;
    if (user.subscription.type === 'premium') dailyLimit = 10;

    if (todayDoubts >= dailyLimit) {
      return res.status(429).json({
        success: false,
        message: `Daily doubt limit (${dailyLimit}) exceeded. Upgrade subscription for more doubts.`
      });
    }

    next();
  } catch (error) {
    console.error('Doubt rate limit error:', error);
    res.status(500).json({
      success: false,
      message: 'Rate limit check failed'
    });
  }
};

// Activity tracking middleware
const trackActivity = async (req, res, next) => {
  try {
    if (req.user && req.user.userId) {
      // Update last active date
      await User.findByIdAndUpdate(req.user.userId, {
        'stats.lastActiveDate': new Date()
      });
    }
    next();
  } catch (error) {
    console.error('Activity tracking error:', error);
    // Don't block the request if tracking fails
    next();
  }
};

module.exports = {
  auth,
  authorize,
  requireSubscription,
  doubtRateLimit,
  trackActivity
};
