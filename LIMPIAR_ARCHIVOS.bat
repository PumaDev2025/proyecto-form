@echo off
title LIMPIEZA DE ARCHIVOS DUPLICADOS
color 0E
echo ========================================
echo   LIMPIEZA DE ARCHIVOS DEL PROYECTO
echo ========================================
echo.
echo Este script eliminara archivos duplicados y obsoletos
echo de la version GENERICA que ya no se usaran.
echo.
echo ARCHIVOS A ELIMINAR:
echo   - LEEME_PRIMERO.txt (duplicado de README)
echo   - RESUMEN_INSTALACION.txt (duplicado de README)
echo   - VERIFICACION_COMPLETA.md (duplicado de CHECKLIST)
echo   - SIN_INSTALACIONES.md (duplicado de README)
echo   - GUIA_RAPIDA.md (version generica, ahora hay PUMA)
echo   - README.md (version generica, ahora hay README_PUMA)
echo   - Copia de Lista de verificacion... (Excel original, ya replicado)
echo.
echo SE MANTENDRAN:
echo   - index.html (version generica como respaldo)
echo   - app.js (version generica como respaldo)
echo   - index_puma.html (VERSION ACTUAL)
echo   - app_puma.js (VERSION ACTUAL)
echo   - README_PUMA.md (documentacion actual)
echo   - GUIA_RAPIDA_PUMA.md (guia actual)
echo   - CHECKLIST_IMPLEMENTACION.md (lista de tareas)
echo   - styles.css, manifest.json, service-worker.js (comunes)
echo   - ACTUALIZAR_PUMA.bat, INICIAR.bat (scripts utiles)
echo   - Todos los iconos
echo.
pause

echo.
echo [1/7] Eliminando LEEME_PRIMERO.txt...
if exist "LEEME_PRIMERO.txt" (
    del /Q "LEEME_PRIMERO.txt"
    echo OK - Eliminado
) else (
    echo SKIP - No existe
)

echo.
echo [2/7] Eliminando RESUMEN_INSTALACION.txt...
if exist "RESUMEN_INSTALACION.txt" (
    del /Q "RESUMEN_INSTALACION.txt"
    echo OK - Eliminado
) else (
    echo SKIP - No existe
)

echo.
echo [3/7] Eliminando VERIFICACION_COMPLETA.md...
if exist "VERIFICACION_COMPLETA.md" (
    del /Q "VERIFICACION_COMPLETA.md"
    echo OK - Eliminado
) else (
    echo SKIP - No existe
)

echo.
echo [4/7] Eliminando SIN_INSTALACIONES.md...
if exist "SIN_INSTALACIONES.md" (
    del /Q "SIN_INSTALACIONES.md"
    echo OK - Eliminado
) else (
    echo SKIP - No existe
)

echo.
echo [5/7] Eliminando GUIA_RAPIDA.md (version generica)...
if exist "GUIA_RAPIDA.md" (
    del /Q "GUIA_RAPIDA.md"
    echo OK - Eliminado
) else (
    echo SKIP - No existe
)

echo.
echo [6/7] Eliminando README.md (version generica)...
if exist "README.md" (
    ren "README.md" "README_ORIGINAL_BACKUP.md"
    echo OK - Renombrado a README_ORIGINAL_BACKUP.md (por seguridad)
) else (
    echo SKIP - No existe
)

echo.
echo [7/7] Eliminando archivo Excel original...
if exist "Copia de Lista de verificacio*n*.xlsx" (
    del /Q "Copia de Lista de verificacio*n*.xlsx"
    echo OK - Eliminado
) else (
    echo SKIP - No existe
)

echo.
echo ========================================
echo   LIMPIEZA COMPLETADA
echo ========================================
echo.
echo Archivos eliminados: Duplicados y obsoletos
echo.
echo ESTRUCTURA FINAL:
echo   index_puma.html      - Formulario PUMA actual
echo   app_puma.js          - JavaScript PUMA
echo   README_PUMA.md       - Documentacion principal
echo   GUIA_RAPIDA_PUMA.md  - Guia de uso
echo   CHECKLIST_IMPLEMENTACION.md - Verificacion
echo.
echo RESPALDOS MANTENIDOS:
echo   index.html           - Version generica original
echo   app.js               - JavaScript original
echo   README_ORIGINAL_BACKUP.md - Readme original
echo.
echo PROXIMO PASO:
echo   1. Revisar que todo funcione correctamente
echo   2. Ejecutar: git status
echo   3. Ejecutar: git add .
echo   4. Ejecutar: git commit -m "Limpiar archivos duplicados"
echo   5. Ejecutar: git push origin main
echo.
pause
