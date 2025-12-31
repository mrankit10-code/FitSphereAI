import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">💪</span>
            FitSphere AI
          </Link>
          
          <div className="navbar-links">
            {user ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/workouts">Workouts</Link>
                <Link to="/nutrition">Nutrition</Link>
                <Link to="/wellness">Wellness</Link>
                <Link to="/progress">Progress</Link>
                <Link to="/community">Community</Link>
                {user.role === 'admin' && (
                  <Link to="/admin">Admin</Link>
                )}
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className="user-xp">⭐ {user.xp} XP</span>
                  <span className="user-streak">🔥 {user.streak} day streak</span>
                </div>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/signup" className="btn btn-primary">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

