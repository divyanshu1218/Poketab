import asyncio
from sqlalchemy import select
from app.database import AsyncSessionLocal
from app.models.user import User

async def check_users():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User))
        users = result.scalars().all()
        print('Registered users:')
        for u in users:
            print(f'- Username: {u.username}, Email: {u.email}')

asyncio.run(check_users())
