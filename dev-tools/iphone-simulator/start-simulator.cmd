@echo off
rem iPhone Simulator: starts the local server and opens the simulator window.
rem Double-click this file, or run it from a terminal. Extra options are passed to server.js (for example --browser).
chcp 65001 >nul
cd /d "%~dp0..\.."
node "dev-tools\iphone-simulator\server.js" %*
if errorlevel 1 pause
