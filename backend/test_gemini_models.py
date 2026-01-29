"""
Test script to list available Gemini models
"""
import google.generativeai as genai
from app.config import settings

# Configure API
genai.configure(api_key=settings.GEMINI_API_KEY)

print("Available Gemini models:")
print("-" * 50)

try:
    for model in genai.list_models():
        if 'generateContent' in model.supported_generation_methods:
            print(f"✓ {model.name}")
            print(f"  Display Name: {model.display_name}")
            print(f"  Description: {model.description[:100]}...")
            print()
except Exception as e:
    print(f"Error listing models: {e}")
    print("\nTrying alternative approach...")
    
    # Try common model names
    test_models = [
        'gemini-pro',
        'gemini-1.5-pro',
        'gemini-1.5-flash',
        'gemini-pro-vision',
        'models/gemini-pro',
        'models/gemini-1.5-pro',
        'models/gemini-1.5-flash',
    ]
    
    for model_name in test_models:
        try:
            model = genai.GenerativeModel(model_name)
            print(f"✓ {model_name} - Available")
        except Exception as e:
            print(f"✗ {model_name} - {str(e)[:80]}")
