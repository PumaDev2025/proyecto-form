# 🐆 PUMA - Liderazgo Visible en Terreno

## Programa de Cultura de Seguridad

Sistema web progresivo (PWA) para el formulario "Liderazgo Visible en Terreno" de PUMA.

---

## ✨ Características

- ✅ **Formulario completo PUMA** con todas las secciones del Excel original
- 📱 **Responsive** - Funciona en PC, tablets y smartphones
- 💾 **Autoguardado** cada 30 segundos en el navegador
- 📄 **Exportar a PDF** con formato profesional PUMA
- 🔌 **Funciona offline** (después de primera visita en HTTPS)
- 🚫 **Sin instalaciones** - No requiere Python, PHP ni ningún servidor
- 🌐 **PWA** - Se puede instalar como app en dispositivos móviles

---

## 📋 Estructura del Formulario

### **1. Planificación Previa**
- Datos del visitante y la visita
- Identificación de riesgo crítico
- Definición del foco u objetivo

### **2. Durante la Visita**
- **2.1 Indagación General** (9 preguntas)
- **2.2 Verificación de Implementación** (6 preguntas)
- **2.3 De Foco Crítico** (6 preguntas)
- **2.4 De Sospecha de Riesgo Emergente** (5 preguntas)
- Evaluación de actitud y percepción

### **3. Después de la Visita**
- Matriz de hallazgos (tabla dinámica)
- Plan de acción (tabla dinámica con fechas)

---

## 🚀 Uso Rápido

### **Opción 1: Doble clic**
1. Busca el archivo `INICIAR.bat`
2. Haz doble clic
3. Se abrirá automáticamente en tu navegador

### **Opción 2: Abrir directamente**
1. Abre `index_puma.html` con tu navegador
2. ¡Listo para usar!

### **Opción 3: En línea (GitHub Pages)**
Visita: https://pumadev2025.github.io/proyecto-form/index_puma.html

---

## 💾 Guardado de Datos

### **Autoguardado**
- Se guarda automáticamente cada **30 segundos**
- Los datos se almacenan en el navegador (localStorage)
- Persiste aunque cierres el navegador

### **Guardado manual**
- Click en botón "💾 Guardar Borrador"
- Guarda inmediatamente el estado actual

### **⚠️ Importante**
- Los datos se guardan **en el navegador** que uses
- Si usas otro navegador o PC, deberás completar nuevamente
- Para compartir, usa la función "Descargar PDF"

---

## 📄 Exportar a PDF

1. **Completa el formulario** (campos marcados con * son obligatorios)
2. Click en **"📄 Descargar PDF"**
3. El PDF se descarga con formato:
   - `PUMA_Liderazgo_Terreno_[Nombre]_[Fecha].pdf`
4. Compártelo por email, WhatsApp, etc.

### **Contenido del PDF**
- ✅ Encabezado oficial PUMA
- ✅ Todos los datos de planificación
- ✅ Todas las respuestas de las visitas
- ✅ Evaluaciones de actitud
- ✅ Fecha y hora de generación

---

## 📱 Instalar como App (PWA)

### **En Android/iPhone:**
1. Abre en navegador (Chrome/Safari)
2. Toca el menú (⋮)
3. Selecciona "Añadir a pantalla de inicio"
4. ¡Listo! Ícono con logo PUMA

### **En PC (Chrome/Edge):**
1. Abre el formulario
2. Click en el ícono "+" en la barra de direcciones
3. "Instalar aplicación"
4. Se abre como app independiente

---

## 🔧 Actualización a Producción

Para actualizar el sitio en GitHub Pages:

### **Método rápido:**
```bash
# Ejecutar el script de actualización
ACTUALIZAR_PUMA.bat

# Luego en Git:
git add .
git commit -m "Actualizar formulario PUMA"
git push origin main
```

### **Método manual:**
```bash
# 1. Respaldar original
copy index.html index_original_backup.html

# 2. Activar versión PUMA
copy index_puma.html index.html

# 3. Subir a GitHub
git add .
git commit -m "Activar formulario PUMA completo"
git push origin main

# 4. Esperar 2-3 minutos y verificar
```

**URL final:** https://pumadev2025.github.io/proyecto-form/

---

## 🗂️ Archivos Principales

```
proyecto-form/
├── index_puma.html      # Formulario PUMA completo ⭐
├── app_puma.js          # JavaScript específico PUMA
├── styles.css           # Estilos responsive
├── manifest.json        # Configuración PWA
├── service-worker.js    # Funcionalidad offline
├── icons/               # Íconos PWA (72px - 512px)
├── INICIAR.bat          # Lanzador rápido
├── ACTUALIZAR_PUMA.bat  # Script de actualización
└── README_PUMA.md       # Esta documentación
```

---

## ⚙️ Requisitos Técnicos

### **Mínimos:**
- ✅ Navegador moderno (Chrome, Firefox, Safari, Edge)
- ✅ JavaScript habilitado
- ✅ 5-10 MB de espacio en localStorage

### **Recomendados para todas las funciones:**
- ✅ HTTPS (para PWA y service worker)
- ✅ Conexión a internet (primera vez, para cargar jsPDF)
- ✅ Permitir descargas en el navegador

### **NO requiere:**
- ❌ Python
- ❌ PHP
- ❌ Node.js
- ❌ Base de datos
- ❌ Servidor web
- ❌ Instalaciones adicionales

---

## 🐛 Solución de Problemas

### **El formulario no carga**
- Verifica que `app_puma.js` y `styles.css` estén en la misma carpeta
- Abre la consola del navegador (F12) y busca errores

### **No se guarda automáticamente**
- Verifica que JavaScript esté habilitado
- Comprueba que no estés en modo incógnito (puede tener restricciones)

### **No genera el PDF**
- Completa todos los campos obligatorios (marcados con *)
- Verifica conexión a internet (primera vez)
- Permite descargas en tu navegador

### **No funciona offline**
- Requiere HTTPS para service worker
- En file:// local no funcionará offline
- Usa GitHub Pages para funcionalidad completa

---

## 📞 Soporte

Para problemas o mejoras:
1. Revisa esta documentación
2. Verifica la consola del navegador (F12)
3. Contacta al administrador del sistema

---

## 📝 Changelog

### **v2.0 - Versión PUMA Completa** (2025)
- ✅ Estructura completa del formulario Excel original
- ✅ Sección 1: Planificación Previa (7 campos + foco)
- ✅ Sección 2: Durante la Visita (34 preguntas en 4 subsecciones)
- ✅ Sección 3: Después de la Visita (2 tablas dinámicas)
- ✅ Generación de PDF con formato PUMA
- ✅ Autoguardado mejorado para tablas dinámicas
- ✅ Scripts de actualización automática

### **v1.0 - Versión Genérica** (2025)
- ✅ Formulario base de liderazgo
- ✅ PWA funcional
- ✅ Exportar a PDF básico

---

## 📜 Licencia

© 2025 PUMA. Uso interno exclusivo.

---

**Desarrollado para PUMA** 🐆  
*Programa de Cultura de Seguridad*
