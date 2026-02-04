from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.core.dependencies import get_current_active_user
from app.services.gemini_service import gemini_service
from app.services.pokeapi_service import pokeapi_service
from app.services.image_processor import image_processor
from app.schemas.pokemon import PokemonResponse

router = APIRouter(prefix="/pokemon", tags=["Pokemon"])


@router.post("/scan", response_model=PokemonResponse)
async def scan_pokemon(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Scan an image to identify a Pokémon
    
    Steps:
    1. Receive image from user
    2. Preprocess image with OpenCV (resize, enhance, denoise)
    3. Use Gemini Vision to identify Pokémon name 
    4. Fetch detailed data from PokeAPI
    5. Return complete Pokémon information
    """
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Read image bytes
    image_bytes = await file.read()
    
    # Step 1: Preprocess image with OpenCV
    try:
        processed_image = image_processor.preprocess_image(image_bytes)
    except Exception as e:
        print(f"Image preprocessing failed, using original: {e}")
        processed_image = image_bytes
    
    # Step 2: Identify Pokémon using Gemini
    pokemon_name = await gemini_service.identify_pokemon(processed_image)
    print(f"[DEBUG SCAN] Gemini identified Pokemon: '{pokemon_name}'")
    print(f"[DEBUG SCAN] Pokemon name length: {len(pokemon_name) if pokemon_name else 'None'}")
    print(f"[DEBUG SCAN] Pokemon name bytes: {pokemon_name.encode() if pokemon_name else 'None'}")
    
    if not pokemon_name:
        print("[DEBUG SCAN] Gemini failed to identify a Pokemon in the image")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Could not identify a Pokémon in the image"
        )
    
    # Step 3: Fetch Pokémon data from PokeAPI
    print(f"[DEBUG SCAN] Fetching PokeAPI data for: '{pokemon_name}'")
    pokemon_data = await pokeapi_service.get_pokemon_data(pokemon_name)
    print(f"[DEBUG SCAN] PokeAPI returned data: {pokemon_data is not None}")
    
    if not pokemon_data:
        print(f"[DEBUG] PokeAPI failed to find Pokemon: {pokemon_name}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pokémon '{pokemon_name}' not found in PokeAPI"
        )
    
    return pokemon_data


@router.get("/search/{pokemon_name}", response_model=PokemonResponse)
async def search_pokemon(
    pokemon_name: str,
    current_user: User = Depends(get_current_active_user)
):
    """
    Search for a Pokémon by name
    """
    
    pokemon_data = await pokeapi_service.get_pokemon_data(pokemon_name)
    
    if not pokemon_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pokémon '{pokemon_name}' not found"
        )
    
    return pokemon_data


@router.get("/test-pokeapi", tags=["Debug"])
async def test_pokeapi():
    """Test endpoint to verify PokeAPI connectivity"""
    import httpx
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get("https://pokeapi.co/api/v2/pokemon/pikachu")
            return {
                "status": response.status_code,
                "url": str(response.url),
                "content_length": len(response.content),
                "success": response.status_code == 200,
                "sample_data": response.json()[:100] if response.status_code == 200 else response.text[:100]
            }
    except Exception as e:
        return {
            "error": str(e),
            "error_type": type(e).__name__
        }
