from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class PokemonScanRequest(BaseModel):
    """Schema for Pokémon scan request (image will be in form data)"""
    pass


class NamedAPIResource(BaseModel):
    """Schema for named API resource"""
    name: str
    url: str


class PokemonType(BaseModel):
    """Schema for Pokémon type"""
    slot: int
    type: NamedAPIResource


class PokemonStat(BaseModel):
    """Schema for Pokémon stat"""
    base_stat: int
    effort: int
    stat: NamedAPIResource


class PokemonAbility(BaseModel):
    """Schema for Pokémon ability"""
    ability: NamedAPIResource
    is_hidden: bool
    slot: int


class PokemonSprites(BaseModel):
    """Schema for Pokémon sprites"""
    front_default: Optional[str] = None
    front_shiny: Optional[str] = None
    other: Optional[Dict[str, Any]] = None


class PokemonResponse(BaseModel):
    """Schema for Pokémon information response"""
    id: int
    name: str
    height: int
    weight: int
    types: List[PokemonType]
    stats: List[PokemonStat]
    abilities: List[PokemonAbility]
    sprites: PokemonSprites
    species_url: Optional[str] = None


class CollectionResponse(BaseModel):
    """Schema for collection item response"""
    id: int
    user_id: int
    pokemon_name: str
    pokemon_id: int
    pokemon_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class CollectionAddRequest(BaseModel):
    """Schema for adding Pokémon to collection"""
    pokemon_name: str
    pokemon_id: int
    pokemon_data: Optional[Dict[str, Any]] = None
