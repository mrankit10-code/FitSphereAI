import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkoutGenerator.css';

const WorkoutGenerator = () => {
  const [workoutType, setWorkoutType] = useState('home');
  const [timeAvailable, setTimeAvailable] = useState(30);
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const response = await axios.get('/api/workouts');
      setWorkouts(response.data.workouts || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const generateWorkout = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await axios.post('/api/workouts/generate', {
        workoutType,
        timeAvailable
      });
      setWorkout(response.data.workout);
      fetchWorkouts();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate workout');
    } finally {
      setLoading(false);
    }
  };

  const completeWorkout = async (workoutId) => {
    try {
      await axios.put(`/api/workouts/${workoutId}/complete`);
      fetchWorkouts();
      if (workout && workout._id === workoutId) {
        setWorkout({ ...workout, completed: true });
      }
    } catch (error) {
      console.error('Error completing workout:', error);
    }
  };

  return (
    <div className="workout-generator">
      <div className="container">
        <h1>AI Workout Generator</h1>
        <p className="subtitle">Get personalized workouts based on your goals and preferences</p>

        {/* Generator Form */}
        <div className="generator-card">
          <h2>Create New Workout</h2>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="workoutType">Workout Type</label>
            <select
              id="workoutType"
              className="input"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
            >
              <option value="home">Home Workout</option>
              <option value="gym">Gym Workout</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="timeAvailable">Time Available (minutes)</label>
            <input
              type="number"
              id="timeAvailable"
              className="input"
              value={timeAvailable}
              onChange={(e) => setTimeAvailable(parseInt(e.target.value))}
              min="15"
              max="120"
            />
          </div>

          <button
            onClick={generateWorkout}
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Workout'}
          </button>
        </div>

        {/* Generated Workout */}
        {workout && (
          <div className="workout-card">
            <div className="workout-header">
              <h2>{workout.title}</h2>
              <div className="workout-meta">
                <span>⏱️ {workout.duration} minutes</span>
                <span>🔥 ~{workout.caloriesBurned} calories</span>
                <span>📊 {workout.difficulty}</span>
              </div>
            </div>

            <div className="exercises-list">
              <h3>Exercises</h3>
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="exercise-item">
                  <div className="exercise-number">{index + 1}</div>
                  <div className="exercise-details">
                    <h4>{exercise.name}</h4>
                    <p>{exercise.sets} sets × {exercise.reps} reps</p>
                    <p className="rest-time">Rest: {exercise.restTime} seconds</p>
                  </div>
                </div>
              ))}
            </div>

            {!workout.completed && (
              <button
                onClick={() => completeWorkout(workout._id)}
                className="btn btn-primary"
              >
                Mark as Completed
              </button>
            )}
            {workout.completed && (
              <div className="success-message">✓ Workout completed! Great job!</div>
            )}
          </div>
        )}

        {/* Previous Workouts */}
        {workouts.length > 0 && (
          <div className="previous-workouts">
            <h2>Your Workouts</h2>
            <div className="workouts-grid">
              {workouts.map(w => (
                <div key={w._id} className="workout-item-card">
                  <h3>{w.title}</h3>
                  <p>{w.exercises.length} exercises • {w.duration} min</p>
                  <div className="workout-status">
                    {w.completed ? (
                      <span className="status-badge completed">Completed</span>
                    ) : (
                      <span className="status-badge pending">Pending</span>
                    )}
                  </div>
                  {!w.completed && (
                    <button
                      onClick={() => completeWorkout(w._id)}
                      className="btn btn-secondary"
                      style={{ marginTop: '1rem', width: '100%' }}
                    >
                      Complete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutGenerator;

