# FitSphereAI ML Service Documentation

## Overview
The ML Service provides machine learning-powered features for FitSphereAI, including:
- **Personalized Workout Recommendations** - Based on fitness level and history
- **Nutrition Recommendations** - Customized macro calculations
- **Progress Prediction** - Forecast weight changes
- **Fitness Level Classification** - Automatic fitness level assessment
- **AI Insights** - Actionable fitness tips and suggestions

## Architecture

### ML Models
1. **Workout Recommendation (KNN Collaborative Filtering)**
   - Finds similar users and recommends their workouts
   - Uses workout history features (duration, calories, type)

2. **Nutrition Planner (Rule-Based + Regression)**
   - Calculates BMR and TDEE
   - Generates macro recommendations
   - Adapts to user goals (weight loss, muscle gain, maintenance)

3. **Progress Predictor (Random Forest Regressor)**
   - Predicts weight changes
   - Considers: workouts, calories, nutrition compliance

4. **Fitness Classifier (Random Forest Classifier)**
   - Classifies users into: Beginner, Intermediate, Advanced, Elite
   - Uses: age, BMI, workout frequency, intensity

5. **Progress Neural Network (Deep Learning)**
   - Advanced prediction using TensorFlow/Keras
   - Captures complex patterns in user data

### Data Flow
```
User Data → Preprocessing → Feature Extraction → Model Prediction → API Response
```

## Setup & Installation

### 1. Install Dependencies
```bash
cd ml_service
pip install -r requirements.txt
```

### 2. Train Models
```bash
python train_models.py
```
This generates sample data and trains all models.

### 3. Start ML Service
```bash
python app.py
```
Service runs on `http://localhost:5001`

## API Endpoints

### 1. Workout Recommendations
**POST** `/api/ml/workout-recommendations`

Request:
```json
{
  "user_data": {
    "age": 30,
    "weight": 70,
    "height": 170,
    "fitness_level": "Intermediate",
    "goal": "Weight Loss",
    "bmi": 24.2
  },
  "user_history": [
    {
      "type": "Cardio",
      "duration": 30,
      "calories_burned": 300
    }
  ]
}
```

Response:
```json
{
  "success": true,
  "recommendations": [
    {
      "type": "Cardio",
      "name": "Running",
      "duration": 40,
      "intensity": "Medium",
      "calories_burned": 400,
      "difficulty": 2
    }
  ]
}
```

### 2. Nutrition Recommendations
**POST** `/api/ml/nutrition-recommendations`

Request:
```json
{
  "user_data": {
    "age": 30,
    "weight": 70,
    "height": 170,
    "fitness_level": "Intermediate",
    "goal": "Muscle Gain"
  }
}
```

Response:
```json
{
  "success": true,
  "recommendations": [
    {
      "type": "High Protein",
      "daily_calories": 2310,
      "protein_grams": 175,
      "carbs_grams": 260,
      "fat_grams": 64,
      "description": "High protein caloric surplus for muscle growth"
    }
  ]
}
```

### 3. Progress Prediction
**POST** `/api/ml/progress-prediction`

Request:
```json
{
  "user_data": {
    "age": 30,
    "weight": 70,
    "goal": "Weight Loss"
  },
  "user_history": {
    "workout_history": [
      {"duration": 30, "calories_burned": 300}
    ],
    "nutrition_compliance": 0.85
  }
}
```

Response:
```json
{
  "success": true,
  "prediction": {
    "predicted_weight_change": -2.3,
    "direction": "Loss",
    "days_ahead": 30
  }
}
```

### 4. Fitness Level Classification
**POST** `/api/ml/classify-fitness-level`

Request:
```json
{
  "age": 30,
  "bmi": 24,
  "workouts_per_week": 4,
  "avg_duration": 40,
  "max_intensity": 7
}
```

Response:
```json
{
  "success": true,
  "fitness_level": "Intermediate"
}
```

### 5. AI Insights
**POST** `/api/ml/insights`

Request:
```json
{
  "user_data": {
    "goal": "Weight Loss",
    "fitness_level": "Beginner"
  },
  "user_history": {
    "workout_history": [
      {"duration": 30, "calories_burned": 300}
    ],
    "nutrition_history": [
      {"calories": 2000}
    ]
  }
}
```

