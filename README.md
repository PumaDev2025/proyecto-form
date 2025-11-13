# 📋 Lista de Verificación - Liderazgo en Terreno

Aplicación web progresiva (PWA) para evaluar el liderazgo en terreno de manera eficiente, con funcionalidad offline y exportación a PDF.

## 🌟 Características Principales

✅ **Formulario Completo de Evaluación**
- 8 criterios de evaluación de liderazgo
- Sistema de puntuación de 1-5 + N/A
- Campos de observaciones para cada criterio
- Cálculo automático de puntuación y promedio

✅ **Guardado Automático**
- Autoguardado cada 30 segundos
- Almacenamiento local (localStorage)
- Recuperación automática de borradores
- Sin necesidad de servidor backend

✅ **Exportación a PDF**
- Generación de PDF profesional
- Mantiene el formato y diseño
- Nombre de archivo personalizado
- Incluye toda la información del formulario

✅ **Diseño Responsive**
- Funciona en PC, tablets y móviles
- Optimizado para Android
- Interfaz táctil amigable
- Adaptable a diferentes tamaños de pantalla

✅ **PWA (Progressive Web App)**
- Instalable como app nativa en Android
- Funciona offline
- Ícono en la pantalla de inicio
- Experiencia similar a app nativa

✅ **Privacidad y Seguridad**
- Datos guardados solo localmente
- No envía información a servidores externos
- Control total de la información

---

## 🚀 Instalación y Uso

### **Opción 1: Uso en PC (Windows/Mac/Linux)**

#### Paso 1: Preparar los archivos
1. Descarga o copia todos los archivos del proyecto a una carpeta
2. Asegúrate de tener los siguientes archivos:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `manifest.json`
   - `service-worker.js`
   - Iconos (icon-72.png hasta icon-512.png)

#### Paso 2: Generar los iconos (opcional)
Si no tienes los iconos, puedes generarlos ejecutando:

```powershell
# Instalar Pillow (si no lo tienes)
pip install Pillow

# Ejecutar el generador de iconos
python generate_icons.py
```

**Alternativa sin Python:**
- Usa un generador online: [PWA Image Generator](https://www.pwabuilder.com/imageGenerator)
- O crea manualmente iconos PNG de: 72, 96, 128, 144, 152, 192, 384, 512 píxeles

#### Paso 3: Abrir la aplicación
Hay varias formas de ejecutar la aplicación:

**A) Servidor HTTP simple con Python:**
```powershell
# Python 3
python -m http.server 8000

# Luego abre en el navegador:
# http://localhost:8000
```

**B) Servidor HTTP con Node.js:**
```powershell
# Instalar http-server globalmente
npm install -g http-server

# Ejecutar
http-server -p 8000

# Abrir: http://localhost:8000
```

**C) Servidor HTTP con PHP:**
```powershell
php -S localhost:8000
```

**D) Extensión de VS Code:**
- Instala "Live Server" en VS Code
- Click derecho en `index.html` → "Open with Live Server"

#### Paso 4: Usar la aplicación
1. Completa el formulario de evaluación
2. Los datos se guardan automáticamente cada 30 segundos
3. Click en "Descargar PDF" para exportar
4. Click en "Limpiar Formulario" para empezar de nuevo

---

### **Opción 2: Instalación en Android como PWA**

#### Método A: Instalación desde Chrome en Android

1. **Subir los archivos a un servidor web**
   - Puedes usar GitHub Pages (gratuito)
   - O cualquier servicio de hosting web
   - Asegúrate de que tenga HTTPS (requerido para PWA)

   **Ejemplo con GitHub Pages:**
   ```bash
   # Crear repositorio en GitHub
   # Subir todos los archivos
   # Ir a Settings → Pages
   # Activar GitHub Pages desde la rama main
   # Tu app estará en: https://tu-usuario.github.io/tu-repo
   ```

2. **Abrir en Chrome Android**
   - Abre Chrome en tu dispositivo Android
   - Navega a la URL de tu aplicación
   - Verás un banner o ícono de "Agregar a pantalla de inicio"

