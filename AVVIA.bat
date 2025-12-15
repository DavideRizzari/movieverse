@echo off
echo ========================================
echo    MovieVerse - Avvio Automatico
echo ========================================
echo.
echo Avvio del backend...
echo.

cd server
start "MovieVerse Backend" cmd /k "npm start"

timeout /t 3 /nobreak >nul

cd ..
echo.
echo Avvio del frontend...
echo.

start "MovieVerse Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Entrambi i server sono stati avviati!
echo ========================================
echo.
echo Il sito si aprira' automaticamente nel browser.
echo.
echo Per fermare i server, chiudi le finestre del terminale.
echo.
pause