Response:
```json
{
  "success": true,
  "insights": [
    {
      "type": "suggestion",
      "message": "Try to increase your workout frequency to 3-5 times per week."
    },
    {
      "type": "tip",
      "message": "Combine cardio with strength training for optimal weight loss results."
    }
  ]
}
```

### 6. Model Training
**POST** `/api/ml/train-models`

Request:
```json
{
  "users_with_workouts": [],
  "historical_progress_data": [],
  "user_profiles": []
}
```

### 7. Health Check
**GET** `/api/ml/health`

Response:
```json
{
  "success": true,
  "status": "ML Service is running",
  "timestamp": "2024-01-04T10:30:00"
}
```

## Integration with Backend

### 1. Add ML Service Routes
Update `backend/server.js`:
```javascript
const axios = require('axios');
const ML_SERVICE_URL = 'http://localhost:5001';

app.post('/api/recommendations/workouts', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/ml/workout-recommendations`, {
      user_data: req.body.user_data,
      user_history: req.body.user_history
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/recommendations/nutrition', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/ml/nutrition-recommendations`, {
      user_data: req.body.user_data
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/predictions/progress', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/ml/progress-prediction`, {
      user_data: req.body.user_data,
      user_history: req.body.user_history
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/insights', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/api/ml/insights`, {
      user_data: req.body.user_data,
      user_history: req.body.user_history
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### 2. Frontend Integration
Update `frontend/src/pages/Dashboard.js`:
```javascript
// Get workout recommendations
const fetchWorkoutRecommendations = async () => {
  try {
    const response = await fetch('/api/recommendations/workouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_data: userProfile,
        user_history: workoutHistory
      })
    });
    const data = await response.json();
    setRecommendations(data.recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
};

// Get nutrition recommendations
const fetchNutritionPlan = async () => {
  try {
    const response = await fetch('/api/recommendations/nutrition', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_data: userProfile })
    });
    const data = await response.json();
    setNutritionPlan(data.recommendations);
  } catch (error) {
    console.error('Error fetching nutrition plan:', error);
  }
};

// Get progress prediction
const fetchProgressPrediction = async () => {
  try {
    const response = await fetch('/api/predictions/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_data: userProfile,
        user_history: { workout_history: workouts, nutrition_compliance: 0.8 }
      })
    });
    const data = await response.json();
    setPrediction(data.prediction);
  } catch (error) {
    console.error('Error fetching prediction:', error);
  }
};

// Get AI insights
const fetchInsights = async () => {
  try {
    const response = await fetch('/api/insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_data: userProfile,
        user_history: { workout_history: workouts }
      })
    });
    const data = await response.json();
    setInsights(data.insights);
  } catch (error) {
    console.error('Error fetching insights:', error);
  }
};
```

## Model File Locations
Models are saved in `ml_service/models/` directory:
- `workout_recommendation_model.pkl` - KNN recommendation model
- `nutrition_recommendation_model.pkl` - Nutrition model
- `progress_prediction_model.pkl` - Progress regression model
- `fitness_classifier_model.pkl` - Fitness level classifier
- `progress_neural_network.h5` - Neural network model
- `*_scaler.pkl` - Feature scalers for each model
- `*_label_encoder.pkl` - Label encoders

## Performance Tuning

### Improve Recommendations
1. Collect more user workout data
2. Increase n_neighbors in KNN from 5 to 10
3. Add more features (heart rate, time of day, equipment)

### Improve Predictions
1. Use more historical data (minimum 30+ days)
2. Add weather, stress, and sleep quality data
3. Fine-tune neural network epochs and batch size

### Model Retraining
Retrain models weekly or monthly with latest user data:
```bash
python train_models.py
```

## Troubleshooting

### Models not found error
Solution: Run `python train_models.py` to train models

### Poor recommendations
Solution: Collect more user data and retrain models

### ML Service won't start
Solution: Check if port 5001 is available, update `.env` if needed

### Slow predictions
Solution: Reduce model complexity or optimize feature extraction

## Future Enhancements
1. Real-time model updates with new data
2. User preference learning
3. Community workout trends analysis
4. Advanced injury prevention using movement patterns
5. Social recommendations (friend-based)
6. Seasonal fitness adjustments
7. Energy level and mood integration
