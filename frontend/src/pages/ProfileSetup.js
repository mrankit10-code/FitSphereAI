import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: 'prefer-not-to-say',
    fitnessGoal: 'general-fitness',
    dailyWorkoutTime: 30,
    equipmentAvailability: ['bodyweight'],
    foodPreference: 'no-preference',
    fitnessLevel: 'beginner'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/profile');
      if (response.data.profile) {
        setExistingProfile(response.data.profile);
        setFormData({
          age: response.data.profile.age || '',
          height: response.data.profile.height || '',
          weight: response.data.profile.weight || '',
          gender: response.data.profile.gender || 'prefer-not-to-say',
          fitnessGoal: response.data.profile.fitnessGoal || 'general-fitness',
          dailyWorkoutTime: response.data.profile.dailyWorkoutTime || 30,
          equipmentAvailability: response.data.profile.equipmentAvailability || ['bodyweight'],
          foodPreference: response.data.profile.foodPreference || 'no-preference',
          fitnessLevel: response.data.profile.fitnessLevel || 'beginner'
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const equipment = formData.equipmentAvailability;
      if (checked) {
        setFormData({ ...formData, equipmentAvailability: [...equipment, value] });
      } else {
        setFormData({ ...formData, equipmentAvailability: equipment.filter(eq => eq !== value) });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/profile', formData);
      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup">
      <div className="container">
        <div className="profile-setup-card">
          <h1>{existingProfile ? 'Update Your Profile' : 'Complete Your Profile'}</h1>
          <p className="subtitle">Help us personalize your fitness journey</p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="input"
                  value={formData.age}
                  onChange={handleChange}
                  min="13"
                  max="100"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="height">Height (cm)</label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  className="input"
                  value={formData.height}
                  onChange={handleChange}
                  min="100"
                  max="250"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  className="input"
                  value={formData.weight}
                  onChange={handleChange}
                  min="30"
                  max="300"
                  step="0.1"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                className="input"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="fitnessGoal">Fitness Goal</label>
              <select
                id="fitnessGoal"
                name="fitnessGoal"
                className="input"
                value={formData.fitnessGoal}
                onChange={handleChange}
                required
              >
                <option value="weight-loss">Weight Loss</option>
                <option value="muscle-gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
                <option value="flexibility">Flexibility</option>
                <option value="general-fitness">General Fitness</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="fitnessLevel">Fitness Level</label>
              <select
                id="fitnessLevel"
                name="fitnessLevel"
                className="input"
                value={formData.fitnessLevel}
                onChange={handleChange}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="dailyWorkoutTime">Daily Workout Time (minutes)</label>
              <input
                type="number"
                id="dailyWorkoutTime"
                name="dailyWorkoutTime"
                className="input"
                value={formData.dailyWorkoutTime}
                onChange={handleChange}
                min="15"
                max="120"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Equipment Availability</label>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="bodyweight"
                    checked={formData.equipmentAvailability.includes('bodyweight')}
                    onChange={handleChange}
                  />
                  Bodyweight Only
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="dumbbells"
                    checked={formData.equipmentAvailability.includes('dumbbells')}
                    onChange={handleChange}
                  />
                  Dumbbells
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    value="gym"
                    checked={formData.equipmentAvailability.includes('gym')}
                    onChange={handleChange}
                  />
                  Full Gym Access
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="foodPreference">Food Preference</label>
              <select
                id="foodPreference"
                name="foodPreference"
                className="input"
                value={formData.foodPreference}
                onChange={handleChange}
                required
              >
                <option value="no-preference">No Preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
                <option value="vegan">Vegan</option>
              </select>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : existingProfile ? 'Update Profile' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;

