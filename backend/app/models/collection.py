from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base


class Collection(Base):
    """Collection model for storing user's Pokémon"""
    __tablename__ = "collections"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    pokemon_name = Column(String(100), nullable=False)
    pokemon_id = Column(Integer, nullable=False)
    
    # Store cached Pokémon data to reduce PokeAPI calls
    pokemon_data = Column(JSON, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to user
    user = relationship("User", back_populates="collections")
