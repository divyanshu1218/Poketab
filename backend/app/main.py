from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db
from app.api import auth, pokemon, collection


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

# Configure CORS
print(f"Configuring CORS with origins: {settings.CORS_ORIGINS_LIST}")
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS_LIST,
    allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
