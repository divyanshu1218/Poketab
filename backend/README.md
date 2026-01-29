# PokéTab Backend

Backend API for PokéTab - A Pokémon scanning and collection platform.

## Features

- 🔐 **User Authentication**: JWT-based authentication with secure password hashing
- 🤖 **AI-Powered Scanning**: Gemini Vision API for Pokémon identification
- 📊 **PokeAPI Integration**: Fetch detailed Pokémon information
- 📦 **Personal Collections**: Store up to 15 Pokémon per user
- 🔒 **Security**: Rate limiting, CORS protection, and secure credential storage

## Tech Stack

- **Framework**: FastAPI
- **Database**: MySQL with SQLAlchemy (async)
- **AI**: Google Gemini Vision API
- **Authentication**: JWT with passlib
- **External API**: PokeAPI

## Setup

### Prerequisites

- Python 3.10+
- MySQL 8.0+
- Gemini API Key

### Installation

1. **Install dependencies**:
```bash
cd backend
pip install -r requirements.txt
```

2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env with your credentials
```

3. **Setup MySQL database**:
```sql
CREATE DATABASE poketab;
```

4. **Run the application**:
```bash
python -m app.main
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user info

### Pokémon
- `POST /api/v1/pokemon/scan` - Scan image to identify Pokémon
- `GET /api/v1/pokemon/search/{name}` - Search Pokémon by name

### Collection
- `GET /api/v1/collection` - Get user's collection
- `POST /api/v1/collection` - Add Pokémon to collection
- `DELETE /api/v1/collection/{id}` - Remove from collection
- `GET /api/v1/collection/count` - Get collection count

## Project Structure

```
backend/
├── app/
│   ├── api/              # API routes
│   │   ├── auth.py       # Authentication endpoints
│   │   ├── pokemon.py    # Pokémon scanning endpoints
│   │   └── collection.py # Collection management
│   ├── core/             # Core utilities
│   │   ├── security.py   # JWT & password hashing
│   │   └── dependencies.py # Auth dependencies
│   ├── models/           # Database models
│   │   ├── user.py
│   │   └── collection.py
│   ├── schemas/          # Pydantic schemas
│   │   ├── user.py
│   │   └── pokemon.py
│   ├── services/         # Business logic
│   │   ├── gemini_service.py  # AI identification
│   │   └── pokeapi_service.py # PokeAPI integration
│   ├── config.py         # Configuration
│   ├── database.py       # Database setup
│   └── main.py           # FastAPI app
├── requirements.txt
└── .env.example
```

## Environment Variables

See `.env.example` for all required environment variables.

## Development

### Running in development mode:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Database migrations:
The application uses SQLAlchemy and will auto-create tables on startup.

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Rate limiting on sensitive endpoints
- Environment-based configuration
- SQL injection protection via ORM

## License

MIT
