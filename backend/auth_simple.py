import os
import bcrypt
import jwt
from datetime import datetime, timedelta
from flask import request, jsonify
from functools import wraps
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database setup
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:Arnold%40118@localhost:5432/users"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION = 24 * 60 * 60  # 24 hours

DEFAULT_ADMIN_USERNAME = "admin"
DEFAULT_ADMIN_EMAIL = "admin@medical.com"
DEFAULT_ADMIN_PASSWORD = "admin123"  # change in production!

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def init_simple_auth():
    """Initialize DB and default admin"""
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        default_user = db.query(User).filter(User.email == DEFAULT_ADMIN_EMAIL).first()
        if not default_user:
            register_user(DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASSWORD)
            print(f"Default admin created with email: {DEFAULT_ADMIN_EMAIL}")
    finally:
        db.close()

def get_db():
    """Return an open DB session. Caller must close."""
    return SessionLocal()

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_token(user_id, email):
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(seconds=JWT_EXPIRATION),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_token(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"error": "No token provided"}), 401
        if token.startswith("Bearer "):
            token = token[7:]
        payload = verify_token(token)
        if not payload:
            return jsonify({"error": "Invalid or expired token"}), 401
        request.user_id = payload["user_id"]
        request.user_email = payload["email"]
        return f(*args, **kwargs)
    return decorated

def register_user(username, email, password):
    """Register new user"""
    db = get_db()
    try:
        if db.query(User).filter((User.username == username) | (User.email == email)).first():
            return None, "Username or email already exists"
        new_user = User(
            username=username,
            email=email,
            password_hash=hash_password(password)
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user, None
    except Exception as e:
        db.rollback()
        return None, str(e)
    finally:
        db.close()

def authenticate_user(email, password):
    """Authenticate existing user"""
    db = get_db()
    try:
        user = db.query(User).filter(User.email == email).first()
        if not user:
            return None
        if verify_password(password, user.password_hash):
            return user
        return None
    finally:
        db.close()

def get_user_by_id(user_id):
    db = get_db()
    try:
        return db.query(User).filter(User.id == user_id).first()
    finally:
        db.close()
