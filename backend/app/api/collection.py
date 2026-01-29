from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import List
from app.database import get_db
from app.models.user import User
from app.models.collection import Collection
from app.core.dependencies import get_current_active_user
from app.schemas.pokemon import CollectionResponse, CollectionAddRequest

router = APIRouter(prefix="/collection", tags=["Collection"])

MAX_COLLECTION_SIZE = 15


@router.get("/", response_model=List[CollectionResponse])
async def get_collection(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get user's Pokémon collection"""
    
    result = await db.execute(
        select(Collection)
        .where(Collection.user_id == current_user.id)
        .order_by(Collection.created_at.desc())
    )
    collections = result.scalars().all()
    
    return collections


@router.post("/", response_model=CollectionResponse, status_code=status.HTTP_201_CREATED)
async def add_to_collection(
    pokemon: CollectionAddRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Add a Pokémon to user's collection"""
    
    # Check collection size limit
    result = await db.execute(
        select(func.count(Collection.id))
        .where(Collection.user_id == current_user.id)
    )
    collection_count = result.scalar()
    
    if collection_count >= MAX_COLLECTION_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Collection is full. Maximum {MAX_COLLECTION_SIZE} Pokémon allowed."
        )
    
    # Check if Pokémon already in collection
    result = await db.execute(
        select(Collection)
        .where(
            Collection.user_id == current_user.id,
            Collection.pokemon_name == pokemon.pokemon_name
        )
    )
    existing = result.scalar_one_or_none()
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This Pokémon is already in your collection"
        )
    
    # Add to collection
    new_collection_item = Collection(
        user_id=current_user.id,
        pokemon_name=pokemon.pokemon_name,
        pokemon_id=pokemon.pokemon_id,
        pokemon_data=pokemon.pokemon_data
    )
    
    db.add(new_collection_item)
    await db.commit()
    await db.refresh(new_collection_item)
    
    return new_collection_item


@router.delete("/{collection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_from_collection(
    collection_id: int,
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Remove a Pokémon from user's collection"""
    
    # Find collection item
    result = await db.execute(
        select(Collection)
        .where(
            Collection.id == collection_id,
            Collection.user_id == current_user.id
        )
    )
    collection_item = result.scalar_one_or_none()
    
    if not collection_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Collection item not found"
        )
    
    await db.delete(collection_item)
    await db.commit()
    
    return None


@router.get("/count")
async def get_collection_count(
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """Get count of Pokémon in user's collection"""
    
    result = await db.execute(
        select(func.count(Collection.id))
        .where(Collection.user_id == current_user.id)
    )
    count = result.scalar()
    
    return {
        "count": count,
        "max": MAX_COLLECTION_SIZE,
        "remaining": MAX_COLLECTION_SIZE - count
    }