3. **Instalar la PWA**
   - Toca el menú (⋮) en la esquina superior derecha
   - Selecciona "Agregar a pantalla de inicio" o "Instalar app"
   - Confirma la instalación
   - ¡Listo! Ahora tendrás un ícono en tu pantalla de inicio

#### Método B: Instalación Local (para pruebas)

1. **Usando tu propia red local:**
   ```powershell
   # En tu PC, ejecuta el servidor
   python -m http.server 8000
   
   # Encuentra tu IP local
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   
   # Ejemplo de IP: 192.168.1.100
   ```

2. **En tu Android:**
   - Conecta a la misma red WiFi
   - Abre Chrome
   - Navega a: `http://192.168.1.100:8000`
   - Sigue los pasos del Método A para instalar

#### Método C: Usar ngrok (sin hosting)

```powershell
# Instalar ngrok (https://ngrok.com/)
# Ejecutar tu servidor local
python -m http.server 8000

# En otra terminal
ngrok http 8000

# Ngrok te dará una URL pública temporal como:
# https://abc123.ngrok.io
# Úsala en tu Android para instalar la PWA
```

---

## 📱 Uso de la Aplicación

### **Completar el Formulario**

1. **Información General**
   - Completa los datos del evaluador y líder evaluado
   - Todos los campos marcados con * son obligatorios
   - La fecha se establece automáticamente al día actual

2. **Criterios de Evaluación**
   - Evalúa cada uno de los 8 criterios de liderazgo
   - Selecciona una puntuación de 1 a 5, o N/A
   - Agrega observaciones específicas en cada criterio

3. **Resumen**
   - Revisa la puntuación total y promedio (se calculan automáticamente)
   - Completa las fortalezas, áreas de mejora y plan de acción
   - Establece fechas de seguimiento

### **Funcionalidades**

**Guardado Automático:**
- Se activa cada 30 segundos
- Verás un indicador verde en la esquina superior derecha
- Los datos persisten al cerrar y reabrir el navegador

**Guardar Manualmente:**
- Click en botón "Guardar Borrador"
- Útil antes de cerrar la aplicación

**Limpiar Formulario:**
- Click en "Limpiar Formulario"
- Se pedirá confirmación
- Elimina todos los datos guardados

**Descargar PDF:**
- Click en "Descargar PDF"
- Se validan campos obligatorios antes de generar
- El PDF se descarga con nombre personalizado: `Formulario_Liderazgo_[Nombre]_[Fecha].pdf`

---

## 🛠️ Personalización

### **Modificar Criterios de Evaluación**

Edita `index.html` para agregar, eliminar o modificar criterios:

```html
<!-- Ejemplo de nuevo criterio -->
<div class="evaluation-item">
    <div class="criterion-header">
        <h3 class="criterion-title">9. Tu Nuevo Criterio</h3>
        <span class="required-badge">Requerido</span>
    </div>
    <p class="criterion-description">
        Descripción del criterio...
    </p>
    <div class="rating-group">
        <!-- Opciones de rating... -->
    </div>
</div>
```

Luego actualiza `app.js` en la función `calculateScore()`:

```javascript
const criteriaNames = [
    'communication',
    'presence',
    // ... otros criterios
    'tuNuevoCriterio'  // Agregar aquí
];
```

### **Cambiar Colores y Diseño**

Edita `styles.css` en la sección de variables CSS:

```css
:root {
    --primary-color: #2c3e50;  /* Color principal */
    --secondary-color: #3498db; /* Color secundario */
    /* Modifica según tu marca */
}
```

### **Modificar Autoguardado**

En `app.js`, cambia el intervalo:

```javascript
const CONFIG = {
    AUTO_SAVE_INTERVAL: 30000, // 30 segundos (30000 ms)
    // Cambia a 60000 para 1 minuto, etc.
};
```

---

## 🔧 Solución de Problemas

### **Los iconos no aparecen**
- Ejecuta `generate_icons.py` para generarlos
- O descárgalos/créalos manualmente
- Verifica que los nombres coincidan: `icon-72.png`, `icon-192.png`, etc.

### **El PDF no se genera**
- Verifica que tengas conexión a internet (las librerías jsPDF se cargan desde CDN)
- Completa todos los campos obligatorios
- Abre la consola del navegador (F12) para ver errores

