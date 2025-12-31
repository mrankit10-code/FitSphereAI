const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const pool = require('../config/database'); // Import from correct location

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post('/signup', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = await User.create({ name, email, password });

    // Generate token
    const token = generateToken(user.id);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        xp: user.xp || 0,
        streak: user.streak || 0
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    // Provide more detailed error message
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return res.status(500).json({ message: 'Database connection error. Please check MySQL is running.' });
    }
    res.status(500).json({ 
      message: 'Server error during signup',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 LOGIN ATTEMPT - Email:', email); // DEBUG
    
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    console.log('📊 USER FOUND:', users.length > 0 ? 'YES' : 'NO'); // DEBUG
    
    if (users.length === 0) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('🔐 PASSWORD MATCH:', passwordMatch); // DEBUG
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    console.log('✅ TOKEN CREATED'); // DEBUG
    
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
    
  } catch (error) {
    console.error('🚨 LOGIN ERROR:', error); // SHOW FULL ERROR
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        xp: req.user.xp || 0,
        streak: req.user.streak || 0,
        badges: req.user.badges || []
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

