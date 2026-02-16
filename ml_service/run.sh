#!/bin/bash
# Run FitSphereAI ML Service

set -e

echo "================================"
echo "FitSphereAI ML Service Launcher"
echo "================================"

# Change to ml_service directory
cd "$(dirname "$0")"

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "Error: Python is not installed"
    exit 1
fi

# Check if venv exists, create if not
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Train models if they don't exist
if [ ! -d "models" ] || [ -z "$(ls -A models)" ]; then
    echo "Training ML models..."
    python train_models.py
else
    echo "Models found. Skipping training."
fi

# Start Flask server
echo "================================"
echo "Starting ML Service..."
echo "Service running on http://localhost:5001"
echo "================================"
python app.py
