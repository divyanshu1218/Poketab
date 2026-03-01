from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = "password"  # Default for development
    DB_NAME: str = "poketab"
    
    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"  # Default for development
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Gemini API
    GEMINI_API_KEY: str = ""  # Optional, can be empty
    
    # Redis
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    
    # API
    API_V1_PREFIX: str = "/api/v1"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:5173,https://pokedex1218.netlify.app,https://poketab1218.netlify.app,http://127.0.0.1:3000,http://127.0.0.1:5173"
    
    # Rate Limiting
    RATE_LIMIT_SCAN: str = "10/minute"
    RATE_LIMIT_AUTH: str = "5/minute"
    
    @property
    def DATABASE_URL(self):
        """Construct database URL using SQLAlchemy URL object"""
        # Using SQLite as fallback since MySQL is not available
        from sqlalchemy.engine import make_url
        return make_url("sqlite+aiosqlite:///./poketab.db")
    
    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        """Parse CORS origins into list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)


settings = Settings()
