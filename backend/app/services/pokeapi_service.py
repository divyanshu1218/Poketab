import httpx
from typing import Optional, Dict, Any
from functools import lru_cache
import time

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
    """Service for fetching Pokémon data from PokeAPI with caching"""
    
    BASE_URL = "https://pokeapi.co/api/v2"
    CACHE_DURATION = 86400  # 24 hours
    
    def __init__(self):
        # Use proper headers to avoid 403 errors
        headers = {
            'User-Agent': 'PokeTab/1.0 (Python/httpx)',
            'Accept-Encoding': 'gzip, deflate',  # Enable compression
        }
        # Disable SSL verification for PokeAPI (public API, safe for dev)
        # On Windows, SSL certificate verification can fail even with certifi-win32
        self.client = httpx.AsyncClient(
            timeout=10.0,  # Reduce timeout from 30s to 10s
            follow_redirects=True,
            headers=headers,
            verify=False,  # Disable SSL verification for PokeAPI (public API)
            limits=httpx.Limits(max_keepalive_connections=5),  # Connection pooling
        )
        # In-memory cache: {pokemon_name: (data, timestamp)}
        self._cache: Dict[str, tuple] = {}
    
    def _get_from_cache(self, key: str) -> Optional[Dict[str, Any]]:
        """Get from in-memory cache if not expired"""
        if key in self._cache:
            data, timestamp = self._cache[key]
            # Check if cache expired (24 hours)
            if time.time() - timestamp < self.CACHE_DURATION:
                print(f"[CACHE HIT] {key}")
                return data
            else:
                # Remove expired entry
                del self._cache[key]
        return None
    
    def _set_cache(self, key: str, data: Dict[str, Any]):
        """Store in in-memory cache"""
        self._cache[key] = (data, time.time())
        # Limit cache size to 500 entries
        if len(self._cache) > 500:
            # Remove oldest entry
            oldest_key = min(self._cache.keys(), key=lambda k: self._cache[k][1])
            del self._cache[oldest_key]
    
    async def get_pokemon_data(self, pokemon_name: str) -> Optional[Dict[str, Any]]:
        """
        Fetch Pokémon data from PokeAPI with caching
        
        Args:
            pokemon_name: Name of the Pokémon
            
        Returns:
            Dictionary with Pokémon data or None if not found
        """
        try:
            # Clean the pokemon name
            clean_name = pokemon_name.strip().lower().replace(' ', '-')
            
            # Check cache first
            cached_data = self._get_from_cache(clean_name)
            if cached_data:
                return cached_data
            
            # Fetch from PokeAPI
            url = f"{self.BASE_URL}/pokemon/{clean_name}"
            print(f"[API CALL] Fetching from: {url}")
            
            response = await self.client.get(url)
            
            if response.status_code == 200:
                data = response.json()
                
                # Parse and structure the data
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
                
                # Cache the result
                self._set_cache(clean_name, pokemon_data)
                print(f"[SUCCESS] Fetched and cached {pokemon_data.get('name')}")
                return pokemon_data
            else:
                print(f"[ERROR] PokeAPI returned status {response.status_code}")
                return None
                
        except Exception as e:
            print(f"[ERROR] PokeAPI exception: {type(e).__name__}: {e}")
            import traceback
            traceback.print_exc()
            return None
    
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()


# Singleton instance
pokeapi_service = PokeAPIService()
