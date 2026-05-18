@echo off
echo ================================
echo    Starting PerformIQ App
echo ================================

echo Starting Backend...
start "Backend" cmd /k "cd /d "%~dp0backend" && npm install && npm run dev"

timeout /t 3

echo Starting Frontend...
start "Frontend" cmd /k "cd /d "%~dp0frontend" && npm install && npm run dev"

echo ================================
echo Both servers are starting...
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ================================
pause
