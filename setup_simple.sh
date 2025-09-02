#!/bin/bash

echo "========================================"
echo "Medical AI Diagnosis Assistant - Simple Setup"
echo "========================================"
echo
echo "This setup uses in-memory authentication (no database required)"
echo

echo "Checking prerequisites..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
else
    echo "✓ Node.js is installed"
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python from https://python.org/"
    exit 1
else
    echo "✓ Python is installed"
fi

echo
echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install frontend dependencies"
    exit 1
fi
echo "✓ Frontend dependencies installed"

echo
echo "Setting up backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        exit 1
    fi
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing backend dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install backend dependencies"
    exit 1
fi
echo "✓ Backend dependencies installed"

echo
echo "Running simple setup..."
python setup_simple.py

echo
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo
echo "Test Users (you can use these to login):"
echo "  Email: test@example.com"
echo "  Password: password123"
echo
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo
echo "Next steps:"
echo "1. Start backend: cd backend && python app.py"
echo "2. Start frontend: npm run dev"
echo "3. Visit http://localhost:5173"
echo "4. Login with the test credentials above"
echo
echo "You can also create new accounts through the signup page!"
echo 