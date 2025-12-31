import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Community.css';

const Community = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newPost, setNewPost] = useState({ text: '', images: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
    fetchLeaderboard();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/community/posts');
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/community/leaderboard');
      setLeaderboard(response.data.leaderboard || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPost.text.trim()) {
      setError('Post text is required');
      return;
    }

    try {
      await axios.post('/api/community/posts', newPost);
      setNewPost({ text: '', images: [] });
      fetchPosts();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create post');
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.put(`/api/community/posts/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    if (!commentText.trim()) return;

    try {
      await axios.post(`/api/community/posts/${postId}/comments`, { text: commentText });
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const isLiked = (post) => {
    return post.likes.some(like => like._id === user.id || like === user.id);
  };

  if (loading) {
    return (
      <div className="community-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="community">
      <div className="container">
        <h1>Community</h1>
        <p className="subtitle">Connect, share, and motivate each other</p>

        <div className="community-layout">
          {/* Main Feed */}
          <div className="community-feed">
            {/* Create Post */}
            <div className="create-post-card">
              <h2>Share Your Progress</h2>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleCreatePost}>
                <textarea
                  className="input"
                  placeholder="What's on your mind?"
                  value={newPost.text}
                  onChange={(e) => setNewPost({ ...newPost, text: e.target.value })}
                  rows="4"
                  required
                />
                <button type="submit" className="btn btn-primary">
                  Post
                </button>
              </form>
            </div>

            {/* Posts */}
            {posts.map(post => (
              <div key={post._id} className="post-card">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar">
                      {post.userId?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3>{post.userId?.name || 'Anonymous'}</h3>
                      <p className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="post-content">
                  <p>{post.text}</p>
                  {post.images && post.images.length > 0 && (
                    <div className="post-images">
                      {post.images.map((img, idx) => (
                        <img key={idx} src={img} alt={`Post ${idx + 1}`} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="post-actions">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`like-btn ${isLiked(post) ? 'liked' : ''}`}
                  >
                    ❤️ {post.likes?.length || 0}
                  </button>
                  <span className="comment-count">
                    💬 {post.comments?.length || 0} comments
                  </span>
                </div>

                {/* Comments */}
                <div className="post-comments">
                  {post.comments?.map((comment, idx) => (
                    <div key={idx} className="comment-item">
                      <strong>{comment.userId?.name || 'Anonymous'}:</strong>
                      <span>{comment.text}</span>
                    </div>
                  ))}
                  
                  <CommentForm postId={post._id} onComment={handleComment} />
                </div>
              </div>
            ))}

            {posts.length === 0 && (
              <div className="no-posts">
                <p>No posts yet. Be the first to share!</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="community-sidebar">
            {/* Leaderboard */}
            <div className="sidebar-card">
              <h2>🏆 Leaderboard</h2>
              <div className="leaderboard-list">
                {leaderboard.slice(0, 10).map((user, index) => (
                  <div key={user._id || index} className="leaderboard-item">
                    <div className="leaderboard-rank">#{index + 1}</div>
                    <div className="leaderboard-user">
                      <strong>{user.name}</strong>
                      <span>⭐ {user.xp} XP</span>
                      {user.streak > 0 && <span>🔥 {user.streak} day streak</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CommentForm = ({ postId, onComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      onComment(postId, commentText);
      setCommentText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <input
        type="text"
        className="input"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
      />
      <button type="submit" className="btn btn-secondary">Post</button>
    </form>
  );
};

export default Community;

