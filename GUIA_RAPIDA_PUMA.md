# 🚀 GUÍA RÁPIDA - Formulario PUMA

## ⚡ Inicio Rápido (30 segundos)

1. **Abrir**: Doble clic en `INICIAR.bat` o `index_puma.html`
2. **Completar**: Llenar los campos del formulario
3. **Descargar**: Click en "📄 Descargar PDF"

¡Listo! 🎉

---

## 📝 Completar el Formulario

### **PASO 1: Planificación Previa**
```
✅ Nombre de quien visita *
✅ Fecha *
✅ Hora *
✅ Centro de trabajo *
✅ Operación/lugar a visitar *
✅ Riesgo crítico a observar *
✅ Foco u objetivo de la visita * (seleccionar 1 de 4 opciones)
```

### **PASO 2: Durante la Visita**

#### 2.1 - Indagación General
- 9 preguntas sobre seguridad general
- Campos de texto libre para respuestas detalladas

#### 2.2 - Verificación de Implementación
- 6 preguntas sobre medidas implementadas
- Evaluación de efectividad

#### 2.3 - De Foco Crítico
- 6 preguntas sobre operaciones críticas
- Análisis de riesgos específicos

#### 2.4 - Sospecha de Riesgo Emergente
- 5 preguntas sobre riesgos no identificados
- Controles y mejoras

#### Actitud y Percepción
```
✅ Actitud del entrevistado (Colaborador/Resistente/Indiferente)
✅ Sentimiento del entrevistador (Positivo/Neutro/Preocupante)
```

### **PASO 3: Después de la Visita**

#### Tabla 1: Matriz de Hallazgos
```
| Operación/actividad | Riesgo asociado | Fallo latente | Mejoras | Derivado a |
```
- Click en "+ Agregar Fila" para más hallazgos

#### Tabla 2: Plan de Acción
```
| Riesgo Crítico | Solución Propuesta | Responsable | Plazo | Retroalimentación |
```
- Click en "+ Agregar Fila" para más acciones

---

## 💾 Guardado

### **Automático**
- ⏱️ Cada 30 segundos
- 🔄 Al cambiar entre campos
- 💚 Indicador verde cuando guarda

### **Manual**
- 💾 Click en "Guardar Borrador"
- ✅ Confirmación instantánea

### **¿Dónde se guarda?**
- 📱 En tu navegador (localStorage)
- 🔒 No se envía a ningún servidor
- ⚠️ Si cambias de navegador/PC, no lo verás

---

## 📄 Descargar PDF

### **Requisitos**
1. Completar campos obligatorios (*)
2. Click en "📄 Descargar PDF"
3. Esperar 2-3 segundos

### **Resultado**
```
📁 Archivo descargado:
   PUMA_Liderazgo_Terreno_[Nombre]_[Fecha].pdf

📂 Ubicación:
   Carpeta de Descargas de tu navegador
```

### **Contenido del PDF**
- ✅ Encabezado PUMA oficial
- ✅ Sección 1: Planificación Previa completa
- ✅ Sección 2: Todas las respuestas de la visita
- ✅ Sección 3: Hallazgos y plan de acción (resumen)
- ✅ Fecha y hora de generación
- ✅ Numeración de páginas

---

## 🧹 Limpiar Formulario

1. Click en "🗑️ Limpiar Formulario"
2. Confirmar en el modal
3. **⚠️ ATENCIÓN**: Se borrarán TODOS los datos
4. No se puede deshacer

**Consejo**: Descarga el PDF antes de limpiar

---

## 📱 Usar en Celular/Tablet

### **Android (Chrome)**
1. Abre: https://pumadev2025.github.io/proyecto-form/index_puma.html
2. Menú (⋮) → "Añadir a pantalla de inicio"
3. Aparecerá ícono PUMA en tu pantalla
4. Abrir como app independiente

### **iPhone (Safari)**
1. Abre la URL
2. Botón "Compartir" (cuadrado con flecha)
3. "Añadir a pantalla de inicio"
4. Ícono PUMA disponible

### **Ventajas**
- 📴 Funciona offline (después de primera carga)
- 🚀 Carga más rápido
- 📱 Experiencia de app nativa
- 💾 Autoguardado funciona igual

---

## ❓ Preguntas Frecuentes

