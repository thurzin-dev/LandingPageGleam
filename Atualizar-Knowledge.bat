@echo off
REM Pulls the latest Gleam knowledge base into .knowledge/.
REM Run this any time the shared knowledge base has been updated upstream.

cd /d "%~dp0"

if not exist .knowledge\.git (
    echo .knowledge/ not found. Running Setup-Knowledge.bat first...
    call Setup-Knowledge.bat
    exit /b %errorlevel%
)

cd .knowledge
echo Pulling latest from origin/main ...
git pull origin main

if errorlevel 1 (
    echo.
    echo Pull failed. Resolve manually inside .knowledge/.
    exit /b 1
)

echo.
echo Knowledge base updated.
