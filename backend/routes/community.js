const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const CommunityPost = require('../models/CommunityPost');
const Comment = require('../models/Comment');
const User = require('../models/User');

// @route   POST /api/community/posts
// @desc    Create a community post
// @access  Private
router.post('/posts', auth, async (req, res) => {
  try {
    const { text, images } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Post text is required' });
    }

    const post = await CommunityPost.create({
      userId: req.user.id,
      text: text.trim(),
      images: images || []
    });
    
    res.json({ post });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/community/posts
// @desc    Get all community posts
// @access  Private
router.get('/posts', auth, async (req, res) => {
  try {
    const posts = await CommunityPost.find({ limit: 50 });
    res.json({ posts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/community/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.put('/posts/:id/like', auth, async (req, res) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    const likes = post.likes || [];
    // Handle both array of IDs and array of objects
    const isLiked = likes.some(like => {
      const likeId = typeof like === 'object' ? (like._id || like.id || like) : like;
      return likeId == userId;
    });

    let updatedLikes;
    if (isLiked) {
      updatedLikes = likes.filter(like => {
        const likeId = typeof like === 'object' ? (like._id || like.id || like) : like;
        return likeId != userId;
      });
    } else {
      updatedLikes = [...likes, userId];
    }

    const updatedPost = await CommunityPost.updateById(post._id, { likes: updatedLikes });
    res.json({ post: updatedPost, liked: !isLiked });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/community/posts/:id/comments
// @desc    Add comment to post
// @access  Private
router.post('/posts/:id/comments', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    await Comment.create({
      postId: req.params.id,
      userId: req.user.id,
      text: text.trim()
    });

    const updatedPost = await CommunityPost.findById(req.params.id);
    res.json({ post: updatedPost });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/community/leaderboard
// @desc    Get leaderboard
// @access  Private
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const users = await User.find({ limit: 100 });
    // Sort by XP descending
    users.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    
    const leaderboard = users.map(user => ({
      _id: user.id,
      name: user.name,
      xp: user.xp || 0,
      streak: user.streak || 0,
      badges: user.badges || []
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

