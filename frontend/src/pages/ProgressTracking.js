import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ProgressTracking.css';

const ProgressTracking = () => {
  const [formData, setFormData] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    },
    notes: ''
  });
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgress();
    fetchStats();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await axios.get('/api/progress');
      setProgress(response.data.progress || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/progress/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('measurements.')) {
      const measurementType = name.split('.')[1];
      setFormData({
        ...formData,
        measurements: {
          ...formData.measurements,
          [measurementType]: value
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await axios.post('/api/progress', formData);
      setFormData({
        weight: '',
        bodyFat: '',
        muscleMass: '',
        measurements: {
          chest: '',
          waist: '',
          hips: '',
          arms: '',
          thighs: ''
        },
        notes: ''
      });
      fetchProgress();
      fetchStats();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save progress');
    } finally {
      setLoading(false);
    }
  };

  const chartData = progress
    .filter(p => p.weight)
    .map(p => ({
      date: new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: p.weight
    }))
    .reverse();

  return (
    <div className="progress-tracking">
      <div className="container">
        <h1>Progress Tracking</h1>
        <p className="subtitle">Track your fitness journey and see your improvements</p>

        {/* Stats Overview */}
        {stats && (
          <div className="progress-stats">
            <div className="stat-card">
              <h3>Weight Change</h3>
              <p className={stats.weightChange > 0 ? 'positive' : stats.weightChange < 0 ? 'negative' : 'neutral'}>
                {stats.weightChange > 0 ? '+' : ''}{stats.weightChange} kg
              </p>
            </div>
            <div className="stat-card">
              <h3>Total Entries</h3>
              <p>{stats.totalEntries}</p>
            </div>
            <div className="stat-card">
              <h3>First Entry</h3>
              <p>{stats.firstEntry?.weight ? `${stats.firstEntry.weight} kg` : 'N/A'}</p>
            </div>
            <div className="stat-card">
              <h3>Latest Entry</h3>
              <p>{stats.latestEntry?.weight ? `${stats.latestEntry.weight} kg` : 'N/A'}</p>
            </div>
          </div>
        )}

        {/* Weight Chart */}
        {chartData.length > 0 && (
          <div className="chart-card">
            <h2>Weight Progress</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="weight" stroke="#667eea" strokeWidth={2} name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Add Progress Form */}
        <div className="progress-form-card">
          <h2>Add Progress Entry</h2>
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  className="input"
                  value={formData.weight}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bodyFat">Body Fat %</label>
                <input
                  type="number"
                  id="bodyFat"
                  name="bodyFat"
                  className="input"
                  value={formData.bodyFat}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="muscleMass">Muscle Mass (kg)</label>
                <input
                  type="number"
                  id="muscleMass"
                  name="muscleMass"
                  className="input"
                  value={formData.muscleMass}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
            </div>

            <h3>Measurements (cm)</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="chest">Chest</label>
                <input
                  type="number"
                  id="chest"
                  name="measurements.chest"
                  className="input"
                  value={formData.measurements.chest}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="waist">Waist</label>
                <input
                  type="number"
                  id="waist"
                  name="measurements.waist"
                  className="input"
                  value={formData.measurements.waist}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="hips">Hips</label>
                <input
                  type="number"
                  id="hips"
                  name="measurements.hips"
                  className="input"
                  value={formData.measurements.hips}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="arms">Arms</label>
                <input
                  type="number"
                  id="arms"
                  name="measurements.arms"
                  className="input"
                  value={formData.measurements.arms}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="thighs">Thighs</label>
                <input
                  type="number"
                  id="thighs"
                  name="measurements.thighs"
                  className="input"
                  value={formData.measurements.thighs}
                  onChange={handleChange}
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                className="input"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Progress'}
            </button>
          </form>
        </div>

        {/* Progress History */}
        {progress.length > 0 && (
          <div className="progress-history">
            <h2>Progress History</h2>
            <div className="history-list">
              {progress.slice(0, 10).map(entry => (
                <div key={entry._id} className="history-item">
                  <div className="history-date">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                  <div className="history-data">
                    {entry.weight && <span>Weight: {entry.weight} kg</span>}
                    {entry.bodyFat && <span>Body Fat: {entry.bodyFat}%</span>}
                    {entry.muscleMass && <span>Muscle: {entry.muscleMass} kg</span>}
                  </div>
                  {entry.notes && (
                    <div className="history-notes">{entry.notes}</div>
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

export default ProgressTracking;

