# AI Medical Diagnosis Assistant

A comprehensive AI-powered healthcare analysis system with user authentication, symptom checking, medical chatbot, and image analysis capabilities.

## Features

- 🔐 **User Authentication**: Secure login/signup system with PostgreSQL database
- 🏥 **Symptom Checker**: AI-powered disease prediction based on symptoms
- 💬 **Medical Chatbot**: Interactive AI assistant for medical queries
- 📸 **Image Analysis**: Upload and analyze medical images (X-rays, etc.)
- 🌙 **Dark Mode**: Toggle between light and dark themes
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Lucide React for icons
- React Router for navigation

### Backend
- Flask (Python)
- PostgreSQL for user authentication
- JWT for secure authentication
- bcrypt for password hashing
- scikit-learn for ML models

## Prerequisites

Before running this application, make sure you have:

1. **Node.js** (v16 or higher)
2. **Python** (v3.8 or higher)
3. **PostgreSQL** (v12 or higher)
4. **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd medical-diagnosis-assistant
```

### 2. Database Setup

#### Install PostgreSQL

**Windows:**
- Download from [PostgreSQL official website](https://www.postgresql.org/download/windows/)
- Install with default settings
- Remember the password you set for the `postgres` user

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Configure Database

1. **Set up environment variables** (optional - defaults will be used if not set):

```bash
# Windows (PowerShell)
$env:DB_HOST="localhost"
$env:DB_NAME="medical_auth"
$env:DB_USER="postgres"
$env:DB_PASSWORD="your_postgres_password"
$env:DB_PORT="5432"
$env:JWT_SECRET="your-secret-key-change-in-production"

# macOS/Linux
export DB_HOST=localhost
export DB_NAME=medical_auth
export DB_USER=postgres
export DB_PASSWORD=your_postgres_password
export DB_PORT=5432
export JWT_SECRET=your-secret-key-change-in-production
```

2. **Run the database setup script:**

```bash
cd backend
python setup_db.py
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
python app.py
```

The backend will be running at `http://localhost:5000`

### 4. Frontend Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be running at `http://localhost:5173`

## Usage

### First Time Setup

1. **Start the application** (both backend and frontend)
2. **Visit** `http://localhost:5173`
3. **Sign up** for a new account
4. **Login** with your credentials
5. **Access** the medical diagnosis features

### Features Overview

#### 🔐 Authentication
- **Sign Up**: Create a new account with email and password
- **Login**: Access your account with existing credentials
- **Logout**: Securely log out from your session
- **Protected Routes**: All features require authentication

#### 🏥 Symptom Checker
- Select symptoms from a comprehensive list
- Get AI-powered disease predictions
- View confidence scores and descriptions
- Receive health recommendations

#### 💬 Medical Chatbot
- Ask medical questions in natural language
- Get informative responses from AI
- Access medical knowledge base
- Receive health advice and tips

#### 📸 Image Analysis
- Upload medical images (X-rays, scans, etc.)
- Get AI analysis of the images
- View condition predictions
- Receive medical recommendations

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Authenticate user
- `GET /auth/me` - Get current user info
- `POST /auth/verify` - Verify JWT token

### Medical Features
- `POST /predict` - Get disease predictions from symptoms
- `POST /chat` - Interact with medical chatbot
- `POST /analyze-image` - Analyze medical images
- `GET /health` - Check server health

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_NAME` | `medical_auth` | Database name |
| `DB_USER` | `postgres` | Database username |
| `DB_PASSWORD` | `password` | Database password |
| `DB_PORT` | `5432` | Database port |
| `JWT_SECRET` | `your-secret-key-change-in-production` | JWT secret key |

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: All sensitive features require authentication
- **Input Validation**: Comprehensive validation on all inputs
- **CORS Configuration**: Proper cross-origin resource sharing setup

## Development

### Project Structure

```
project/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── auth.py             # Authentication module
│   ├── setup_db.py         # Database setup script
│   ├── requirements.txt    # Python dependencies
│   └── model files...      # ML model files
├── src/
│   ├── components/         # React components
│   ├── context/           # React contexts
│   ├── services/          # API services
│   └── types/             # TypeScript types
├── package.json           # Node.js dependencies
└── README.md             # This file
```

### Adding New Features

1. **Backend**: Add new routes in `app.py`
2. **Frontend**: Create components in `src/components/`
3. **Authentication**: Use `@require_auth` decorator for protected endpoints
4. **Database**: Add new tables in `auth.py` if needed

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Check database credentials in environment variables
   - Run `python setup_db.py` to initialize database

2. **Frontend Can't Connect to Backend**
   - Ensure backend is running on `http://localhost:5000`
   - Check CORS configuration
   - Verify API endpoints are correct

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify database connection

4. **Model Loading Errors**
   - Ensure all model files are present in `backend/`
   - Run `python train_model.py` if models are missing

### Logs

- **Backend logs**: Check console output when running `python app.py`
- **Frontend logs**: Check browser developer tools console
- **Database logs**: Check PostgreSQL logs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes only. The medical information provided should not be used as a substitute for professional medical advice.

## Disclaimer

This application is for educational and demonstration purposes only. The medical predictions and advice should not be used as a substitute for professional medical consultation. Always consult with qualified healthcare professionals for medical decisions.