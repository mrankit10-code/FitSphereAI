const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Progress = require('../models/Progress');

// @route   POST /api/progress
// @desc    Add progress entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      weight,
      bodyFat,
      muscleMass,
      measurements,
      notes,
      beforeImage,
      afterImage
    } = req.body;

    const progress = await Progress.create({
      userId: req.user.id,
      weight,
      bodyFat,
      muscleMass,
      measurements,
      notes,
      beforeImage,
      afterImage
    });

    res.json({ progress });
  } catch (error) {
    console.error('Add progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress
// @desc    Get user progress history
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id, limit: 100 });
    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/progress/stats
// @desc    Get progress statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id });
    // Sort by date ascending (oldest first)
    progress.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (progress.length === 0) {
      return res.json({
        weightChange: 0,
        totalEntries: 0,
        firstEntry: null,
        latestEntry: null
      });
    }

    const firstEntry = progress[0];
    const latestEntry = progress[progress.length - 1];
    const weightChange = firstEntry.weight && latestEntry.weight 
      ? latestEntry.weight - firstEntry.weight 
      : 0;

    res.json({
      weightChange: Math.round(weightChange * 10) / 10,
      totalEntries: progress.length,
      firstEntry: {
        date: firstEntry.date,
        weight: firstEntry.weight
      },
      latestEntry: {
        date: latestEntry.date,
        weight: latestEntry.weight
      }
    });
  } catch (error) {
    console.error('Get progress stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

