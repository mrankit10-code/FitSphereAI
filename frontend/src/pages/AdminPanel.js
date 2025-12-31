import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [challengeForm, setChallengeForm] = useState({
    title: '',
    description: '',
    type: 'workout',
    duration: 7,
    xpReward: 100,
    endDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`);
      fetchUsers();
      setSuccess('User deleted successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/admin/challenges', challengeForm);
      setChallengeForm({
        title: '',
        description: '',
        type: 'workout',
        duration: 7,
        xpReward: 100,
        endDate: ''
      });
      setSuccess('Challenge created successfully');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create challenge');
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="container">
        <h1>Admin Panel</h1>
        <p className="subtitle">Manage users, challenges, and view platform analytics</p>

        {/* Stats */}
        {stats && (
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Total Workouts</h3>
              <p>{stats.totalWorkouts}</p>
            </div>
            <div className="stat-card">
              <h3>Completed Workouts</h3>
              <p>{stats.completedWorkouts}</p>
            </div>
            <div className="stat-card">
              <h3>Completion Rate</h3>
              <p>{stats.completionRate}%</p>
            </div>
            <div className="stat-card">
              <h3>Active Challenges</h3>
              <p>{stats.activeChallenges}</p>
            </div>
          </div>
        )}

        {/* Create Challenge */}
        <div className="admin-card">
          <h2>Create Challenge</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleCreateChallenge}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  className="input"
                  value={challengeForm.title}
                  onChange={(e) => setChallengeForm({ ...challengeForm, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  className="input"
                  value={challengeForm.type}
                  onChange={(e) => setChallengeForm({ ...challengeForm, type: e.target.value })}
                  required
                >
                  <option value="workout">Workout</option>
                  <option value="streak">Streak</option>
                  <option value="nutrition">Nutrition</option>
                  <option value="community">Community</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                className="input"
                value={challengeForm.description}
                onChange={(e) => setChallengeForm({ ...challengeForm, description: e.target.value })}
                rows="3"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration">Duration (days)</label>
                <input
                  type="number"
                  id="duration"
                  className="input"
                  value={challengeForm.duration}
                  onChange={(e) => setChallengeForm({ ...challengeForm, duration: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="xpReward">XP Reward</label>
                <input
                  type="number"
                  id="xpReward"
                  className="input"
                  value={challengeForm.xpReward}
                  onChange={(e) => setChallengeForm({ ...challengeForm, xpReward: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="date"
                  id="endDate"
                  className="input"
                  value={challengeForm.endDate}
                  onChange={(e) => setChallengeForm({ ...challengeForm, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary">
              Create Challenge
            </button>
          </form>
        </div>

        {/* Users List */}
        <div className="admin-card">
          <h2>Users Management</h2>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>XP</th>
                  <th>Streak</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.xp || 0}</td>
                    <td>{user.streak || 0}</td>
                    <td>
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

