const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Profile = require('../models/Profile');

// Calculate BMR (Basal Metabolic Rate)
const calculateBMR = (weight, height, age, gender) => {
  // Mifflin-St Jeor Equation
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else if (gender === 'female') {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
  // Default calculation
  return 10 * weight + 6.25 * height - 5 * age - 50;
};

// Calculate daily calorie needs
const calculateDailyCalories = (bmr, fitnessGoal, activityLevel = 1.5) => {
  const tdee = bmr * activityLevel; // Total Daily Energy Expenditure
  
  switch (fitnessGoal) {
    case 'weight-loss':
      return Math.round(tdee * 0.85); // 15% deficit
    case 'muscle-gain':
      return Math.round(tdee * 1.15); // 15% surplus
    case 'endurance':
      return Math.round(tdee * 1.1); // 10% surplus
    default:
      return Math.round(tdee);
  }
};

// Calculate protein requirement
const calculateProtein = (weight, fitnessGoal) => {
  let proteinPerKg = 1.6; // Default
  
  if (fitnessGoal === 'muscle-gain') {
    proteinPerKg = 2.0;
  } else if (fitnessGoal === 'weight-loss') {
    proteinPerKg = 2.2;
  }
  
  return Math.round(weight * proteinPerKg);
};

// Meal suggestions (Indian cuisine)
const mealSuggestions = {
  vegetarian: {
    breakfast: [
      'Oats with fruits and nuts',
      'Poha with vegetables',
      'Upma with vegetables',
      'Idli with sambar',
      'Paratha with curd'
    ],
    lunch: [
      'Dal, rice, and vegetables',
      'Rajma with rice',
      'Chole with roti',
      'Vegetable curry with roti',
      'Sambar rice with vegetables'
    ],
    dinner: [
      'Vegetable khichdi',
      'Dal tadka with roti',
      'Mixed vegetable curry with rice',
      'Palak paneer with roti',
      'Vegetable pulao'
    ],
    snacks: [
      'Fruits with nuts',
      'Roasted chana',
      'Sprouts salad',
      'Yogurt with fruits'
    ]
  },
  'non-vegetarian': {
    breakfast: [
      'Eggs with toast',
      'Chicken sandwich',
      'Egg curry with roti',
      'Omelette with vegetables'
    ],
    lunch: [
      'Chicken curry with rice',
      'Fish curry with rice',
      'Mutton curry with roti',
      'Egg curry with rice'
    ],
    dinner: [
      'Grilled chicken with vegetables',
      'Fish fry with rice',
      'Chicken biryani',
      'Egg curry with roti'
    ],
    snacks: [
      'Boiled eggs',
      'Chicken salad',
      'Fish tikka'
    ]
  },
  vegan: {
    breakfast: [
      'Oats with fruits',
      'Poha with vegetables',
      'Upma',
      'Fruit smoothie'
    ],
    lunch: [
      'Dal with rice',
      'Rajma with rice',
      'Chole with roti',
      'Vegetable curry'
    ],
    dinner: [
      'Vegetable khichdi',
      'Dal tadka with roti',
      'Mixed vegetable curry'
    ],
    snacks: [
      'Fruits',
      'Roasted chana',
      'Sprouts salad'
    ]
  }
};

// @route   GET /api/nutrition/plan
// @desc    Get nutrition plan
// @access  Private
router.get('/plan', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile || !profile.weight || !profile.height || !profile.age) {
      return res.status(400).json({ message: 'Please complete your profile first' });
    }

    const bmr = calculateBMR(profile.weight, profile.height, profile.age, profile.gender);
    const dailyCalories = calculateDailyCalories(bmr, profile.fitnessGoal);
    const proteinRequirement = calculateProtein(profile.weight, profile.fitnessGoal);
    const carbsRequirement = Math.round((dailyCalories * 0.45) / 4); // 45% of calories from carbs
    const fatsRequirement = Math.round((dailyCalories * 0.25) / 9); // 25% of calories from fats

    const foodPref = profile.foodPreference || 'vegetarian';
    const meals = mealSuggestions[foodPref] || mealSuggestions['vegetarian'];

    res.json({
      dailyCalories,
      macros: {
        protein: proteinRequirement,
        carbs: carbsRequirement,
        fats: fatsRequirement
      },
      meals,
      waterIntake: 2500 // ml per day
    });
  } catch (error) {
    console.error('Get nutrition plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/nutrition/today
// @desc    Get today's meal suggestions
// @access  Private
router.get('/today', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(400).json({ message: 'Please complete your profile first' });
    }

    const foodPref = profile.foodPreference || 'vegetarian';
    const meals = mealSuggestions[foodPref] || mealSuggestions['vegetarian'];

    // Randomly select one meal from each category
    const getRandomMeal = (mealArray) => {
      return mealArray[Math.floor(Math.random() * mealArray.length)];
    };

    res.json({
      breakfast: getRandomMeal(meals.breakfast),
      lunch: getRandomMeal(meals.lunch),
      dinner: getRandomMeal(meals.dinner),
      snack: getRandomMeal(meals.snacks)
    });
  } catch (error) {
    console.error('Get today meals error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

