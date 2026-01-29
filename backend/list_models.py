from google import genai
from app.config import settings

try:
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    models = client.models.list()
    print("Available Gemini models:")
    for m in models:
        print(f"  - {m.name}")
        if hasattr(m, 'supported_generation_methods'):
            print(f"    Methods: {m.supported_generation_methods}")
except Exception as e:
    print(f"Error listing models: {e}")
