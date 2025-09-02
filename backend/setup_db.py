#!/usr/bin/env python3
"""
Database setup script for Medical AI Diagnosis Assistant
This script helps you set up the PostgreSQL database for user authentication.
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    """Create the database if it doesn't exist"""
    # Database configuration
    DB_CONFIG = {
        'host': os.environ.get('DB_HOST', 'localhost'),
        'user': os.environ.get('DB_USER', 'postgres'),
        'password': os.environ.get('DB_PASSWORD', 'password'),
        'port': os.environ.get('DB_PORT', '5432')
    }
    
    database_name = os.environ.get('DB_NAME', 'medical_auth')
    
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(**DB_CONFIG)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (database_name,))
        exists = cursor.fetchone()
        
        if not exists:
            print(f"Creating database '{database_name}'...")
            cursor.execute(f'CREATE DATABASE {database_name}')
            print(f"Database '{database_name}' created successfully!")
        else:
            print(f"Database '{database_name}' already exists.")
        
        cursor.close()
        conn.close()
        
        return True
    except psycopg2.Error as e:
        print(f"Error creating database: {e}")
        return False

def test_connection():
    """Test the database connection"""
    from auth import get_db_connection, init_database
    
    print("Testing database connection...")
    conn = get_db_connection()
    
    if conn:
        print("✓ Database connection successful!")
        conn.close()
        
        print("Initializing database tables...")
        if init_database():
            print("✓ Database tables initialized successfully!")
            return True
        else:
            print("✗ Failed to initialize database tables.")
            return False
    else:
        print("✗ Database connection failed.")
        return False

def main():
    print("=== Medical AI Diagnosis Assistant - Database Setup ===")
    print()
    
    # Check environment variables
    print("Environment Variables:")
    print(f"  DB_HOST: {os.environ.get('DB_HOST', 'localhost (default)')}")
    print(f"  DB_NAME: {os.environ.get('DB_NAME', 'medical_auth (default)')}")
    print(f"  DB_USER: {os.environ.get('DB_USER', 'postgres (default)')}")
    print(f"  DB_PASSWORD: {'*' * len(os.environ.get('DB_PASSWORD', 'password'))} ({os.environ.get('DB_PASSWORD', 'password (default)')})")
    print(f"  DB_PORT: {os.environ.get('DB_PORT', '5432 (default)')}")
    print()
    
    # Create database
    if not create_database():
        print("Failed to create database. Please check your PostgreSQL connection.")
        sys.exit(1)
    
    # Test connection and initialize tables
    if not test_connection():
        print("Failed to initialize database. Please check your configuration.")
        sys.exit(1)
    
    print()
    print("=== Setup Complete ===")
    print("Your database is now ready for the Medical AI Diagnosis Assistant!")
    print()
    print("Next steps:")
    print("1. Start the backend server: python app.py")
    print("2. Start the frontend: npm run dev")
    print("3. Visit http://localhost:5173 to use the application")

if __name__ == "__main__":
    main() 