# PokéTab Backend - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
# Windows
setup.bat

# Linux/Mac
chmod +x setup.sh
./setup.sh
```

### Step 2: Configure Environment
Edit `.env` file with your credentials:
```env
# Database
DB_PASSWORD=your_mysql_password
DB_NAME=poketab

# JWT Secret (generate a secure random string)
SECRET_KEY=your-super-secret-key-here

# Gemini API Key (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key
```

### Step 3: Setup MySQL Database
```sql
CREATE DATABASE poketab CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### Step 4: Initialize Database Tables
```bash
python init_db.py
```

### Step 5: Run the Server
```bash
python -m app.main
```

Visit `http://localhost:8000/docs` to see the API documentation!

---

## 📋 API Endpoints Overview

### Authentication
- **POST** `/api/v1/auth/register` - Create new account
- **POST** `/api/v1/auth/login` - Login and get JWT tokens
- **GET** `/api/v1/auth/me` - Get current user info (requires auth)

### Pokémon Scanning
- **POST** `/api/v1/pokemon/scan` - Upload image to identify Pokémon (requires auth)
- **GET** `/api/v1/pokemon/search/{name}` - Search Pokémon by name (requires auth)

### Collection Management
- **GET** `/api/v1/collection` - Get your Pokémon collection (requires auth)
- **POST** `/api/v1/collection` - Add Pokémon to collection (requires auth)
- **DELETE** `/api/v1/collection/{id}` - Remove Pokémon (requires auth)
- **GET** `/api/v1/collection/count` - Get collection stats (requires auth)

---

## 🧪 Testing the API

### 1. Register a User
```bash
curl -X POST "http://localhost:8000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ash",
    "email": "ash@pokemon.com",
    "password": "pikachu123"
  }'
```

### 2. Login
```bash
curl -X POST "http://localhost:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ash@pokemon.com",
    "password": "pikachu123"
  }'
```

Save the `access_token` from the response!

### 3. Scan a Pokémon
```bash
curl -X POST "http://localhost:8000/api/v1/pokemon/scan" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "file=@path/to/pokemon_image.jpg"
```

### 4. Add to Collection
```bash
curl -X POST "http://localhost:8000/api/v1/collection" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pokemon_name": "pikachu",
    "pokemon_id": 25
  }'
```

---

## 🔧 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check DB credentials in `.env`
- Ensure database `poketab` exists

### Gemini API Error
- Verify API key is correct
- Check you have API quota remaining
- Ensure internet connection is active

### Import Errors
- Activate virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
- Reinstall dependencies: `pip install -r requirements.txt`

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Gemini API Docs](https://ai.google.dev/docs)
- [PokeAPI Documentation](https://pokeapi.co/docs/v2)

---

## 🎯 Next Steps

1. **Frontend Integration**: Update frontend to call these API endpoints
2. **Rate Limiting**: Add rate limiting middleware (already planned)
3. **Caching**: Setup Redis for PokeAPI response caching
4. **Testing**: Add unit and integration tests
5. **Deployment**: Deploy to cloud (AWS, GCP, Azure)

Happy coding! 🎮✨
