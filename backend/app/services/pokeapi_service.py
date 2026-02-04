import httpx
from typing import Optional, Dict, Any
from functools import lru_cache

# Import python-certifi-win32 to merge Windows Certificate Store with certifi
# This allows Python to trust certificates that Windows trusts (e.g., corporate proxies)
try:
    import certifi_win32
    # Patch certifi to include Windows Certificate Store (API varies by version)
    if hasattr(certifi_win32, "install"):
        certifi_win32.install()
    elif hasattr(certifi_win32, "wincerts") and hasattr(certifi_win32.wincerts, "install"):
        certifi_win32.wincerts.install()
except Exception:
    # If not installed or API changed, fall back to default certifi
    pass


class PokeAPIService:
    """Service for fetching Pokémon data from PokeAPI"""
    
    BASE_URL = "https://pokeapi.co/api/v2"
    
    def __init__(self):
        # Use proper headers to avoid 403 errors
        headers = {
            'User-Agent': 'PokeTab/1.0 (Python/httpx)'
        }
        # Disable SSL verification for PokeAPI (public API, safe for dev)
        # On Windows, SSL certificate verification can fail even with certifi-win32
        self.client = httpx.AsyncClient(
            timeout=30.0,
            follow_redirects=True,
            headers=headers,
            verify=False  # Disable SSL verification for PokeAPI (public API)
        )
    
    @lru_cache(maxsize=500)
    async def get_pokemon_data_cached(self, pokemon_name: str) -> Optional[Dict[str, Any]]:
        """
        Cached version of get_pokemon_data to reduce API calls
        Note: lru_cache works with hashable arguments
        """
        return await self.get_pokemon_data(pokemon_name)
    
    async def get_pokemon_data(self, pokemon_name: str) -> Optional[Dict[str, Any]]:
        """
        Fetch Pokémon data from PokeAPI
        
        Args:
            pokemon_name: Name of the Pokémon
            
        Returns:
            Dictionary with Pokémon data or None if not found
        """
        try:
            # Clean the pokemon name - replace spaces with hyphens as PokeAPI uses that format
            clean_name = pokemon_name.strip().lower().replace(' ', '-')
            url = f"{self.BASE_URL}/pokemon/{clean_name}"
            print(f"[DEBUG PokeAPI] Fetching from: {url}")
            print(f"[DEBUG PokeAPI] Clean name: '{clean_name}' (from input: '{pokemon_name}')")
            
            response = await self.client.get(url)
            print(f"[DEBUG PokeAPI] Response status: {response.status_code}")
            print(f"[DEBUG PokeAPI] Response URL: {response.url}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"[DEBUG PokeAPI] Successfully received data for {data.get('name')}")
                
                # Parse and structure the data - keep PokeAPI's nested structure
                pokemon_data = {
                    "id": data.get("id"),
                    "name": data.get("name"),
                    "height": data.get("height"),
                    "weight": data.get("weight"),
                    "types": [
                        {
                            "slot": t.get("slot"),
                            "type": {
                                "name": t["type"]["name"],
                                "url": t["type"]["url"]
                            }
                        }
                        for t in data.get("types", [])
                    ],
                    "stats": [
                        {
                            "base_stat": s["base_stat"],
                            "effort": s.get("effort", 0),
                            "stat": {
                                "name": s["stat"]["name"],
                                "url": s["stat"]["url"]
                            }
                        }
                        for s in data.get("stats", [])
                    ],
                    "abilities": [
                        {
                            "ability": {
                                "name": a["ability"]["name"],
                                "url": a["ability"]["url"]
                            },
                            "is_hidden": a.get("is_hidden", False),
                            "slot": a.get("slot", 0)
                        }
                        for a in data.get("abilities", [])
                    ],
                    "sprites": {
                        "front_default": data.get("sprites", {}).get("front_default"),
                        "front_shiny": data.get("sprites", {}).get("front_shiny"),
                        "other": data.get("sprites", {}).get("other")
                    },
                    "species_url": data.get("species", {}).get("url")
                }
                
                print(f"[DEBUG PokeAPI] Successfully fetched Pokemon data: {pokemon_data.get('name')}")
                return pokemon_data
            else:
                print(f"[DEBUG PokeAPI] Error: Got status {response.status_code}")
                print(f"[DEBUG PokeAPI] Response body: {response.text[:500]}")
                return None
                
        except Exception as e:
            print(f"[DEBUG PokeAPI] Exception occurred: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


# Singleton instance
pokeapi_service = PokeAPIService()
