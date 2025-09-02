# Quick Start Guide - Medical AI Diagnosis Assistant

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- PostgreSQL (v12+)

### 1. Clone and Setup
```bash
git clone <your-repo-url>
cd medical-diagnosis-assistant
```

### 2. Run Setup Script
**Windows:**
```bash
setup.bat
```

**macOS/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Database Setup
```bash
cd backend
python setup_db.py
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
# Activate virtual environment
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux

# Start backend
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### 5. Access the Application
- Open your browser to `http://localhost:5173`
- Sign up for a new account
- Login and start using the medical diagnosis features!

## 🔐 Authentication Features

### What's New
- **User Registration**: Create accounts with email and password
- **Secure Login**: JWT-based authentication
- **Protected Routes**: All features require authentication
- **User Profile**: See your name in the navbar when logged in
- **Logout**: Secure logout functionality

### Database Storage
- User data stored securely in PostgreSQL
- Passwords hashed with bcrypt
- JWT tokens for session management
- Automatic database initialization

## 🏥 Available Features

### Symptom Checker
- Select symptoms from comprehensive list
- Get AI-powered disease predictions
- View confidence scores and descriptions

### Medical Chatbot
- Ask medical questions in natural language
- Get informative responses from AI
- Access medical knowledge base

### Image Analysis
- Upload medical images (X-rays, scans)
- Get AI analysis of the images
- View condition predictions

## 🔧 Troubleshooting

### Database Issues
```bash
# Check PostgreSQL is running
# Windows: Check Services app
# macOS: brew services list
# Linux: sudo systemctl status postgresql

# Reset database
cd backend
python setup_db.py
```

### Backend Issues
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend Issues
```bash
npm install
npm run dev
```

## 📞 Support
- Check the main README.md for detailed documentation
- Review the API endpoints in the backend
- Check browser console for frontend errors

## ⚠️ Important Notes
- This is for educational purposes only
- Always consult healthcare professionals for medical advice
- Change the JWT_SECRET in production
- Use strong passwords in production environments 