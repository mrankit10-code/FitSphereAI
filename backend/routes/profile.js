const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');

// @route   GET /api/profile
// @desc    Get user profile
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let profile = await Profile.findOne({ userId: req.user.id });
    
    if (!profile) {
      return res.json({ profile: null, message: 'Profile not set up yet' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      age,
      height,
      weight,
      gender,
      fitnessGoal,
      dailyWorkoutTime,
      equipmentAvailability,
      foodPreference,
      fitnessLevel
    } = req.body;

    const profileData = {
      age,
      height,
      weight,
      gender,
      fitnessGoal,
      dailyWorkoutTime,
      equipmentAvailability,
      foodPreference,
      fitnessLevel
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user.id },
      profileData
    );

    res.json({ profile, message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Profile save error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