### **¿Necesito internet?**
- ✅ Primera vez: SÍ (para cargar jsPDF)
- ✅ Después: NO (funciona offline en HTTPS)
- ⚠️ En file:// local: Necesitas internet para PDF

### **¿Se puede usar sin instalar nada?**
- ✅ SÍ - Solo navegador web
- ❌ NO requiere Python, PHP, ni apps

### **¿Los datos son seguros?**
- ✅ Se guardan solo en tu navegador
- ✅ No se envían a ningún servidor
- ✅ Solo tú tienes acceso
- ⚠️ Si borras datos del navegador, se pierden

### **¿Puedo usar en varios dispositivos?**
- ⚠️ Cada dispositivo guarda sus propios datos
- 💡 Solución: Descarga PDF y compártelo

### **¿Cómo comparto el formulario completado?**
1. Descargar PDF
2. Enviar por email/WhatsApp/Drive
3. El receptor lo ve como documento estático

### **¿Funciona sin conexión?**
- ✅ En HTTPS (GitHub Pages): SÍ
- ⚠️ En file:// local: Parcialmente (sin PDF la primera vez)

### **¿Cuántos formularios puedo guardar?**
- Solo 1 borrador a la vez
- Para múltiples: Descarga PDF y limpia

---

## 🆘 Problemas Comunes

### **"No se guarda el formulario"**
```
Soluciones:
1. Verifica que JavaScript esté habilitado
2. No uses modo incógnito
3. Permite almacenamiento local en el navegador
4. Actualiza la página (F5)
```

### **"No genera el PDF"**
```
Soluciones:
1. Completa todos los campos con * (obligatorios)
2. Verifica conexión a internet (primera vez)
3. Permite descargas en tu navegador
4. Desactiva bloqueador de pop-ups
```

### **"El formulario está en blanco al abrirlo"**
```
Soluciones:
1. Verifica que los archivos estén juntos:
   - index_puma.html
   - app_puma.js
   - styles.css
2. Abre la consola (F12) y busca errores
3. Recarga con Ctrl+F5
```

### **"Las tablas no agregan filas"**
```
Soluciones:
1. Verifica que JavaScript esté habilitado
2. Abre consola (F12) y busca errores
3. Recarga la página
```

---

## 🎯 Mejores Prácticas

### **✅ HACER**
- Completar el formulario progresivamente
- Guardar borrador antes de cerrar
- Descargar PDF cuando termines
- Usar descripciones detalladas en campos de texto
- Agregar todas las filas necesarias en las tablas

### **❌ NO HACER**
- No confíes solo en el autoguardado
- No uses modo incógnito para trabajos largos
- No cierres sin descargar PDF primero
- No uses caracteres especiales en nombres (para PDF)
- No esperes que se sincronice entre dispositivos

---

## 📊 Atajos de Teclado

```
Tab          → Siguiente campo
Shift+Tab    → Campo anterior
Enter        → (en textarea) Nueva línea
Ctrl+S       → Guardar borrador manualmente
F5           → Recargar (carga último borrador)
F12          → Abrir consola (para debugging)
```

---

## 📞 Soporte Técnico

### **Antes de reportar un problema:**
1. ✅ Lee esta guía completa
2. ✅ Abre consola del navegador (F12)
3. ✅ Toma captura del error
4. ✅ Anota qué estabas haciendo

### **Información útil para soporte:**
- Navegador y versión
- Sistema operativo
- Archivo que usaste (index.html / index_puma.html)
- Mensaje de error exacto
- Pasos para reproducir el problema

---

## 🔄 Actualizar a Producción

### **Para administradores:**

```bash
# 1. Ejecutar script de actualización
ACTUALIZAR_PUMA.bat

# 2. Subir a GitHub
git add .
git commit -m "Activar formulario PUMA"
git push origin main

# 3. Verificar en:
https://pumadev2025.github.io/proyecto-form/
```

---

## 📚 Recursos Adicionales

- 📖 **Documentación completa**: `README_PUMA.md`
- 🛠️ **Guía técnica**: `README.md`
- 🎨 **Iconos PWA**: Carpeta `icons/`
- 🔧 **Configuración**: `manifest.json`

---

**¿Listo para empezar?** 🚀

1. Abre `INICIAR.bat`
2. Completa el formulario
3. Descarga tu PDF

**¡Así de simple!** 🎉

---

© 2025 PUMA - Programa de Cultura de Seguridad 🐆
