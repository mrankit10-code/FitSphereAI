import os
import sys
import logging
from ml_models import MLModels
import json

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DataGenerator:
    """Generate sample data for model training"""
    
    @staticmethod
    def generate_sample_workouts():
        """Generate sample workout data"""
        workouts = [
            {
                'user_id': 1,
                'workouts': [
                    {'type': 'Cardio', 'duration': 30, 'calories_burned': 300, 'intensity': 'Medium'},
                    {'type': 'Strength', 'duration': 45, 'calories_burned': 350, 'intensity': 'Medium'},
                    {'type': 'HIIT', 'duration': 25, 'calories_burned': 400, 'intensity': 'High'},
                    {'type': 'Cardio', 'duration': 35, 'calories_burned': 320, 'intensity': 'Medium'},
                    {'type': 'Flexibility', 'duration': 20, 'calories_burned': 100, 'intensity': 'Low'},
                ]
            },
            {
                'user_id': 2,
                'workouts': [
                    {'type': 'Strength', 'duration': 60, 'calories_burned': 450, 'intensity': 'High'},
                    {'type': 'Strength', 'duration': 55, 'calories_burned': 420, 'intensity': 'High'},
                    {'type': 'Cardio', 'duration': 20, 'calories_burned': 200, 'intensity': 'Medium'},
                    {'type': 'Strength', 'duration': 50, 'calories_burned': 400, 'intensity': 'High'},
                    {'type': 'Cardio', 'duration': 30, 'calories_burned': 300, 'intensity': 'Medium'},
                ]
            },
            {
                'user_id': 3,
                'workouts': [
                    {'type': 'Cardio', 'duration': 25, 'calories_burned': 250, 'intensity': 'Low'},
                    {'type': 'Flexibility', 'duration': 30, 'calories_burned': 120, 'intensity': 'Low'},
                    {'type': 'Cardio', 'duration': 25, 'calories_burned': 250, 'intensity': 'Low'},
                    {'type': 'Balance', 'duration': 20, 'calories_burned': 80, 'intensity': 'Low'},
                ]
            }
        ]
        return workouts
    
    @staticmethod
    def generate_sample_progress_data():
        """Generate sample historical progress data"""
        progress_data = [
            {
                'days_elapsed': 7,
                'workouts_completed': 4,
                'calories_burned': 1300,
                'nutrition_compliance': 0.8,
                'sleep_hours': 7,
                'water_intake': 2.5,
                'protein_intake': 120,
                'exercise_variety': 3,
                'workout_intensity': 6,
                'rest_days': 1,
                'weight_change': -0.5
            },
            {
                'days_elapsed': 14,
                'workouts_completed': 5,
                'calories_burned': 1650,
                'nutrition_compliance': 0.85,
                'sleep_hours': 7.5,
                'water_intake': 2.8,
                'protein_intake': 130,
                'exercise_variety': 4,
                'workout_intensity': 7,
                'rest_days': 1,
                'weight_change': -1.2
            },
            {
                'days_elapsed': 21,
                'workouts_completed': 5,
                'calories_burned': 1700,
                'nutrition_compliance': 0.9,
                'sleep_hours': 8,
                'water_intake': 3,
                'protein_intake': 140,
                'exercise_variety': 4,
                'workout_intensity': 7,
                'rest_days': 2,
                'weight_change': -1.8
            },
            {
                'days_elapsed': 28,
                'workouts_completed': 6,
                'calories_burned': 1900,
                'nutrition_compliance': 0.88,
                'sleep_hours': 7.5,
                'water_intake': 2.9,
                'protein_intake': 150,
                'exercise_variety': 5,
                'workout_intensity': 8,
                'rest_days': 1,
                'weight_change': -2.5
            }
        ]
        return progress_data
    
    @staticmethod
    def generate_sample_user_profiles():
        """Generate sample user profiles for classification"""
        profiles = [
            {
                'age': 25,
                'bmi': 22,
                'workouts_per_week': 5,
                'average_duration': 50,
                'max_intensity': 8,
                'fitness_level': 'Advanced'
            },
            {
                'age': 30,
                'bmi': 26,
                'workouts_per_week': 3,
                'average_duration': 35,
                'max_intensity': 6,
                'fitness_level': 'Intermediate'
            },
            {
                'age': 35,
                'bmi': 28,
                'workouts_per_week': 2,
                'average_duration': 25,
                'max_intensity': 4,
                'fitness_level': 'Beginner'
            },
            {
                'age': 28,
                'bmi': 23,
                'workouts_per_week': 6,
                'average_duration': 55,
                'max_intensity': 9,
                'fitness_level': 'Advanced'
            },
            {
                'age': 40,
                'bmi': 25,
                'workouts_per_week': 4,
                'average_duration': 40,
                'max_intensity': 7,
                'fitness_level': 'Intermediate'
            }
        ]
        return profiles

def train_all_models():
    """Train all ML models with sample data"""
    logger.info("Starting ML model training...")
    
    ml_models = MLModels()
    data_gen = DataGenerator()
    
    try:
        # Generate sample data
        logger.info("Generating sample data...")
        workouts = data_gen.generate_sample_workouts()
        progress_data = data_gen.generate_sample_progress_data()
        user_profiles = data_gen.generate_sample_user_profiles()
        
        # Train models
        logger.info("Training workout recommendation model...")
        ml_models.train_workout_recommendation_model(workouts)
        
        logger.info("Training progress prediction model...")
        ml_models.train_progress_prediction_model(progress_data)
        
        logger.info("Training progress neural network...")
        ml_models.train_progress_neural_network(progress_data)
        
        logger.info("Training fitness level classifier...")
        ml_models.train_fitness_classifier(user_profiles)
        
        logger.info("All models trained successfully!")
        return True
    except Exception as e:
        logger.error(f"Error training models: {str(e)}")
        return False

if __name__ == '__main__':
    success = train_all_models()
    sys.exit(0 if success else 1)
