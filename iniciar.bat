@echo off
setlocal
cd /d "%~dp0"
where python >nul 2>&1
if errorlevel 1 (
  echo Python nao encontrado. Instale Python 3.10 ou superior.
  pause
  exit /b 1
)
if not exist ".venv\Scripts\python.exe" (
  python -m venv .venv
  if errorlevel 1 goto :fail
)
".venv\Scripts\python.exe" -m pip install -r requirements.txt
if errorlevel 1 goto :fail
".venv\Scripts\python.exe" run.py
if errorlevel 1 goto :fail
pause
exit /b 0
:fail
echo Falha ao preparar ou iniciar o projeto. Confira as mensagens acima.
pause
exit /b 1
