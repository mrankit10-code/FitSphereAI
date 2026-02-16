# FitSphereAI ML Service - Complete Startup Guide

## 📋 Overview

The ML Service provides AI-powered features:
- ✅ **Personalized Workout Recommendations** (KNN Collaborative Filtering)
- ✅ **Nutrition Plans** (BMR/TDEE Calculations)
- ✅ **Progress Prediction** (Random Forest Regression)
- ✅ **Fitness Classification** (Random Forest Classifier)
- ✅ **AI Insights** (Rule-based + ML)
- ✅ **Deep Learning** (TensorFlow Neural Network)

## 🚀 Quick Start (5 minutes)

### Windows
```bash
cd ml_service
run.bat
```

### Mac/Linux
```bash
cd ml_service
bash run.sh
```

### Manual Start
```bash
cd ml_service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python train_models.py
python app.py
```

**Expected Output:**
```
 * Running on http://0.0.0.0:5001
 * Press CTRL+C to quit
```

## ✅ Verification

### Test Service Health
```bash
curl http://localhost:5001/api/ml/health
```

**Response:**
```json
{
  "success": true,
  "status": "ML Service is running",
  "timestamp": "2024-01-04T10:30:00"
}
```

## 📊 ML Models Included

| Model | Type | Purpose | Input | Output |
|-------|------|---------|-------|--------|
| Workout KNN | Collaborative Filtering | Recommend workouts | User history | Workout list |
| Nutrition | Rule-based + Math | Generate meal plans | User profile | Nutrition plan |
| Progress RF | Random Forest | Predict weight change | Workout/nutrition data | Weight prediction |
| Fitness Classifier | Random Forest | Assess fitness level | Age, BMI, workouts | Fitness level |
| Progress NN | Neural Network | Deep learning prediction | 10 features | Weight change |

## 🔗 API Quick Reference

### 1. Get Workout Recommendations
```bash
curl -X POST http://localhost:5001/api/ml/workout-recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "user_data": {
      "age": 30,
      "weight": 70,
      "height": 170,
      "fitness_level": "Intermediate",
      "goal": "Weight Loss"
    },
    "user_history": []
  }'
```

### 2. Get Nutrition Plan
```bash
curl -X POST http://localhost:5001/api/ml/nutrition-recommendations \
  -H "Content-Type: application/json" \
  -d '{
    "user_data": {
      "age": 30,
      "weight": 70,
      "height": 170,
      "fitness_level": "Intermediate",
      "goal": "Muscle Gain"
    }
  }'
```

### 3. Predict Progress
```bash
curl -X POST http://localhost:5001/api/ml/progress-prediction \
  -H "Content-Type: application/json" \
  -d '{
    "user_data": {"age": 30, "weight": 70, "goal": "Weight Loss"},
    "user_history": {
      "workout_history": [{"duration": 30, "calories_burned": 300}],
      "nutrition_compliance": 0.85
    }
  }'
```

### 4. Get AI Insights
```bash
curl -X POST http://localhost:5001/api/ml/insights \
  -H "Content-Type: application/json" \
  -d '{
    "user_data": {"goal": "Weight Loss", "fitness_level": "Beginner"},
    "user_history": {"workout_history": []}
  }'
```

## 🔗 Backend Integration

### 1. Add ML Routes
Create `backend/routes/ml.js` (see ML_INTEGRATION_GUIDE.md)

### 2. Register Routes
```javascript
// backend/server.js
const mlRoutes = require('./routes/ml');
app.use('/api/ml', mlRoutes);
```

### 3. Set Environment Variable
```bash
# backend/.env
ML_SERVICE_URL=http://localhost:5001
```

## 🎨 Frontend Integration

### 1. Create Hook
Create `frontend/src/hooks/useMLService.js` (see ML_INTEGRATION_GUIDE.md)

### 2. Use in Components
```javascript
import useMLService from '../hooks/useMLService';

const { getWorkoutRecommendations, getNutritionRecommendations } = useMLService();

// Usage
const workouts = await getWorkoutRecommendations(userData, history);
```

## 📁 File Structure

