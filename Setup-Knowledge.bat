@echo off
REM Sets up the shared Gleam knowledge base inside this project.
REM Run this once after cloning the project, or any time .knowledge/ goes missing.

cd /d "%~dp0"

if exist .knowledge\.git (
    echo .knowledge/ already exists. Use Atualizar-Knowledge.bat to pull latest.
    exit /b 0
)

echo Cloning gleam-knowledge-base into .knowledge/ ...
git clone https://github.com/thurzin-dev/gleam-knowledge-base.git .knowledge

if errorlevel 1 (
    echo.
    echo Clone failed. Check your GitHub access.
    exit /b 1
)

echo.
echo Done. .knowledge/ is now available.
