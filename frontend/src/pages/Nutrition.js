import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Nutrition.css';

const Nutrition = () => {
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [todayMeals, setTodayMeals] = useState(null);
  const [loading, setLoading] = useState(true);
  const [waterIntake, setWaterIntake] = useState(0);

  useEffect(() => {
    fetchNutritionPlan();
    fetchTodayMeals();
  }, []);

  const fetchNutritionPlan = async () => {
    try {
      const response = await axios.get('/api/nutrition/plan');
      setNutritionPlan(response.data);
    } catch (error) {
      console.error('Error fetching nutrition plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayMeals = async () => {
    try {
      const response = await axios.get('/api/nutrition/today');
      setTodayMeals(response.data);
    } catch (error) {
      console.error('Error fetching today meals:', error);
    }
  };

  const addWater = (amount) => {
    setWaterIntake(prev => Math.min(prev + amount, nutritionPlan?.waterIntake || 2500));
  };

  if (loading) {
    return (
      <div className="nutrition-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!nutritionPlan) {
    return (
      <div className="nutrition">
        <div className="container">
          <div className="error-message">
            Please complete your profile to view nutrition plan.
          </div>
        </div>
      </div>
    );
  }

  const waterPercentage = (waterIntake / nutritionPlan.waterIntake) * 100;

  return (
    <div className="nutrition">
      <div className="container">
        <h1>Nutrition Plan</h1>
        <p className="subtitle">Your personalized nutrition guidance</p>

        {/* Daily Goals */}
        <div className="nutrition-goals">
          <div className="goal-card">
            <h3>Daily Calories</h3>
            <p className="goal-value">{nutritionPlan.dailyCalories}</p>
            <p className="goal-unit">kcal</p>
          </div>
          <div className="goal-card">
            <h3>Protein</h3>
            <p className="goal-value">{nutritionPlan.macros.protein}g</p>
            <p className="goal-unit">per day</p>
          </div>
          <div className="goal-card">
            <h3>Carbs</h3>
            <p className="goal-value">{nutritionPlan.macros.carbs}g</p>
            <p className="goal-unit">per day</p>
          </div>
          <div className="goal-card">
            <h3>Fats</h3>
            <p className="goal-value">{nutritionPlan.macros.fats}g</p>
            <p className="goal-unit">per day</p>
          </div>
        </div>

        {/* Water Intake */}
        <div className="water-intake-card">
          <h2>Water Intake</h2>
          <div className="water-progress">
            <div className="water-bar-container">
              <div
                className="water-bar"
                style={{ width: `${waterPercentage}%` }}
              ></div>
            </div>
            <p className="water-amount">
              {waterIntake}ml / {nutritionPlan.waterIntake}ml
            </p>
          </div>
          <div className="water-buttons">
            <button onClick={() => addWater(250)} className="btn btn-secondary">
              +250ml
            </button>
            <button onClick={() => addWater(500)} className="btn btn-secondary">
              +500ml
            </button>
            <button onClick={() => setWaterIntake(0)} className="btn btn-secondary">
              Reset
            </button>
          </div>
        </div>

        {/* Today's Meals */}
        {todayMeals && (
          <div className="today-meals-card">
            <div className="meals-header">
              <h2>What to Eat Today?</h2>
              <button onClick={fetchTodayMeals} className="btn btn-secondary">
                Get New Suggestions
              </button>
            </div>
            <div className="meals-grid">
              <div className="meal-item">
                <div className="meal-icon">🌅</div>
                <h3>Breakfast</h3>
                <p>{todayMeals.breakfast}</p>
              </div>
              <div className="meal-item">
                <div className="meal-icon">☀️</div>
                <h3>Lunch</h3>
                <p>{todayMeals.lunch}</p>
              </div>
              <div className="meal-item">
                <div className="meal-icon">🌙</div>
                <h3>Dinner</h3>
                <p>{todayMeals.dinner}</p>
              </div>
              <div className="meal-item">
                <div className="meal-icon">🍎</div>
                <h3>Snack</h3>
                <p>{todayMeals.snack}</p>
              </div>
            </div>
          </div>
        )}

        {/* Meal Suggestions */}
        {nutritionPlan.meals && (
          <div className="meal-suggestions-card">
            <h2>Meal Suggestions</h2>
            <div className="meal-categories">
              <div className="meal-category">
                <h3>Breakfast Options</h3>
                <ul>
                  {nutritionPlan.meals.breakfast.map((meal, index) => (
                    <li key={index}>{meal}</li>
                  ))}
                </ul>
              </div>
              <div className="meal-category">
                <h3>Lunch Options</h3>
                <ul>
                  {nutritionPlan.meals.lunch.map((meal, index) => (
                    <li key={index}>{meal}</li>
                  ))}
                </ul>
              </div>
              <div className="meal-category">
                <h3>Dinner Options</h3>
                <ul>
                  {nutritionPlan.meals.dinner.map((meal, index) => (
                    <li key={index}>{meal}</li>
                  ))}
                </ul>
              </div>
              <div className="meal-category">
                <h3>Snack Options</h3>
                <ul>
                  {nutritionPlan.meals.snacks.map((meal, index) => (
                    <li key={index}>{meal}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Nutrition;

