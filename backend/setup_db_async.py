import asyncio
import aiomysql
from app.config import settings

async def setup():
    try:
        print(f"Connecting to MySQL at {settings.DB_HOST}:{settings.DB_PORT} as {settings.DB_USER}...")
        conn = await aiomysql.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD
        )
        cur = await conn.cursor()
        
        print(f"Creating database {settings.DB_NAME} if it doesn't exist...")
        await cur.execute(f"CREATE DATABASE IF NOT EXISTS {settings.DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        
        await cur.execute("SHOW DATABASES")
        dbs = await cur.fetchall()
        print("Available databases:", [db[0] for db in dbs])
        
        await cur.close()
        conn.close()
        print("Database setup complete!")
    except Exception as e:
        print(f"Error during aiomysql setup: {e}")

if __name__ == "__main__":
    asyncio.run(setup())
