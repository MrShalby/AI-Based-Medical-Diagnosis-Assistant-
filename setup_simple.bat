@echo off
echo ========================================
echo Medical AI Diagnosis Assistant - Simple Setup
echo ========================================
echo.
echo This setup uses in-memory authentication (no database required)
echo.

echo Checking prerequisites...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo ✓ Node.js is installed
)

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python from https://python.org/
    pause
    exit /b 1
) else (
    echo ✓ Python is installed
)

echo.
echo Installing frontend dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
echo ✓ Frontend dependencies installed

echo.
echo Setting up backend...
cd backend

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing backend dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✓ Backend dependencies installed

echo.
echo Running simple setup...
python setup_simple.py

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Test Users (you can use these to login):
echo   Email: test@example.com
echo   Password: password123
echo.
echo   Email: admin@example.com
echo   Password: admin123
echo.
echo Next steps:
echo 1. Start backend: cd backend && python app.py
echo 2. Start frontend: npm run dev
echo 3. Visit http://localhost:5173
echo 4. Login with the test credentials above
echo.
echo You can also create new accounts through the signup page!
echo.
pause 