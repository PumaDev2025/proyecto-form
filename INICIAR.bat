@echo off
REM Script de inicio rápido para la aplicación
REM Lista de Verificación - Liderazgo en Terreno

echo ========================================
echo  Lista de Verificacion - Liderazgo
echo  Iniciando servidor local...
echo ========================================
echo.

REM Intentar con Python 3
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Usando Python para iniciar servidor...
    echo.
    echo La aplicacion estara disponible en:
    echo http://localhost:8000
    echo.
    echo Presiona Ctrl+C para detener el servidor
    echo ========================================
    echo.
    python -m http.server 8000
    goto :end
)

REM Intentar con PHP
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Usando PHP para iniciar servidor...
    echo.
    echo La aplicacion estara disponible en:
    echo http://localhost:8000
    echo.
    echo Presiona Ctrl+C para detener el servidor
    echo ========================================
    echo.
    php -S localhost:8000
    goto :end
)

REM Si no hay Python ni PHP
echo ERROR: No se encontro Python ni PHP en el sistema
echo.
echo Por favor instala alguna de estas opciones:
echo.
echo 1. Python 3: https://www.python.org/downloads/
echo 2. PHP: https://www.php.net/downloads
echo.
echo O abre el archivo index.html directamente en tu navegador
echo (algunas funciones pueden no estar disponibles sin servidor)
echo.
pause

:end