### **El autoguardado no funciona**
- Verifica que localStorage esté habilitado en tu navegador
- En modo incógnito, localStorage puede estar deshabilitado
- Abre la consola (F12) para ver mensajes de error

### **La PWA no se instala en Android**
- Asegúrate de usar HTTPS (requerido para PWA)
- Verifica que `manifest.json` esté correctamente enlazado
- El Service Worker requiere HTTPS (excepto en localhost)
- Algunos navegadores Android no soportan PWA (usa Chrome)

### **Los datos no se guardan**
- Verifica que no estés en modo incógnito
- Limpia la caché del navegador y recarga
- Revisa el espacio de almacenamiento disponible

---

## 📁 Estructura de Archivos

```
proyecto-form/
│
├── index.html              # Estructura HTML del formulario
├── styles.css              # Estilos y diseño responsive
├── app.js                  # Lógica JavaScript principal
├── manifest.json           # Configuración PWA
├── service-worker.js       # Service Worker para offline
├── generate_icons.py       # Script para generar iconos
│
├── icon-72.png            # Iconos PWA
├── icon-96.png
├── icon-128.png
├── icon-144.png
├── icon-152.png
├── icon-192.png
├── icon-384.png
├── icon-512.png
│
└── README.md              # Este archivo
```

---

## 🔒 Privacidad y Seguridad

- **Almacenamiento Local:** Todos los datos se guardan en el dispositivo del usuario
- **Sin Backend:** No hay servidor que almacene información
- **Sin Transmisión:** Los datos nunca se envían a servicios externos
- **Control Total:** El usuario tiene control completo de sus datos
- **GDPR Friendly:** Cumple con regulaciones de privacidad

---

## 🌐 Compatibilidad

### **Navegadores Soportados:**
- ✅ Chrome 90+ (Desktop y Android)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### **Sistemas Operativos:**
- ✅ Windows 10/11
- ✅ macOS 10.15+
- ✅ Android 8.0+
- ✅ iOS 14+ (con limitaciones PWA)
- ✅ Linux (todas las distribuciones modernas)

### **Dispositivos:**
- ✅ PC/Laptops
- ✅ Tablets
- ✅ Smartphones
- ✅ Pantallas táctiles

---

## 📊 Características Técnicas

- **Framework:** Vanilla JavaScript (sin dependencias)
- **CSS:** CSS3 con Grid y Flexbox
- **Librerías:** jsPDF (generación PDF)
- **Almacenamiento:** localStorage (5-10 MB)
- **PWA:** Service Worker + Manifest
- **Offline:** Funciona completamente sin conexión
- **Responsive:** Mobile-first design

---

## 🆘 Soporte

Si encuentras problemas o tienes preguntas:

1. Revisa la sección "Solución de Problemas"
2. Verifica la consola del navegador (F12) para errores
3. Asegúrate de tener las últimas versiones de los archivos
4. Limpia la caché del navegador y recarga

---

## 📝 Notas Adicionales

- **Respaldo de Datos:** Recomendamos exportar a PDF regularmente
- **Actualización de la App:** Recarga la página para obtener actualizaciones
- **Modo Offline:** Una vez cargada, la app funciona sin internet
- **Límite de Almacenamiento:** localStorage tiene límite de ~5-10 MB

---

## 🎯 Próximas Mejoras Sugeridas

- [ ] Sincronización con servidor (opcional)
- [ ] Exportación a Excel
- [ ] Modo oscuro
- [ ] Múltiples idiomas
- [ ] Firma digital
- [ ] Fotos adjuntas
- [ ] Comparación histórica
- [ ] Gráficos de progreso

---

## 📜 Licencia

Este proyecto es de código abierto. Puedes modificarlo y adaptarlo según tus necesidades.

---

## ✨ Créditos

Desarrollado como solución empresarial para evaluación de liderazgo en terreno.

**Versión:** 1.0.0  
**Fecha:** Noviembre 2025

---

¡Gracias por usar la aplicación Lista de Verificación - Liderazgo en Terreno! 🚀
