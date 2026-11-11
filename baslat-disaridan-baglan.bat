@echo off
title Lingo Pulse - Evden Calistirma
chcp 65001 >nul
cls
echo ======================================================
echo    LINGO PULSE - EVDE ACIK BIRAKMA BASLATICISI
echo ======================================================
echo.
echo [1/3] Backend (Port 3001) baslatiliyor...
start "Lingo Backend (Port 3001)" cmd /k "node server.js"

timeout /t 3 /nobreak >nul

echo [2/3] Backend icin Internet Tuneli aciliyor...
start "Lingo Backend Internet Tuneli" cmd /k "node tunnel.js"

timeout /t 3 /nobreak >nul

echo [3/3] Expo Tunnel (Mobil Uygulama) baslatiliyor...
echo.
call node patch-expo.js >nul 2>&1
echo QR Kod birazdan bu pencerede cikacak!
echo Telefonundaki Expo Go ile okutabilirsin.
echo.
npx expo start --tunnel --clear
pause

