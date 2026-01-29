@echo off
REM PokéTab Backend Setup Script for Windows

echo 🚀 Setting up PokéTab Backend...

REM Check Python version
echo 📌 Checking Python version...
python --version

REM Create virtual environment
echo 📦 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📥 Installing dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your actual credentials!
) else (
    echo ✅ .env file already exists
)

echo.
echo ✨ Setup complete!
echo.
echo Next steps:
echo 1. Edit .env file with your credentials (MySQL, Gemini API key)
echo 2. Create MySQL database: CREATE DATABASE poketab;
echo 3. Run the server: python -m app.main
echo.
echo API will be available at: http://localhost:8000
echo API Documentation: http://localhost:8000/docs

pause
