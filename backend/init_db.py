"""
Database initialization script
Run this to create the database tables
"""
import asyncio
from app.database import init_db

asyncio.run(init_db())
