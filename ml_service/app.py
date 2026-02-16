from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from ml_models import MLModels
import logging

load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize ML Models
ml_models = MLModels()

# Logging configuration
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============ WORKOUT RECOMMENDATIONS ============

@app.route('/api/ml/workout-recommendations', methods=['POST'])
def get_workout_recommendations():
    """Get personalized workout recommendations"""
    try:
        data = request.json
        user_data = data.get('user_data', {})
        user_history = data.get('user_history', [])
        
        recommendations = ml_models.get_workout_recommendations(user_data, user_history)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        }), 200
    except Exception as e:
        logger.error(f"Error generating workout recommendations: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ============ NUTRITION RECOMMENDATIONS ============

@app.route('/api/ml/nutrition-recommendations', methods=['POST'])
def get_nutrition_recommendations():
    """Get personalized nutrition recommendations"""
    try:
        data = request.json
        user_data = data.get('user_data', {})
        
        # Preprocess user data
        processed_data = ml_models.preprocess_user_data(user_data)
        
        recommendations = ml_models.get_nutrition_recommendations(processed_data)
        
        return jsonify({
            'success': True,
            'recommendations': recommendations
        }), 200
    except Exception as e:
        logger.error(f"Error generating nutrition recommendations: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ============ PROGRESS PREDICTION ============

@app.route('/api/ml/progress-prediction', methods=['POST'])
def predict_progress():
    """Predict user progress"""
    try:
        data = request.json
        user_data = data.get('user_data', {})
        user_history = data.get('user_history', {})
        
        prediction = ml_models.predict_progress(user_data, user_history)
        
        return jsonify({
            'success': True,
            'prediction': prediction
        }), 200
    except Exception as e:
        logger.error(f"Error predicting progress: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ============ FITNESS LEVEL CLASSIFICATION ============

@app.route('/api/ml/classify-fitness-level', methods=['POST'])
def classify_fitness_level():
    """Classify user's fitness level"""
    try:
        data = request.json
        
        fitness_level = ml_models.classify_fitness_level(
            age=data.get('age', 30),
            bmi=data.get('bmi', 24),
            workouts_per_week=data.get('workouts_per_week', 3),
            avg_duration=data.get('avg_duration', 30),
            max_intensity=data.get('max_intensity', 5)
        )
        
        return jsonify({
            'success': True,
            'fitness_level': fitness_level
        }), 200
    except Exception as e:
        logger.error(f"Error classifying fitness level: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ============ AI INSIGHTS ============

@app.route('/api/ml/insights', methods=['POST'])
def get_insights():
    """Get AI-powered insights for user"""
    try:
        data = request.json
        user_data = data.get('user_data', {})
        user_history = data.get('user_history', {})
        
        insights = ml_models.get_insights(user_data, user_history)
        
        return jsonify({
            'success': True,
            'insights': insights
        }), 200
    except Exception as e:
        logger.error(f"Error generating insights: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ============ MODEL TRAINING ============

@app.route('/api/ml/train-models', methods=['POST'])
def train_models():
    """Train all ML models"""
    try:
        data = request.json
        
        # Train workout recommendation model
        workout_data = data.get('users_with_workouts', [])
        if workout_data:
            ml_models.train_workout_recommendation_model(workout_data)
        
        # Train progress prediction model
        progress_data = data.get('historical_progress_data', [])
        if progress_data:
            ml_models.train_progress_prediction_model(progress_data)
            ml_models.train_progress_neural_network(progress_data)
        
        # Train fitness classifier
        user_profiles = data.get('user_profiles', [])
        if user_profiles:
            ml_models.train_fitness_classifier(user_profiles)
        
        return jsonify({
            'success': True,
            'message': 'Models trained successfully'
        }), 200
    except Exception as e:
        logger.error(f"Error training models: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# ============ HEALTH CHECK ============

@app.route('/api/ml/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'success': True,
        'status': 'ML Service is running',
        'timestamp': __import__('datetime').datetime.now().isoformat()
    }), 200

# ============ ERROR HANDLERS ============

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    port = os.getenv('ML_PORT', 5001)
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=int(port), debug=debug)
