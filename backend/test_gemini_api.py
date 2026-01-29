"""
Test script to verify Gemini model works with image input
"""
from google import genai
from google.genai import types
from app.config import settings
import asyncio

async def test_gemini_with_text():
    """Test Gemini with text-only input"""
    try:
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
        
        response = client.models.generate_content(
            model='gemini-2.5-flash-preview-0827',
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_text(text="What Pokemon is Pikachu? Just say the name.")
                    ]
                )
            ]
        )
        
        print("✓ Text test successful!")
        print(f"Response: {response.text}")
        return True
    except Exception as e:
        print(f"✗ Text test failed: {e}")
        return False

if __name__ == "__main__":
    asyncio.run(test_gemini_with_text())
