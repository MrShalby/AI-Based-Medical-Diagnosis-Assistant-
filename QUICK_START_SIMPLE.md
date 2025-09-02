# Quick Start Guide - Medical AI Diagnosis Assistant (No Database Required)

## 🚀 Get Started in 3 Minutes (No PostgreSQL Required)

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)

### 1. Run Simple Setup Script
**Windows:**
```bash
setup_simple.bat
```

**macOS/Linux:**
```bash
chmod +x setup_simple.sh
./setup_simple.sh
```

### 2. Start the Application

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

### 3. Access the Application
- Open your browser to `http://localhost:5173`
- Use the test credentials below to login
- Or create a new account through the signup page

## 🔐 Test Login Credentials

### Pre-created Test Users
You can login with these credentials:

**User 1:**
- Email: `test@example.com`
- Password: `password123`

**User 2:**
- Email: `admin@example.com`
- Password: `admin123`

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

## 🔧 How It Works

### In-Memory Authentication
- No database required
- Users stored in memory (resets when server restarts)
- Secure password hashing with bcrypt
- JWT tokens for session management
- You can create new accounts that persist during the session

### Features
- **User Registration**: Create new accounts
- **Secure Login**: JWT-based authentication
- **Protected Routes**: All features require authentication
- **User Profile**: See your name in the navbar when logged in
- **Logout**: Secure logout functionality

## 🔧 Troubleshooting

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

### Login Issues
- Make sure you're using the correct test credentials
- Check that the backend is running on `http://localhost:5000`
- Clear browser localStorage if needed
- Try creating a new account through the signup page

## 📞 Support
- Check browser console for frontend errors
- Check terminal output for backend errors
- The test users are created automatically when the backend starts

## ⚠️ Important Notes
- This is for educational purposes only
- Always consult healthcare professionals for medical advice
- User data is stored in memory and will be lost when the server restarts
- For production use, consider implementing a proper database

## 🔄 Switching to Database Later
When you're ready to use PostgreSQL:
1. Install PostgreSQL
2. Replace `auth_simple.py` with `auth.py` in `app.py`
3. Run `python setup_db.py` to initialize the database
4. Update environment variables for database connection 