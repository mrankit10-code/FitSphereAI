import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    completedWorkouts: 0,
    totalXP: 0,
    streak: 0
  });
  const [recentWorkouts, setRecentWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [workoutsRes] = await Promise.all([
        axios.get('/api/workouts')
      ]);

      const workouts = workoutsRes.data.workouts || [];
      const completed = workouts.filter(w => w.completed).length;

      setStats({
        totalWorkouts: workouts.length,
        completedWorkouts: completed,
        totalXP: user.xp || 0,
        streak: user.streak || 0
      });

      setRecentWorkouts(workouts.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user.name}! 👋</h1>
          <p>Let's continue your fitness journey</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <h3>{stats.streak}</h3>
              <p>Day Streak</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{stats.totalXP}</h3>
              <p>Total XP</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💪</div>
            <div className="stat-content">
              <h3>{stats.completedWorkouts}</h3>
              <p>Workouts Completed</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.totalWorkouts}</h3>
              <p>Total Workouts</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div className="badges-section">
            <h2>Your Badges</h2>
            <div className="badges-grid">
              {user.badges.map((badge, index) => (
                <div key={index} className="badge-card">
                  <span className="badge-icon">🏆</span>
                  <p>{badge.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/workouts" className="action-card">
              <div className="action-icon">🤖</div>
              <h3>Generate Workout</h3>
              <p>Get a personalized workout plan</p>
            </Link>
            <Link to="/nutrition" className="action-card">
              <div className="action-icon">🍎</div>
              <h3>Nutrition Plan</h3>
              <p>View your daily nutrition goals</p>
            </Link>
            <Link to="/wellness" className="action-card">
              <div className="action-icon">🧘</div>
              <h3>Mental Wellness</h3>
              <p>Meditation and breathing exercises</p>
            </Link>
            <Link to="/progress" className="action-card">
              <div className="action-icon">📈</div>
              <h3>Track Progress</h3>
              <p>View your fitness progress</p>
            </Link>
            <Link to="/community" className="action-card">
              <div className="action-icon">👥</div>
              <h3>Community</h3>
              <p>Connect with others</p>
            </Link>
          </div>
        </div>

        {/* Recent Workouts */}
        {recentWorkouts.length > 0 && (
          <div className="recent-workouts">
            <h2>Recent Workouts</h2>
            <div className="workouts-list">
              {recentWorkouts.map(workout => (
                <div key={workout._id} className="workout-item">
                  <div className="workout-info">
                    <h3>{workout.title}</h3>
                    <p>{workout.exercises.length} exercises • {workout.duration} minutes</p>
                  </div>
                  <div className="workout-status">
                    {workout.completed ? (
                      <span className="status-completed">✓ Completed</span>
                    ) : (
                      <span className="status-pending">Pending</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/workouts" className="btn btn-secondary">View All Workouts</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