```
ml_service/
├── app.py                          # Flask API server
├── config.py                       # Configuration
├── ml_models.py                   # ML models & algorithms
├── train_models.py                # Training script
├── requirements.txt               # Python dependencies
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── run.sh                         # Linux/Mac startup
├── run.bat                        # Windows startup
├── README.md                      # ML service docs
└── models/                        # Trained models (created on first run)
    ├── workout_recommendation_model.pkl
    ├── progress_prediction_model.pkl
    ├── progress_neural_network.h5
    ├── fitness_classifier_model.pkl
    └── *_scaler.pkl
```

## 🎯 Full System Architecture

```
┌─────────────────┐
│    Frontend     │ (React)
│   Dashboard     │
└────────┬────────┘
         │ HTTP requests
         │
┌────────▼────────┐
│   Backend API   │ (Node.js/Express)
│  routes/ml.js   │
└────────┬────────┘
         │ axios calls
         │
┌────────▼────────┐
│   ML Service    │ (Flask - Port 5001)
│  /api/ml/*      │
└────────┬────────┘
         │ predictions
         │
┌────────▼────────┐
│   ML Models     │
│  (scikit-learn  │
│  TensorFlow)    │
└─────────────────┘
```

## 🚀 Recommended Setup Order

1. **Start ML Service** (this, port 5001)
   ```bash
   cd ml_service && python app.py
   ```

2. **Start Backend** (new terminal, port 5000)
   ```bash
   cd backend && npm start
   ```

3. **Start Frontend** (new terminal, port 3000)
   ```bash
   cd frontend && npm start
   ```

All three services will be running and connected!

## 📊 Real-World Test

### Step 1: Terminal 1 - Start ML Service
```bash
cd FitSphereAI/ml_service
python app.py
```

### Step 2: Terminal 2 - Start Backend
```bash
cd FitSphereAI/backend
npm start
```

### Step 3: Terminal 3 - Test API
```bash
curl http://localhost:5000/api/ml/workout-recommendations \
  -H "Content-Type: application/json" \
  -d '{...}'
```

### Step 4: Browser - View Frontend
```
http://localhost:3000
```

## 🔧 Configuration

### ML Service Port
Edit `.env`:
```
ML_PORT=5001  # Change to 5002 if 5001 is busy
```

### Debug Mode
```
FLASK_ENV=development  # Enables debug logging
```

### Database
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fitsphereaai
```

## 📈 Model Training

### Initial Training (Automatic)
Runs on first startup with sample data:
```bash
python train_models.py
```

### Retrain with Real Data
```python
# In Python
from ml_models import MLModels
from your_database import get_all_users_data

ml = MLModels()

# Get real data from database
users_data = get_all_users_data()
progress_data = get_all_progress_data()

# Train models
ml.train_workout_recommendation_model(users_data)
ml.train_progress_prediction_model(progress_data)
ml.train_fitness_classifier(user_profiles)
```

## 🐛 Troubleshooting

### Service Won't Start
```bash
# Check Python
python --version

# Check port
netstat -an | grep 5001  # Linux/Mac
netstat -ano | findstr :5001  # Windows

# Kill existing process
lsof -ti:5001 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :5001 | findstr LISTENING  # Windows
```

### Models Not Found
```bash
python train_models.py
```

### Import Errors
```bash
pip install -r requirements.txt --force-reinstall
```

### Slow Responses
- Reduce model complexity
- Limit training data
- Upgrade hardware

## 📝 Next Steps

1. ✅ **Now**: Start ML service
2. ⬜ **Next**: Integrate with backend
3. ⬜ **Then**: Connect frontend
4. ⬜ **Finally**: Collect real data and retrain

## 📞 Support

For issues:
1. Check logs for errors
2. Verify all services running
3. Test health endpoint
4. Review ML_INTEGRATION_GUIDE.md
5. Check README.md for API docs

## 🎓 Learning Path

1. **Basic**: Use default models (you are here ✅)
2. **Intermediate**: Retrain with custom data
3. **Advanced**: Create new models and features
4. **Expert**: Deploy to production with monitoring

---

**ML Service is ready to use! 🚀**
