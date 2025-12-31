import React, { useState } from 'react';
import './MentalWellness.css';

const MentalWellness = () => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('inhale');
  const [meditationActive, setMeditationActive] = useState(false);
  const [meditationTime, setMeditationTime] = useState(300); // 5 minutes in seconds
  const [timer, setTimer] = useState(300);

  const startBreathing = () => {
    setBreathingActive(true);
    let phase = 'inhale';
    setBreathingPhase(phase);
    
    const interval = setInterval(() => {
      if (phase === 'inhale') {
        phase = 'hold';
        setBreathingPhase('hold');
      } else if (phase === 'hold') {
        phase = 'exhale';
        setBreathingPhase('exhale');
      } else {
        phase = 'rest';
        setBreathingPhase('rest');
      }
    }, 4000);

    setTimeout(() => {
      clearInterval(interval);
      setBreathingActive(false);
      setBreathingPhase('inhale');
    }, 120000); // 2 minutes
  };

  const startMeditation = () => {
    setMeditationActive(true);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setMeditationActive(false);
          setTimer(meditationTime);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopMeditation = () => {
    setMeditationActive(false);
    setTimer(meditationTime);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="mental-wellness">
      <div className="container">
        <h1>Mental Wellness</h1>
        <p className="subtitle">Take care of your mind for holistic health</p>

        {/* Breathing Exercise */}
        <div className="wellness-card breathing-card">
          <h2>Guided Breathing Exercise</h2>
          <p>Follow the breathing pattern: Inhale (4s) → Hold (4s) → Exhale (4s) → Rest (4s)</p>
          
          <div className="breathing-circle-container">
            <div className={`breathing-circle ${breathingPhase} ${breathingActive ? 'active' : ''}`}>
              <div className="breathing-text">
                {breathingActive ? (
                  <>
                    {breathingPhase === 'inhale' && <span>Breathe In</span>}
                    {breathingPhase === 'hold' && <span>Hold</span>}
                    {breathingPhase === 'exhale' && <span>Breathe Out</span>}
                    {breathingPhase === 'rest' && <span>Rest</span>}
                  </>
                ) : (
                  <span>Ready to Start</span>
                )}
              </div>
            </div>
          </div>
          
          <button
            onClick={breathingActive ? () => setBreathingActive(false) : startBreathing}
            className="btn btn-primary"
          >
            {breathingActive ? 'Stop' : 'Start Breathing Exercise'}
          </button>
        </div>

        {/* Meditation Timer */}
        <div className="wellness-card meditation-card">
          <h2>Meditation Timer</h2>
          <p>Set aside time for mindfulness and relaxation</p>
          
          <div className="meditation-timer">
            <div className="timer-display">
              {formatTime(timer)}
            </div>
            <div className="timer-controls">
              <button
                onClick={() => setMeditationTime(300)}
                className={`btn btn-secondary ${meditationTime === 300 ? 'active' : ''}`}
              >
                5 min
              </button>
              <button
                onClick={() => setMeditationTime(600)}
                className={`btn btn-secondary ${meditationTime === 600 ? 'active' : ''}`}
              >
                10 min
              </button>
              <button
                onClick={() => setMeditationTime(900)}
                className={`btn btn-secondary ${meditationTime === 900 ? 'active' : ''}`}
              >
                15 min
              </button>
            </div>
            <div className="timer-buttons">
              {!meditationActive ? (
                <button onClick={startMeditation} className="btn btn-primary">
                  Start Meditation
                </button>
              ) : (
                <button onClick={stopMeditation} className="btn btn-secondary">
                  Stop
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Wellness Tips */}
        <div className="wellness-tips">
          <h2>Wellness Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">😌</div>
              <h3>Stress Relief</h3>
              <ul>
                <li>Practice deep breathing daily</li>
                <li>Take regular breaks from work</li>
                <li>Engage in hobbies you enjoy</li>
                <li>Connect with loved ones</li>
                <li>Practice gratitude journaling</li>
              </ul>
            </div>
            <div className="tip-card">
              <div className="tip-icon">😴</div>
              <h3>Sleep Improvement</h3>
              <ul>
                <li>Maintain a consistent sleep schedule</li>
                <li>Avoid screens 1 hour before bed</li>
                <li>Create a relaxing bedtime routine</li>
                <li>Keep your bedroom cool and dark</li>
                <li>Avoid caffeine in the evening</li>
              </ul>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🧘</div>
              <h3>Mindfulness</h3>
              <ul>
                <li>Start with 5-minute daily meditation</li>
                <li>Practice mindful eating</li>
                <li>Take mindful walks in nature</li>
                <li>Use meditation apps for guidance</li>
                <li>Focus on the present moment</li>
              </ul>
            </div>
            <div className="tip-card">
              <div className="tip-icon">💪</div>
              <h3>Mental Strength</h3>
              <ul>
                <li>Set realistic goals</li>
                <li>Celebrate small wins</li>
                <li>Practice positive self-talk</li>
                <li>Learn from setbacks</li>
                <li>Surround yourself with positivity</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalWellness;

