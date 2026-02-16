#!/usr/bin/env python3
"""
Test script for FitSphereAI ML Service
Tests all endpoints and validates responses
"""

import requests
import json
import sys
from datetime import datetime

# ML Service URL
ML_SERVICE_URL = "http://localhost:5001"

class MLServiceTester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.results = []
        self.passed = 0
        self.failed = 0
    
    def test_health_check(self):
        """Test service health check"""
        print("\n" + "="*50)
        print("TEST: Health Check")
        print("="*50)
        try:
            response = requests.get(f"{self.base_url}/api/ml/health", timeout=5)
            assert response.status_code == 200
            data = response.json()
            assert data['success'] == True
            print("✅ PASSED: Service is running")
            self.passed += 1
            return True
        except Exception as e:
            print(f"❌ FAILED: {str(e)}")
            self.failed += 1
            return False
    
    def test_workout_recommendations(self):
        """Test workout recommendations endpoint"""
        print("\n" + "="*50)
        print("TEST: Workout Recommendations")
        print("="*50)
        try:
            payload = {
                "user_data": {
                    "age": 30,
                    "weight": 70,
                    "height": 170,
                    "fitness_level": "Intermediate",
                    "goal": "Weight Loss",
                    "bmi": 24.2
                },
                "user_history": [
                    {"type": "Cardio", "duration": 30, "calories_burned": 300},
                    {"type": "Strength", "duration": 45, "calories_burned": 350}
                ]
            }
            
            response = requests.post(
                f"{self.base_url}/api/ml/workout-recommendations",
                json=payload,
                timeout=10
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data['success'] == True
            assert 'recommendations' in data
            assert len(data['recommendations']) > 0
            
            print(f"✅ PASSED: Got {len(data['recommendations'])} recommendations")
            print(f"   Sample: {data['recommendations'][0]['name']}")
            self.passed += 1
            return True
        except Exception as e:
            print(f"❌ FAILED: {str(e)}")
            self.failed += 1
            return False
    
    def test_nutrition_recommendations(self):
        """Test nutrition recommendations endpoint"""
        print("\n" + "="*50)
        print("TEST: Nutrition Recommendations")
        print("="*50)
        try:
            payload = {
                "user_data": {
                    "age": 30,
                    "weight": 70,
                    "height": 170,
                    "fitness_level": "Intermediate",
                    "goal": "Muscle Gain"
                }
            }
            
            response = requests.post(
                f"{self.base_url}/api/ml/nutrition-recommendations",
                json=payload,
                timeout=10
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data['success'] == True
            assert 'recommendations' in data
            assert len(data['recommendations']) > 0
            
            rec = data['recommendations'][0]
            print(f"✅ PASSED: Got {len(data['recommendations'])} nutrition plans")
            print(f"   Type: {rec['type']}")
            print(f"   Daily Calories: {rec['daily_calories']}")
            print(f"   Protein: {rec['protein_grams']}g")
            self.passed += 1
            return True
        except Exception as e:
            print(f"❌ FAILED: {str(e)}")
            self.failed += 1
            return False
    
    def test_progress_prediction(self):
        """Test progress prediction endpoint"""
        print("\n" + "="*50)
        print("TEST: Progress Prediction")
        print("="*50)
        try:
            payload = {
                "user_data": {
                    "age": 30,
                    "weight": 70,
                    "goal": "Weight Loss"
                },
                "user_history": {
                    "workout_history": [
                        {"duration": 30, "calories_burned": 300},
                        {"duration": 45, "calories_burned": 400}
                    ],
                    "nutrition_compliance": 0.85
                }
            }
            
            response = requests.post(
                f"{self.base_url}/api/ml/progress-prediction",
                json=payload,
                timeout=10
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data['success'] == True
            assert 'prediction' in data
            
            pred = data['prediction']
            print(f"✅ PASSED: Got progress prediction")
            print(f"   Weight Change: {pred['predicted_weight_change']} kg")
            print(f"   Direction: {pred['direction']}")
            print(f"   Timeline: {pred['days_ahead']} days")
            self.passed += 1
            return True
        except Exception as e:
            print(f"❌ FAILED: {str(e)}")
            self.failed += 1
            return False
    
    def test_fitness_classification(self):
        """Test fitness level classification endpoint"""
        print("\n" + "="*50)
        print("TEST: Fitness Level Classification")
        print("="*50)
        try:
            payload = {
                "age": 30,
                "bmi": 24,
                "workouts_per_week": 4,
                "avg_duration": 40,
                "max_intensity": 7
            }
            
            response = requests.post(
                f"{self.base_url}/api/ml/classify-fitness-level",
                json=payload,
                timeout=10
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data['success'] == True
            assert 'fitness_level' in data
            assert data['fitness_level'] in ['Beginner', 'Intermediate', 'Advanced', 'Elite']
            
            print(f"✅ PASSED: Classification successful")
            print(f"   Fitness Level: {data['fitness_level']}")
            self.passed += 1
            return True
        except Exception as e:
            print(f"❌ FAILED: {str(e)}")
            self.failed += 1
            return False
    
    def test_insights(self):
        """Test AI insights endpoint"""
        print("\n" + "="*50)
        print("TEST: AI Insights")
        print("="*50)
        try:
            payload = {
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
            
            response = requests.post(
                f"{self.base_url}/api/ml/insights",
                json=payload,
                timeout=10
            )
            
            assert response.status_code == 200
            data = response.json()
            assert data['success'] == True
            assert 'insights' in data
            
            print(f"✅ PASSED: Got {len(data['insights'])} insights")
            for insight in data['insights']:
                print(f"   • [{insight['type']}] {insight['message']}")
            self.passed += 1
            return True
        except Exception as e:
            print(f"❌ FAILED: {str(e)}")
            self.failed += 1
            return False
    
    def run_all_tests(self):
        """Run all tests"""
        print("\n" + "█"*50)
        print("🧪 FitSphereAI ML Service Test Suite")
        print("█"*50)
        print(f"Testing: {self.base_url}")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Run all tests
        self.test_health_check()
        self.test_workout_recommendations()
        self.test_nutrition_recommendations()
        self.test_progress_prediction()
        self.test_fitness_classification()
        self.test_insights()
        
        # Print summary
        self.print_summary()
    
    def print_summary(self):
        """Print test summary"""
        total = self.passed + self.failed
        success_rate = (self.passed / total * 100) if total > 0 else 0
        
        print("\n" + "="*50)
        print("📊 TEST SUMMARY")
        print("="*50)
        print(f"Total Tests: {total}")
        print(f"✅ Passed: {self.passed}")
        print(f"❌ Failed: {self.failed}")
        print(f"Success Rate: {success_rate:.1f}%")
        print("="*50)
        
        if self.failed == 0:
            print("\n🎉 All tests passed! ML Service is working correctly.")
            return 0
        else:
            print(f"\n⚠️  {self.failed} test(s) failed. Check the output above.")
            return 1

def main():
    """Main entry point"""
    print("\n🚀 FitSphereAI ML Service Test Script")
    print(f"Testing URL: {ML_SERVICE_URL}")
    
    # Check if service is reachable
    try:
        response = requests.get(f"{ML_SERVICE_URL}/api/ml/health", timeout=2)
    except Exception as e:
        print(f"\n❌ ERROR: Cannot connect to ML Service")
        print(f"   Make sure the service is running on {ML_SERVICE_URL}")
        print(f"   Error: {str(e)}")
        print("\n💡 Start the service with:")
        print("   cd ml_service")
        print("   python app.py")
        return 1
    
    # Run tests
    tester = MLServiceTester(ML_SERVICE_URL)
    exit_code = tester.run_all_tests()
    
    return exit_code

if __name__ == "__main__":
    sys.exit(main())
