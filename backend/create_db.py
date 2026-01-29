from app.config import settings
import mysql.connector

def create_database():
    try:
        # Connect to MySQL without specifying a database
        conn = mysql.connector.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD
        )
        cursor = conn.cursor()
        
        # Create database if it doesn't exist
        print(f"Creating database {settings.DB_NAME} if it doesn't exist...")
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {settings.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        
        print(f"Database {settings.DB_NAME} ready!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error creating database: {e}")
        print("Please ensure MySQL is running and credentials in .env are correct.")

if __name__ == "__main__":
    create_database()
