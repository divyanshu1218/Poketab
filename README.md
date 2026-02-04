# PokéTab

**PokéTab** is a full-stack web application that allows users to scan, identify, and collect Pokémon using AI technology. Built with a modern tech stack, it features a responsive frontend and a robust backend powered by Google's Gemini Vision API.

## 🚀 Features

### Core Functionality
- **AI-Powered Scanning**: Upload or capture images to identify Pokémon using Gemini Vision API.
- **Personal Collection**: Manage a personal collection of up to 15 Pokémon.
- **Detailed Information**: View stats, types, and descriptions fetched from PokeAPI.
- **User Authentication**: Secure registration and login system.

### Frontend
- **Responsive Design**: Mobile-first UI built with Tailwind CSS.
- **Modern UX**: Smooth page transitions and animations using Framer Motion.
- **Interactive UI**: Rich components from Shadcn UI.
- **3D Elements**: 3D graphical elements powered by Three.js / React Three Fiber.
- **Themes**: Dark/Light mode support (defaulting to a sleek dark aesthetic).

### Backend
- **Secure API**: FastAPI-based REST API with JWT authentication.
- **Rate Limiting**: Protection against abuse on sensitive endpoints.
- **Async Database**: High-performance async database operations with SQLAlchemy.
- **CORS Support**: Configured for secure frontend-backend communication.

---

## 🛠️ Tech Stack

### Frontend (`/frontend`)
- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [TanStack Query](https://tanstack.com/query/latest)
- **Routing**: [React Router](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

### Backend (`/backend`)
- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Python 3.10+)
- **Database**: MySQL 8.0+ (Accessed via `sqlalchemy` + `aiomysql`)
- **AI Model**: Google Gemini Vision (`google-generativeai`)
- **External Data**: [PokeAPI](https://pokeapi.co/)
- **Auth**: PyJWT + Passlib (Bcrypt)

---

## 📂 Project Structure

```
PokeTab/
├── backend/                # Python FastAPI Backend
│   ├── app/
│   │   ├── api/            # API Route Handlers (auth, pokemon, collection)
│   │   ├── core/           # Security & Config
│   │   ├── models/         # SQLAlchemy Database Models
│   │   ├── services/       # External Services (Gemini, PokeAPI)
│   │   └── main.py         # App Entry Point
│   ├── requirements.txt    # Python Dependencies
│   └── .env.example        # Backend Environment Variables
│
├── frontend/               # React TypeScript Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Page Views (Index, Scan, Collection, etc.)
│   │   ├── contexts/       # React Context (Auth)
│   │   └── App.tsx         # Main App Component & Routing
│   ├── package.json        # Node Dependencies
│   └── vite.config.ts      # Vite Configuration
└── README.md               # Project Documentation
```

---

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
- **Node.js** (v18+ recommended)
- **Python** (v3.10+)
- **MySQL** (v8.0+)
- **Git**

You will also need a **Google Gemini API Key** for the scanning feature.

---

## ⚙️ Installation & Setup

### 1. Database Setup
Create a MySQL database named `poketab`.
```sql
CREATE DATABASE poketab;
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment and install dependencies:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
```

Configure Environment Variables:
1. Copy `.env.example` to `.env`.
2. Update `.env` with your database credentials and Gemini API key.
```bash
cp .env.example .env
```

Run the Server:
```bash
python -m app.main
# The API will start at http://localhost:8000
```

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

Install Dependencies:
```bash
npm install
```

Run the Development Server:
```bash
npm run dev
# The app will start at http://localhost:8080 (or similar)
```

---

## 🚀 Deployment

### Backend (Render)
1. Ensure `backend/requirements.txt` is up to date and commit your changes.
2. Render will use `render.yaml` automatically, or configure:
   - Root directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Set environment variables on Render:
   - `SECRET_KEY`
   - `GEMINI_API_KEY`
   - `CORS_ORIGINS` (set to your Netlify URL)
   - `API_V1_PREFIX=/api/v1`

### Frontend (Netlify)
1. Netlify will use `frontend/netlify.toml`, or configure:
   - Base directory: `frontend`
   - Build: `npm run build`
   - Publish: `dist`
2. Set environment variable:
   - `VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api/v1`

---

## 🔗 API Routes

Once the backend is running, you can access the interactive API documentation:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints
- **POST** `/api/v1/auth/register` - Create account
- **POST** `/api/v1/auth/login` - Authenticate
- **POST** `/api/v1/pokemon/scan` - Identify Pokémon from image
- **GET** `/api/v1/collection` - View user's collection

---

## 📱 Application Routes (Frontend)

- `/` - Landing Page
- `/login` & `/register` - Authentication
- `/scan` - Pokémon Scanner (Protected)
- `/browse` - Browse identified Pokémon (Protected)
- `/collection` - Manage Collection (Protected)
