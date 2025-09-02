#!/usr/bin/env python3
"""
Simple setup script for Medical AI Diagnosis Assistant (No PostgreSQL Required)
This script sets up the application with in-memory authentication for testing.
"""

import os
import sys

def main():
    print("=== Medical AI Diagnosis Assistant - Simple Setup ===")
    print()
    print("This setup uses in-memory authentication (no database required)")
    print()
    
    # Check if required Python packages are available
    try:
        import flask
        import bcrypt
        import jwt
        print("✓ All required packages are available")
    except ImportError as e:
        print(f"✗ Missing package: {e}")
        print("Please run: pip install -r requirements.txt")
        sys.exit(1)
    
    print()
    print("=== Setup Complete! ===")
    print("Your application is ready to run!")
    print()
    print("Test Users (you can use these to login):")
    print("  Email: test@example.com")
    print("  Password: password123")
    print()
    print("  Email: admin@example.com")
    print("  Password: admin123")
    print()
    print("Next steps:")
    print("1. Start the backend server: python app.py")
    print("2. Start the frontend: npm run dev")
    print("3. Visit http://localhost:5173")
    print("4. Login with the test credentials above")
    print()
    print("You can also create new accounts through the signup page!")

if __name__ == "__main__":
    main() 