const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @route   GET /api/challenges
// @desc    Get all active challenges
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const challenges = await Challenge.find({ isActive: true });
    res.json({ challenges });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/challenges/:id/join
// @desc    Join a challenge
// @access  Private
router.post('/:id/join', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (!challenge.isActive) {
      return res.status(400).json({ message: 'Challenge is not active' });
    }

    const isParticipating = challenge.participants.some(
      p => (p.userId._id || p.userId) == req.user.id
    );

    if (isParticipating) {
      return res.status(400).json({ message: 'Already participating in this challenge' });
    }

    challenge.participants.push({
      userId: req.user.id,
      progress: 0,
      completed: false,
      joinedAt: new Date()
    });

    const updatedChallenge = await Challenge.updateById(challenge._id, {
      participants: challenge.participants
    });

    res.json({ challenge: updatedChallenge });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/challenges/:id/progress
// @desc    Update challenge progress
// @access  Private
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { progress } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const participant = challenge.participants.find(
      p => (p.userId._id || p.userId) == req.user.id
    );

    if (!participant) {
      return res.status(400).json({ message: 'Not participating in this challenge' });
    }

    participant.progress = progress !== undefined ? progress : participant.progress + 1;
    
    if (participant.progress >= challenge.duration) {
      participant.completed = true;
      // Award XP
      const user = await User.findById(req.user.id);
      await User.updateById(user.id, {
        xp: (user.xp || 0) + challenge.xpReward
      });
    }

    const updatedChallenge = await Challenge.updateById(challenge._id, {
      participants: challenge.participants
    });
    
    const updatedParticipant = updatedChallenge.participants.find(
      p => (p.userId._id || p.userId) == req.user.id
    );

    res.json({ challenge: updatedChallenge, participant: updatedParticipant });
  } catch (error) {
    console.error('Update challenge progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

