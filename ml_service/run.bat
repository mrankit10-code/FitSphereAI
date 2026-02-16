@echo off
REM Run FitSphereAI ML Service on Windows

echo.
echo ================================
echo FitSphereAI ML Service Launcher
echo ================================
echo.

REM Change to ml_service directory
cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo Installing dependencies...
pip install -r requirements.txt

REM Train models if they don't exist
if not exist "models" (
    echo Training ML models...
    python train_models.py
) else (
    REM Check if models directory is empty
    dir /b models >nul 2>&1
    if errorlevel 1 (
        echo Training ML models...
        python train_models.py
    ) else (
        echo Models found. Skipping training.
    )
)

REM Start Flask server
echo.
echo ================================
echo Starting ML Service...
echo Service running on http://localhost:5001
echo ================================
echo.

python app.py

pause
