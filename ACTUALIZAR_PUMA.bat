@echo off
title ACTUALIZAR FORMULARIO PUMA
color 0A
echo ========================================
echo   ACTUALIZACION FORMULARIO PUMA
echo ========================================
echo.
echo Este script actualizara el formulario a la version PUMA
echo.
pause

echo.
echo [1/3] Respaldando index.html original...
if exist index.html (
    copy /Y index.html index_original_backup.html
    echo OK - Respaldo creado: index_original_backup.html
) else (
    echo ADVERTENCIA - No se encontro index.html
)

echo.
echo [2/3] Activando version PUMA...
if exist index_puma.html (
    copy /Y index_puma.html index.html
    echo OK - index_puma.html copiado como index.html
) else (
    echo ERROR - No se encontro index_puma.html
    pause
    exit /b 1
)

echo.
echo [3/3] Verificando archivos...
if exist app_puma.js (
    echo OK - app_puma.js encontrado
) else (
    echo ERROR - No se encontro app_puma.js
)

if exist styles.css (
    echo OK - styles.css encontrado
) else (
    echo ERROR - No se encontro styles.css
)

echo.
echo ========================================
echo   ACTUALIZACION COMPLETADA
echo ========================================
echo.
echo El formulario PUMA ahora esta activo como index.html
echo.
echo SIGUIENTE PASO:
echo 1. Abra Git Bash o PowerShell
echo 2. Ejecute:
echo    git add .
echo    git commit -m "Actualizar a formulario PUMA completo"
echo    git push origin main
echo.
echo 3. Espere 2-3 minutos
echo 4. Visite: https://pumadev2025.github.io/proyecto-form/
echo.
pause
