const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Workout = require('../models/Workout');
const Profile = require('../models/Profile');
const User = require('../models/User');

// Exercise database
const exerciseDatabase = {
  beginner: {
    home: [
      { name: 'Push-ups', sets: 3, reps: 10, restTime: 60 },
      { name: 'Bodyweight Squats', sets: 3, reps: 15, restTime: 60 },
      { name: 'Plank', sets: 3, reps: 30, restTime: 60 },
      { name: 'Jumping Jacks', sets: 3, reps: 20, restTime: 45 },
      { name: 'Lunges', sets: 3, reps: 10, restTime: 60 },
      { name: 'Mountain Climbers', sets: 3, reps: 15, restTime: 60 },
      { name: 'Burpees', sets: 2, reps: 8, restTime: 90 },
      { name: 'High Knees', sets: 3, reps: 20, restTime: 45 }
    ],
    gym: [
      { name: 'Bench Press', sets: 3, reps: 10, restTime: 90 },
      { name: 'Squats', sets: 3, reps: 12, restTime: 90 },
      { name: 'Deadlifts', sets: 3, reps: 8, restTime: 120 },
      { name: 'Shoulder Press', sets: 3, reps: 10, restTime: 90 },
      { name: 'Lat Pulldown', sets: 3, reps: 12, restTime: 90 },
      { name: 'Leg Press', sets: 3, reps: 15, restTime: 90 }
    ]
  },
  intermediate: {
    home: [
      { name: 'Push-ups', sets: 4, reps: 15, restTime: 45 },
      { name: 'Pistol Squats', sets: 3, reps: 8, restTime: 90 },
      { name: 'Plank', sets: 4, reps: 60, restTime: 45 },
      { name: 'Burpees', sets: 4, reps: 12, restTime: 60 },
      { name: 'Diamond Push-ups', sets: 3, reps: 12, restTime: 60 },
      { name: 'Jump Squats', sets: 3, reps: 15, restTime: 60 },
      { name: 'Pike Push-ups', sets: 3, reps: 10, restTime: 60 }
    ],
    gym: [
      { name: 'Bench Press', sets: 4, reps: 12, restTime: 75 },
      { name: 'Squats', sets: 4, reps: 15, restTime: 75 },
      { name: 'Deadlifts', sets: 4, reps: 10, restTime: 120 },
      { name: 'Overhead Press', sets: 4, reps: 12, restTime: 75 },
      { name: 'Pull-ups', sets: 3, reps: 10, restTime: 90 },
      { name: 'Barbell Rows', sets: 4, reps: 12, restTime: 75 }
    ]
  },
  advanced: {
    home: [
      { name: 'One-Arm Push-ups', sets: 3, reps: 8, restTime: 90 },
      { name: 'Pistol Squats', sets: 4, reps: 12, restTime: 60 },
      { name: 'Handstand Push-ups', sets: 3, reps: 5, restTime: 120 },
      { name: 'Burpees', sets: 5, reps: 15, restTime: 45 },
      { name: 'Muscle-ups', sets: 3, reps: 5, restTime: 120 }
    ],
    gym: [
      { name: 'Bench Press', sets: 5, reps: 8, restTime: 120 },
      { name: 'Squats', sets: 5, reps: 10, restTime: 120 },
      { name: 'Deadlifts', sets: 5, reps: 8, restTime: 180 },
      { name: 'Overhead Press', sets: 5, reps: 8, restTime: 120 },
      { name: 'Weighted Pull-ups', sets: 4, reps: 8, restTime: 120 }
    ]
  }
};

// Calculate workout difficulty based on weeks
const calculateDifficulty = (fitnessLevel, weeksActive) => {
  if (weeksActive < 2) return fitnessLevel;
  if (weeksActive < 4 && fitnessLevel === 'beginner') return 'intermediate';
  if (weeksActive < 8 && fitnessLevel === 'intermediate') return 'advanced';
  return fitnessLevel === 'beginner' ? 'intermediate' : 'advanced';
};

// @route   POST /api/workouts/generate
// @desc    Generate AI workout
// @access  Private
router.post('/generate', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ message: 'Please complete your profile first' });
    }

    const { workoutType = 'home', timeAvailable } = req.body;
    const availableTime = timeAvailable || profile.dailyWorkoutTime || 30;

    // Calculate weeks active (simplified - based on account age)
    const user = await User.findById(req.user.id);
    const createdAt = new Date(user.createdAt);
    const accountAgeWeeks = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24 * 7));
    const difficulty = calculateDifficulty(profile.fitnessLevel, accountAgeWeeks);

    const exercises = exerciseDatabase[difficulty]?.[workoutType] || exerciseDatabase['beginner']['home'];
    
    // Select exercises based on available time (estimate 3-4 minutes per exercise)
    const exercisesPerWorkout = Math.floor(availableTime / 4);
    const selectedExercises = exercises.slice(0, Math.min(exercisesPerWorkout, exercises.length));

    // Calculate total duration
    const totalDuration = selectedExercises.reduce((total, ex) => {
      return total + (ex.sets * (ex.restTime + 30)); // 30 seconds per rep estimate
    }, 0) / 60; // Convert to minutes

    const workout = await Workout.create({
      userId: req.user.id,
      title: `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Workout - ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}`,
      exercises: selectedExercises,
      duration: Math.round(totalDuration),
      workoutType,
      difficulty,
      caloriesBurned: Math.round(totalDuration * 8) // Rough estimate: 8 calories per minute
    });

    res.json({ workout });
  } catch (error) {
    console.error('Generate workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/workouts
// @desc    Get user workouts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.id, limit: 50 });
    res.json({ workouts });
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/workouts/:id/complete
// @desc    Mark workout as completed
// @access  Private
router.put('/:id/complete', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({ id: req.params.id, userId: req.user.id });
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    await Workout.updateById(workout.id, {
      completed: true,
      completedAt: new Date()
    });
    const updatedWorkout = await Workout.findById(workout.id);

    // Update user XP and streak
    const user = await User.findById(req.user.id);
    const xpGained = Math.round(workout.duration * 2); // 2 XP per minute
    const newXP = (user.xp || 0) + xpGained;

    // Update streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWorkoutDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;
    let newStreak = user.streak || 0;
    let badges = user.badges || [];
    
    if (!lastWorkoutDate || lastWorkoutDate < today) {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (!lastWorkoutDate || lastWorkoutDate.getTime() === yesterday.getTime()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
      
      // Award badges
      if (newStreak === 7 && !badges.includes('7-day-streak')) {
        badges.push('7-day-streak');
      }
      if (newStreak === 30 && !badges.includes('30-day-streak')) {
        badges.push('30-day-streak');
      }
    }

    await User.updateById(user.id, {
      xp: newXP,
      streak: newStreak,
      lastWorkoutDate: today,
      badges: badges
    });

    res.json({ workout: updatedWorkout, xpGained, streak: newStreak });
  } catch (error) {
    console.error('Complete workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

