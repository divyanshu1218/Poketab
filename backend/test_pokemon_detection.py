"""
Test Gemini Pokemon identification with mockimage.png
"""
from google import genai
from google.genai import types
from app.config import settings
import asyncio

async def test_pokemon_identification():
    """Test Gemini with the Pikachu image"""
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        # Read the image
        with open('mockimage.png', 'rb') as f:
            image_bytes = f.read()
        
        # Create prompt for Pokemon identification
        prompt = """Identify the Pokémon in this image. 
        Return ONLY the Pokémon's name in lowercase, nothing else.
        If you cannot identify a Pokémon or if there is no Pokémon in the image, return 'unknown'.
        Examples of valid responses: 'pikachu', 'charizard', 'mewtwo', 'unknown'
        """
        
        print("Testing Gemini Pokemon identification...")
        print(f"Model: gemini-2.5-flash")
        print(f"Image size: {len(image_bytes)} bytes")
        
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=prompt),
                        types.Part.from_bytes(
                            data=image_bytes,
                            mime_type="image/png"
                        )
                    ]
                )
            ]
        )
        
        pokemon_name = response.text.strip().lower()
        
        print(f"\n✓ SUCCESS!")
        print(f"Identified Pokemon: {pokemon_name}")
        
        return pokemon_name
        
    except Exception as e:
        print(f"\n✗ FAILED!")
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    result = asyncio.run(test_pokemon_identification())
    if result and result != 'unknown':
        print(f"\n🎉 Pokemon detection is working! Detected: {result}")
    else:
        print(f"\n❌ Pokemon detection failed")
