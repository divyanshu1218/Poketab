from google import genai
from google.genai import types
from PIL import Image
import io
from typing import Optional
from app.config import settings

# Configure Gemini API with the new client
client = genai.Client(api_key=settings.GEMINI_API_KEY)


class GeminiService:
    """Service for Pokémon identification using Gemini Vision API"""
    
    def __init__(self):
        self.client = client
        # Use Gemini 2.5 Flash for image analysis
        self.model_id = 'gemini-2.5-flash'
    
    async def identify_pokemon(self, image_bytes: bytes) -> Optional[str]:
        """
        Identify Pokémon from image using Gemini Vision
        
        Args:
            image_bytes: Image file bytes
            
        Returns:
            Pokemon name or None if not identified
        """
        # Create prompt for Gemini
        prompt = """Identify the Pokémon in this image. 
        Return ONLY the Pokémon's name in lowercase, nothing else.
        If you cannot identify a Pokémon or if there is no Pokémon in the image, return 'unknown'.
        Examples of valid responses: 'pikachu', 'charizard', 'mewtwo', 'unknown'
        """
        
        # Generate response using the new API
        response = self.client.models.generate_content(
            model=self.model_id,
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text=prompt),
                        types.Part.from_bytes(
                            data=image_bytes,
                            mime_type="image/jpeg"
                        )
                    ]
                )
            ]
        )
        
        # Extract and clean the response
        pokemon_name = response.text.strip().lower()
        
        # Validate response
        if pokemon_name == 'unknown' or not pokemon_name:
            return None
        
        return pokemon_name


# Singleton instance
gemini_service = GeminiService()
