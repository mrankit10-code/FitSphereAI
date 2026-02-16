import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier
from sklearn.neighbors import NearestNeighbors
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
import joblib
import os
from config import *

class MLModels:
    """Machine Learning Models for FitSphereAI"""
    
    def __init__(self):
        self.model_path = MODEL_PATH
        os.makedirs(self.model_path, exist_ok=True)
        self.scalers = {}
        self.label_encoders = {}
        
    # ============ DATA PREPROCESSING ============
    
    def preprocess_user_data(self, user_data):
        """Preprocess user data for ML models"""
        processed_data = {
            'age': user_data.get('age', 30),
            'weight': user_data.get('weight', 70),
            'height': user_data.get('height', 170),
            'fitness_level': user_data.get('fitness_level', 'Beginner'),
            'goal': user_data.get('goal', 'Weight Loss'),
            'bmi': self.calculate_bmi(user_data.get('weight', 70), user_data.get('height', 170))
        }
        return processed_data
    
    def calculate_bmi(self, weight, height):
        """Calculate BMI"""
        return weight / ((height / 100) ** 2)
    
    def preprocess_workout_history(self, workouts):
        """Preprocess workout history for analysis"""
        if not workouts:
            return pd.DataFrame()
        
        df = pd.DataFrame(workouts)
        df['date'] = pd.to_datetime(df['date'])
        df['duration_minutes'] = df.get('duration', 30)
        df['intensity'] = df.get('intensity', 'Medium')
        df['calories_burned'] = df.get('calories_burned', 200)
        
        return df
    
    def preprocess_nutrition_history(self, nutrition_logs):
        """Preprocess nutrition history for analysis"""
        if not nutrition_logs:
            return pd.DataFrame()
        
        df = pd.DataFrame(nutrition_logs)
        df['date'] = pd.to_datetime(df['date'])
        df['calories'] = df.get('calories', 2000)
        df['protein_grams'] = df.get('protein_grams', 100)
        df['carbs_grams'] = df.get('carbs_grams', 250)
        df['fat_grams'] = df.get('fat_grams', 70)
        
        return df
    
    # ============ WORKOUT RECOMMENDATION ============
    
    def train_workout_recommendation_model(self, users_with_workouts):
        """Train collaborative filtering model for workout recommendations"""
        # Create user-workout matrix
        workout_matrix = []
        user_ids = []
        
        for user in users_with_workouts:
            user_ids.append(user['user_id'])
            # Calculate workout features for each user
            workouts = user.get('workouts', [])
            features = self.extract_workout_features(workouts)
            workout_matrix.append(features)
        
        workout_matrix = np.array(workout_matrix)
        
        # Train KNN for finding similar users
        model = NearestNeighbors(n_neighbors=5, algorithm='ball_tree')
        model.fit(workout_matrix)
        
        joblib.dump(model, os.path.join(self.model_path, WORKOUT_RECOMMENDATION_MODEL))
        joblib.dump(user_ids, os.path.join(self.model_path, 'user_ids.pkl'))
        
        return model
    
    def extract_workout_features(self, workouts):
        """Extract features from workout history"""
        if not workouts:
            return np.zeros(10)
        
        df = self.preprocess_workout_history(workouts)
        
        features = np.array([
            len(workouts),  # Total workouts
            df['duration_minutes'].sum() if len(df) > 0 else 0,  # Total duration
            df['calories_burned'].sum() if len(df) > 0 else 0,  # Total calories
            df['duration_minutes'].mean() if len(df) > 0 else 30,  # Avg duration
            df['calories_burned'].mean() if len(df) > 0 else 200,  # Avg calories
            1 if 'Strength' in df.get('type', []).values else 0,
            1 if 'Cardio' in df.get('type', []).values else 0,
            1 if 'Flexibility' in df.get('type', []).values else 0,
            1 if 'HIIT' in df.get('type', []).values else 0,
            df['duration_minutes'].std() if len(df) > 1 else 0,  # Consistency
        ])
        
        return features
    
    def get_workout_recommendations(self, user_data, user_history):
        """Generate personalized workout recommendations"""
        try:
            model = joblib.load(os.path.join(self.model_path, WORKOUT_RECOMMENDATION_MODEL))
            user_ids = joblib.load(os.path.join(self.model_path, 'user_ids.pkl'))
            
            # Extract features for current user
            user_features = self.extract_workout_features(user_history).reshape(1, -1)
            
            # Find similar users
            distances, indices = model.kneighbors(user_features)
            
            recommendations = self.generate_workout_recommendations_logic(user_data, distances, indices)
            
            return recommendations
        except:
            return self.generate_default_workout_recommendations(user_data)
    
    def generate_workout_recommendations_logic(self, user_data, distances, indices):
        """Generate workout recommendations based on similarity"""
        fitness_level = user_data.get('fitness_level', 'Beginner')
        goal = user_data.get('goal', 'Weight Loss')
        
        recommendations = []
        
        # Beginner recommendations
        if fitness_level == 'Beginner':
            recommendations = [
                {
                    'type': 'Cardio',
                    'name': 'Brisk Walking',
                    'duration': 30,
                    'intensity': 'Low',
                    'description': 'Easy-paced walking to build cardiovascular fitness',
                    'calories_burned': 120,
                    'difficulty': 1
                },
                {
                    'type': 'Strength',
                    'name': 'Bodyweight Training',
                    'duration': 25,
                    'intensity': 'Low-Medium',
                    'description': 'Basic exercises using your body weight',
                    'calories_burned': 150,
                    'difficulty': 1
                },
                {
                    'type': 'Flexibility',
                    'name': 'Beginner Yoga',
                    'duration': 20,
                    'intensity': 'Low',
                    'description': 'Stretching and basic yoga poses',
                    'calories_burned': 80,
                    'difficulty': 1
                }
            ]
        
        # Intermediate recommendations
        elif fitness_level == 'Intermediate':
            recommendations = [
                {
                    'type': 'Cardio',
                    'name': 'Running',
                    'duration': 40,
                    'intensity': 'Medium',
                    'description': 'Steady-state running to improve endurance',
                    'calories_burned': 400,
                    'difficulty': 2
                },
                {
                    'type': 'Strength',
                    'name': 'Weight Training',
                    'duration': 45,
                    'intensity': 'Medium',
                    'description': 'Structured weight lifting program',
                    'calories_burned': 350,
                    'difficulty': 2
                },
                {
                    'type': 'HIIT',
                    'name': 'Interval Training',
                    'duration': 30,
                    'intensity': 'High',
                    'description': 'High-intensity intervals for maximum results',
                    'calories_burned': 350,
                    'difficulty': 3
                }
            ]
        
        # Advanced recommendations
        else:
            recommendations = [
                {
                    'type': 'Strength',
                    'name': 'Advanced Lifting',
                    'duration': 60,
                    'intensity': 'Very High',
                    'description': 'Progressive overload strength training',
                    'calories_burned': 450,
                    'difficulty': 4
                },
                {
                    'type': 'HIIT',
                    'name': 'CrossFit-Style Training',
                    'duration': 45,
                    'intensity': 'Very High',
                    'description': 'Intense functional fitness training',
                    'calories_burned': 500,
                    'difficulty': 4
                },
                {
                    'type': 'Endurance',
                    'name': 'Long-Distance Running',
                    'duration': 90,
                    'intensity': 'Medium-High',
                    'description': 'Building endurance and stamina',
                    'calories_burned': 900,
                    'difficulty': 4
                }
            ]
        
        return recommendations
    
    def generate_default_workout_recommendations(self, user_data):
        """Generate default recommendations when model is not trained"""
        fitness_level = user_data.get('fitness_level', 'Beginner')
        
        if fitness_level == 'Beginner':
            return [
                {'type': 'Cardio', 'name': 'Walking', 'duration': 30, 'intensity': 'Low'},
                {'type': 'Strength', 'name': 'Bodyweight Exercises', 'duration': 25, 'intensity': 'Low'},
                {'type': 'Flexibility', 'name': 'Stretching', 'duration': 20, 'intensity': 'Low'}
            ]
        elif fitness_level == 'Intermediate':
            return [
                {'type': 'Cardio', 'name': 'Running', 'duration': 40, 'intensity': 'Medium'},
                {'type': 'Strength', 'name': 'Weight Training', 'duration': 45, 'intensity': 'Medium'},
                {'type': 'HIIT', 'name': 'Interval Training', 'duration': 30, 'intensity': 'High'}
            ]
        else:
            return [
                {'type': 'Strength', 'name': 'Advanced Lifting', 'duration': 60, 'intensity': 'Very High'},
                {'type': 'HIIT', 'name': 'CrossFit Training', 'duration': 45, 'intensity': 'Very High'},
                {'type': 'Endurance', 'name': 'Long-Distance Running', 'duration': 90, 'intensity': 'Medium-High'}
            ]
    
    # ============ NUTRITION RECOMMENDATION ============
    
    def get_nutrition_recommendations(self, user_data):
        """Generate personalized nutrition recommendations"""
        bmi = user_data.get('bmi', 24)
        goal = user_data.get('goal', 'Weight Loss')
        fitness_level = user_data.get('fitness_level', 'Beginner')
        weight = user_data.get('weight', 70)
        
        # Calculate daily caloric needs
        bmr = self.calculate_bmr(weight, user_data.get('height', 170), user_data.get('age', 30))
        tdee = bmr * self.get_activity_multiplier(fitness_level)
        
        recommendations = []
        
        # Goal-based recommendations
        if goal == 'Weight Loss':
            daily_calories = int(tdee * 0.85)  # 15% deficit
            recommendations = [
                {
                    'type': 'High Protein',
                    'daily_calories': daily_calories,
                    'protein_grams': int(weight * 2.2),  # 2.2g per kg
                    'carbs_grams': int(daily_calories * 0.40 / 4),
                    'fat_grams': int(daily_calories * 0.30 / 9),
                    'description': 'High protein to preserve muscle during weight loss'
                },
                {
                    'type': 'Balanced',
                    'daily_calories': daily_calories,
                    'protein_grams': int(weight * 1.8),
                    'carbs_grams': int(daily_calories * 0.45 / 4),
                    'fat_grams': int(daily_calories * 0.25 / 9),
                    'description': 'Balanced macros for sustainable weight loss'
                }
            ]
        
        elif goal == 'Muscle Gain':
            daily_calories = int(tdee * 1.1)  # 10% surplus
            recommendations = [
                {
                    'type': 'High Protein',
                    'daily_calories': daily_calories,
                    'protein_grams': int(weight * 2.5),  # 2.5g per kg
                    'carbs_grams': int(daily_calories * 0.45 / 4),
                    'fat_grams': int(daily_calories * 0.25 / 9),
                    'description': 'High protein caloric surplus for muscle growth'
                },
                {
                    'type': 'High Carb',
                    'daily_calories': daily_calories,
                    'protein_grams': int(weight * 2.2),
                    'carbs_grams': int(daily_calories * 0.50 / 4),
                    'fat_grams': int(daily_calories * 0.20 / 9),
                    'description': 'High carbs for energy and muscle synthesis'
                }
            ]
        
        else:  # Maintenance
            recommendations = [
                {
                    'type': 'Balanced',
                    'daily_calories': int(tdee),
                    'protein_grams': int(weight * 1.6),
                    'carbs_grams': int(tdee * 0.45 / 4),
                    'fat_grams': int(tdee * 0.35 / 9),
                    'description': 'Balanced diet for fitness maintenance'
                }
            ]
        
        return recommendations
    
    def calculate_bmr(self, weight, height, age):
        """Calculate Basal Metabolic Rate (Mifflin-St Jeor equation)"""
        # Simplified calculation (assuming average male)
        return 10 * weight + 6.25 * height - 5 * age + 5
    
    def get_activity_multiplier(self, fitness_level):
        """Get activity multiplier based on fitness level"""
        multipliers = {
            'Beginner': 1.375,  # Light exercise 3 days/week
            'Intermediate': 1.55,  # Moderate exercise 3-5 days/week
            'Advanced': 1.725,  # Heavy exercise 6-7 days/week
            'Elite': 1.9  # Very heavy/athlete
        }
        return multipliers.get(fitness_level, 1.55)
    
    # ============ PROGRESS PREDICTION ============
    
    def train_progress_prediction_model(self, historical_data):
        """Train regression model for progress prediction"""
        if not historical_data or len(historical_data) < 5:
            return None
        
        df = pd.DataFrame(historical_data)
        
        # Prepare features and target
        X = df[['days_elapsed', 'workouts_completed', 'calories_burned', 'nutrition_compliance']].values
        y = df['weight_change'].values
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train Random Forest Regressor
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        joblib.dump(model, os.path.join(self.model_path, PROGRESS_PREDICTION_MODEL))
        joblib.dump(scaler, os.path.join(self.model_path, 'progress_scaler.pkl'))
        
        return model
    
    def predict_progress(self, user_data, user_history):
        """Predict future progress"""
        try:
            model = joblib.load(os.path.join(self.model_path, PROGRESS_PREDICTION_MODEL))
            scaler = joblib.load(os.path.join(self.model_path, 'progress_scaler.pkl'))
            
            # Extract features
            days = len(user_history.get('workout_history', []))
            workouts = len(user_history.get('workout_history', []))
            calories = sum([w.get('calories_burned', 200) for w in user_history.get('workout_history', [])])
            compliance = user_history.get('nutrition_compliance', 0.7)
            
            X = np.array([[days, workouts, calories, compliance]])
            X_scaled = scaler.transform(X)
            
            prediction = model.predict(X_scaled)[0]
            
            return {
                'predicted_weight_change': float(prediction),
                'direction': 'Loss' if prediction < 0 else 'Gain',
                'days_ahead': PREDICTION_DAYS_AHEAD
            }
        except:
            return {'predicted_weight_change': 0, 'direction': 'Stable', 'days_ahead': PREDICTION_DAYS_AHEAD}
    
    # ============ FITNESS LEVEL CLASSIFICATION ============
    
    def train_fitness_classifier(self, user_profiles):
        """Train classifier for fitness level prediction"""
        if not user_profiles or len(user_profiles) < 5:
            return None
        
        df = pd.DataFrame(user_profiles)
        
        # Prepare features
        X = df[['age', 'bmi', 'workouts_per_week', 'average_duration', 'max_intensity']].values
        y = df['fitness_level'].values
        
        # Encode labels
        le = LabelEncoder()
        y_encoded = le.fit_transform(y)
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Train classifier
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_scaled, y_encoded)
        
        joblib.dump(model, os.path.join(self.model_path, FITNESS_CLASSIFIER_MODEL))
        joblib.dump(le, os.path.join(self.model_path, 'fitness_label_encoder.pkl'))
        joblib.dump(scaler, os.path.join(self.model_path, 'fitness_scaler.pkl'))
        
        return model
    
    def classify_fitness_level(self, age, bmi, workouts_per_week, avg_duration, max_intensity):
        """Classify fitness level based on user metrics"""
        try:
            model = joblib.load(os.path.join(self.model_path, FITNESS_CLASSIFIER_MODEL))
            le = joblib.load(os.path.join(self.model_path, 'fitness_label_encoder.pkl'))
            scaler = joblib.load(os.path.join(self.model_path, 'fitness_scaler.pkl'))
            
            X = np.array([[age, bmi, workouts_per_week, avg_duration, max_intensity]])
            X_scaled = scaler.transform(X)
            
            prediction = model.predict(X_scaled)[0]
            
            return le.inverse_transform([prediction])[0]
        except:
            # Default classification logic
            if workouts_per_week >= 5 and avg_duration >= 45:
                return 'Advanced'
            elif workouts_per_week >= 3 and avg_duration >= 30:
                return 'Intermediate'
            else:
                return 'Beginner'
    
    # ============ NEURAL NETWORK FOR PROGRESS ============
    
    def build_progress_neural_network(self):
        """Build neural network for progress prediction"""
        model = Sequential([
            Dense(128, activation='relu', input_shape=(10,)),
            Dropout(0.2),
            Dense(64, activation='relu'),
            Dropout(0.2),
            Dense(32, activation='relu'),
            Dropout(0.1),
            Dense(16, activation='relu'),
            Dense(1)  # Output: weight change prediction
        ])
        
        model.compile(
            optimizer=Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae']
        )
        
        return model
    
    def train_progress_neural_network(self, historical_data):
        """Train neural network on historical data"""
        if not historical_data or len(historical_data) < 10:
            return None
        
        df = pd.DataFrame(historical_data)
        
        # Prepare features (expanded)
        feature_cols = ['days_elapsed', 'workouts_completed', 'calories_burned', 
                       'nutrition_compliance', 'sleep_hours', 'water_intake',
                       'protein_intake', 'exercise_variety', 'workout_intensity', 'rest_days']
        
        X = df[feature_cols].values
        y = df['weight_change'].values
        
        # Scale features
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        # Build and train model
        model = self.build_progress_neural_network()
        model.fit(X_scaled, y, epochs=50, batch_size=16, validation_split=0.2, verbose=0)
        
        model.save(os.path.join(self.model_path, PROGRESS_NEURAL_NETWORK))
        joblib.dump(scaler, os.path.join(self.model_path, 'nn_scaler.pkl'))
        
        return model
    
    def get_insights(self, user_data, user_history):
        """Generate AI insights for user"""
        insights = []
        
        # Workout consistency insight
        workouts = user_history.get('workout_history', [])
        if len(workouts) > 0:
            workouts_per_week = len(workouts) / 4  # Approximate
            if workouts_per_week >= 5:
                insights.append({
                    'type': 'positive',
                    'message': f'Great consistency! You\'re averaging {workouts_per_week:.1f} workouts per week.'
                })
            elif workouts_per_week >= 3:
                insights.append({
                    'type': 'good',
                    'message': f'Good effort! Aim for 5+ workouts per week for faster progress.'
                })
            else:
                insights.append({
                    'type': 'suggestion',
                    'message': 'Try to increase your workout frequency to 3-5 times per week.'
                })
        
        # Nutrition insight
        nutrition = user_history.get('nutrition_history', [])
        if nutrition:
            insights.append({
                'type': 'info',
                'message': 'Nutrition tracking is key! Continue logging your meals.'
            })
        
        # Progress insight
        if user_data.get('goal') == 'Weight Loss':
            insights.append({
                'type': 'tip',
                'message': 'Combine cardio with strength training for optimal weight loss results.'
            })
        
        return insights
