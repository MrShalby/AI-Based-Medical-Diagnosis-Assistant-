#!/bin/bash

echo "========================================"
echo "Medical AI Diagnosis Assistant Setup"
echo "========================================"
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
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo
echo "Next steps:"
echo "1. Install PostgreSQL if not already installed"
echo "2. Set up database: cd backend && python setup_db.py"
echo "3. Start backend: cd backend && python app.py"
echo "4. Start frontend: npm run dev"
echo "5. Visit http://localhost:5173"
echo
echo "For detailed instructions, see README.md"
echo 