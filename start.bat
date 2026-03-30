@echo off
REM Paytm OmniMatch - Complete Startup Script for Windows
REM Starts Node.js backend, Python FastAPI backend, and React frontend

echo.
echo ========================================
echo     PAYTM OMNIMATCH - STARTUP
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)

echo ✓ Python found: 
python --version

echo ✓ Node.js found:
node --version

echo.
echo Starting services...
echo.

REM Start Python FastAPI backend
echo 1. Starting Python AI Pipeline (FastAPI)...
echo    URL: http://localhost:8000
cd python_ai
call python -m pip install -q -r requirements.txt 2>nul
start "Python FastAPI" cmd /k python main.py
cd ..
timeout /t 3 /nobreak

REM Start Node.js Express backend
echo 2. Starting Node.js Express Backend...
echo    URL: http://localhost:5000
start "Node.js Express" cmd /k node server.js
timeout /t 3 /nobreak

REM Start React frontend
echo 3. Starting React Frontend (Vite)...
echo    URL: http://localhost:3000
cd frontend
REM Open the frontend
echo 4. Opening browser...
timeout /t 2 /nobreak
start http://localhost:3000
cd ..

echo.
echo ========================================
echo     ALL SERVICES STARTED!
echo ========================================
echo.
echo Frontend:          http://localhost:3000
echo Node.js API:       http://localhost:5000
echo Python AI Docs:    http://localhost:8000/docs
echo.
echo Terminal windows will open for each service.
echo Close any terminal window to stop that service.
echo.
pause
