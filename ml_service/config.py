import os
from dotenv import load_dotenv

load_dotenv()

# Flask Configuration
FLASK_ENV = os.getenv('FLASK_ENV', 'development')
DEBUG = FLASK_ENV == 'development'
PORT = int(os.getenv('ML_PORT', 5001))

# Database Configuration
DB_HOST = os.getenv('DB_HOST', 'localhost')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASSWORD = os.getenv('DB_PASSWORD', '')
DB_NAME = os.getenv('DB_NAME', 'fitsphereaai')

# ML Model Configuration
MODEL_PATH = os.getenv('MODEL_PATH', './models/')
DATA_PATH = os.getenv('DATA_PATH', './data/')

# Model Parameters
WORKOUT_RECOMMENDATION_MODEL = 'workout_recommendation_model.pkl'
NUTRITION_RECOMMENDATION_MODEL = 'nutrition_recommendation_model.pkl'
PROGRESS_PREDICTION_MODEL = 'progress_prediction_model.pkl'
FITNESS_CLASSIFIER_MODEL = 'fitness_classifier_model.pkl'
PROGRESS_NEURAL_NETWORK = 'progress_neural_network.h5'

# Recommendation Configuration
MIN_WORKOUT_DATA_POINTS = 5
MIN_NUTRITION_DATA_POINTS = 3

# Prediction Configuration
PREDICTION_DAYS_AHEAD = 30  # Forecast 30 days ahead

# Workout Categories
WORKOUT_CATEGORIES = [
    'Cardio',
    'Strength',
    'Flexibility',
    'Balance',
    'Endurance',
    'HIIT'
]

# Fitness Levels
FITNESS_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Elite']

# Nutrition Categories
NUTRITION_CATEGORIES = [
    'High Protein',
    'Balanced',
    'High Carb',
    'Low Fat',
    'Vegetarian',
    'Keto'
]
