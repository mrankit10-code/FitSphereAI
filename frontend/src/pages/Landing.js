import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Smart Fitness for Real Life</h1>
            <p className="hero-subtitle">
              AI-powered workouts, personalized nutrition, and mental wellness - 
              all in one place to help you achieve your fitness goals.
            </p>
            <div className="hero-buttons">
              {user ? (
                <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/signup" className="btn btn-primary">Start Free</Link>
                  <Link to="/signup" className="btn btn-secondary">Build My Fitness Plan</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose FitSphere AI?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🤖</div>
              <h3>AI Workout Generator</h3>
              <p>Get personalized workouts based on your goals, fitness level, and available time.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🍎</div>
              <h3>Personalized Diet</h3>
              <p>Receive customized nutrition plans with Indian meal suggestions tailored to your preferences.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧘</div>
              <h3>Mental Wellness</h3>
              <p>Guided breathing exercises, meditation routines, and stress relief tips for holistic health.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Community Challenges</h3>
              <p>Join challenges, share progress, and stay motivated with our supportive community.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Track your weight, workouts, and achievements with detailed analytics and visualizations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Gamification</h3>
              <p>Earn XP, maintain streaks, unlock badges, and compete on leaderboards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <p className="testimonial-text">
                "FitSphere AI has completely transformed my fitness journey. The personalized workouts 
                fit perfectly into my busy schedule!"
              </p>
              <p className="testimonial-author">- Priya S., Mumbai</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                "I love the nutrition module! The Indian meal suggestions make it so easy to stay on track."
              </p>
              <p className="testimonial-author">- Rahul K., Delhi</p>
            </div>
            <div className="testimonial-card">
              <p className="testimonial-text">
                "The community feature keeps me motivated. I've made so many friends and achieved goals 
                I never thought possible!"
              </p>
              <p className="testimonial-author">- Anjali M., Bangalore</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Start Your Fitness Journey?</h2>
          <p>Join thousands of users achieving their fitness goals with FitSphere AI</p>
          {!user && (
            <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>FitSphere AI</h3>
              <p>Smart Fitness for Real Life</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/">Home</Link>
              {user && <Link to="/dashboard">Dashboard</Link>}
              {!user && <Link to="/login">Login</Link>}
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: support@fitsphere.ai</p>
              <p>Phone: +91 1234567890</p>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#" aria-label="Facebook">Facebook</a>
                <a href="#" aria-label="Twitter">Twitter</a>
                <a href="#" aria-label="Instagram">Instagram</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 FitSphere AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

