from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.middleware.gzip import GZipMiddleware
from starlette.responses import JSONResponse
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db
from app.api import auth, pokemon, collection
import logging

logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for startup and shutdown"""
    # Startup
    print("Starting up...")
    await init_db()
    print("Database initialized")
    yield
    # Shutdown
    print("Shutting down...")


# Create FastAPI app
app = FastAPI(
    title="PokéTab API",
    description="Backend API for PokéTab - Pokémon Scanning and Collection Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Add GZIP compression middleware FIRST (before other middleware)
# This compresses responses to reduce bandwidth by ~70%
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Configure CORS
print(f"Configuring CORS with origins: {settings.CORS_ORIGINS_LIST}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_origin_regex=r"^(https?://)(localhost|127\.0\.0\.1|poketab1218\.netlify\.app|pokedex1218\.netlify\.app)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Authorization"],
    max_age=3600,
)

# Include routers
app.include_router(auth.router, prefix=settings.API_V1_PREFIX)
app.include_router(pokemon.router, prefix=settings.API_V1_PREFIX)
app.include_router(collection.router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Welcome to PokéTab API",
        "version": "1.0.0",
        "docs": f"{settings.API_V1_PREFIX}/docs",
        "notice": "⚠️  API routes require '/api/v1' prefix. Example: POST /api/v1/auth/login",
        "available_endpoints": {
            "auth": f"{settings.API_V1_PREFIX}/auth/register, {settings.API_V1_PREFIX}/auth/login",
            "pokemon": f"{settings.API_V1_PREFIX}/pokemon/scan",
            "collection": f"{settings.API_V1_PREFIX}/collection"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint - responds immediately without DB"""
    return {
        "status": "healthy",
        "service": "poketab-api",
        "version": "1.0.0"
    }


@app.get("/__whoami")
async def whoami():
    """Debug endpoint to confirm the running server and config."""
    try:
        import bcrypt
        bcrypt_version = getattr(bcrypt, "__version__", "unknown")
    except Exception:
        bcrypt_version = "unavailable"
    try:
        import passlib
        passlib_version = getattr(passlib, "__version__", "unknown")
    except Exception:
        passlib_version = "unavailable"
    return {
        "app": "poketab-backend",
        "api_prefix": settings.API_V1_PREFIX,
        "cors_origins": settings.CORS_ORIGINS_LIST,
        "bcrypt_version": bcrypt_version,
        "passlib_version": passlib_version,
    }
async def whoami():
    """Debug endpoint to confirm the running server and config."""
    try:
        import bcrypt
        bcrypt_version = getattr(bcrypt, "__version__", "unknown")
    except Exception:
        bcrypt_version = "unavailable"
    try:
        import passlib
        passlib_version = getattr(passlib, "__version__", "unknown")
    except Exception:
        passlib_version = "unavailable"
    return {
        "app": "poketab-backend",
        "api_prefix": settings.API_V1_PREFIX,
        "cors_origins": settings.CORS_ORIGINS_LIST,
        "bcrypt_version": bcrypt_version,
        "passlib_version": passlib_version,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
