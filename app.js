// ================================
// CONFIGURACIÓN GLOBAL
// ================================
const CONFIG = {
    AUTO_SAVE_INTERVAL: 30000, // 30 segundos
    STORAGE_KEY: 'leadershipFormData',
    TOAST_DURATION: 3000,
    PDF_FILENAME_PREFIX: 'Formulario_Liderazgo_'
};

// ================================
// ELEMENTOS DEL DOM
// ================================
const elements = {
    form: document.getElementById('leadershipForm'),
    clearBtn: document.getElementById('clearBtn'),
    saveBtn: document.getElementById('saveBtn'),
    downloadPdfBtn: document.getElementById('downloadPdfBtn'),
    autoSaveIndicator: document.getElementById('autoSaveIndicator'),
    statusBadge: document.getElementById('statusBadge'),
    totalScore: document.getElementById('totalScore'),
    averageScore: document.getElementById('averageScore'),
    performanceLevel: document.getElementById('performanceLevel'),
    confirmModal: document.getElementById('confirmModal'),
    modalMessage: document.getElementById('modalMessage'),
    modalConfirmBtn: document.getElementById('modalConfirmBtn'),
    modalCancelBtn: document.getElementById('modalCancelBtn'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage')
};

// ================================
// ESTADO DE LA APLICACIÓN
// ================================
let autoSaveTimer = null;
let modalCallback = null;

// ================================
// INICIALIZACIÓN
// ================================
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Establecer fecha actual por defecto
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('evaluationDate').value = today;
    
    // Cargar datos guardados
    loadFormData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Iniciar autoguardado
    startAutoSave();
    
    // Calcular puntuación inicial
    calculateScore();
    
    console.log('Aplicación inicializada correctamente');
}

// ================================
// EVENT LISTENERS
// ================================
function setupEventListeners() {
    // Botones principales
    elements.saveBtn.addEventListener('click', handleManualSave);
    elements.clearBtn.addEventListener('click', handleClearForm);
    elements.downloadPdfBtn.addEventListener('click', handleDownloadPDF);
    
    // Modal
    elements.modalCancelBtn.addEventListener('click', closeModal);
    
    // Formulario - inputs de texto
    elements.form.querySelectorAll('input[type="text"], input[type="date"], input[type="time"], select, textarea').forEach(input => {
        input.addEventListener('input', handleInputChange);
        input.addEventListener('blur', validateField);
    });
    
    // Formulario - radio buttons de evaluación
    elements.form.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            calculateScore();
            markFormAsDirty();
        });
    });
    
    // Prevenir pérdida de datos
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

function handleInputChange(e) {
    markFormAsDirty();
    
    // Limpiar mensaje de error al escribir
    const errorElement = document.querySelector(`[data-error="${e.target.id}"]`);
    if (errorElement) {
        errorElement.classList.remove('show');
        e.target.classList.remove('invalid');
    }
}

// ================================
// VALIDACIÓN DE CAMPOS
// ================================
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
        showFieldError(field, 'Este campo es obligatorio');
        return false;
    }
    
    // Validaciones específicas por tipo
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Ingrese un correo electrónico válido');
            return false;
        }
    }
    
    // Si pasa las validaciones
    hideFieldError(field);
    field.classList.add('valid');
    return true;
}

function showFieldError(field, message) {
    field.classList.add('invalid');
    field.classList.remove('valid');
    
    const errorElement = document.querySelector(`[data-error="${field.id}"]`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideFieldError(field) {
    field.classList.remove('invalid');
    
    const errorElement = document.querySelector(`[data-error="${field.id}"]`);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function validateForm() {
    let isValid = true;
    const requiredFields = elements.form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            const radioGroup = elements.form.querySelectorAll(`[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            
            if (!isChecked) {
                isValid = false;
                const parentItem = field.closest('.evaluation-item');
                if (parentItem) {
                    parentItem.style.border = '2px solid var(--accent-color)';
                    setTimeout(() => {
                        parentItem.style.border = '';
                    }, 3000);
                }
            }
        } else {
            if (!field.value.trim()) {
                showFieldError(field, 'Este campo es obligatorio');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// ================================
// CÁLCULO DE PUNTUACIÓN
// ================================
function calculateScore() {
    const criteriaNames = [
        'communication',
        'presence',
        'problemSolving',
        'teamwork',
        'safety',
        'development',
        'planning',
        'roleModel'
    ];
    
    let totalScore = 0;
    let criteriaCount = 0;
    
    criteriaNames.forEach(name => {
        const selectedRadio = elements.form.querySelector(`input[name="${name}"]:checked`);
        if (selectedRadio) {
            const value = parseInt(selectedRadio.value);
            if (value > 0) { // No contar N/A (valor 0)
                totalScore += value;
                criteriaCount++;
            }
        }
    });
    
    const maxScore = criteriaCount * 5;
    const average = criteriaCount > 0 ? (totalScore / criteriaCount).toFixed(1) : 0;
    
    // Actualizar UI
    elements.totalScore.textContent = totalScore;
    elements.averageScore.textContent = average;
    
    // Actualizar nivel de desempeño
    updatePerformanceLevel(parseFloat(average));
}

function updatePerformanceLevel(average) {
    const badge = elements.performanceLevel;
    let level = '';
    let className = '';
    
    if (average === 0) {
        level = 'Sin evaluar';
        className = 'na';
    } else if (average >= 4.5) {
        level = '⭐ Excelente';
        className = 'excellent';
    } else if (average >= 3.5) {
        level = '👍 Bueno';
        className = 'good';
    } else if (average >= 2.5) {
        level = '⚠️ Regular';
        className = 'regular';
    } else if (average >= 1.5) {
        level = '⚠️ Deficiente';
        className = 'poor';
    } else {
        level = '🔴 Crítico';
        className = 'critical';
    }
    
    badge.textContent = level;
    badge.className = 'performance-badge ' + className;
}

// ================================
// PERSISTENCIA DE DATOS
// ================================
function saveFormData() {
    const formData = new FormData(elements.form);
    const data = {};
    
    // Guardar todos los campos
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Guardar timestamp
    data.lastSaved = new Date().toISOString();
    
    try {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error al guardar datos:', error);
        showToast('Error al guardar los datos', 'error');
        return false;
    }
}

function loadFormData() {
    try {
        const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
        
        if (!savedData) {
            console.log('No hay datos guardados previamente');
            return;
        }
        
        const data = JSON.parse(savedData);
        
        // Restaurar campos de texto, select, textarea
        Object.keys(data).forEach(key => {
            if (key === 'lastSaved') return;
            
            const field = elements.form.querySelector(`[name="${key}"]`);
            
            if (field) {
                if (field.type === 'radio') {
                    const radio = elements.form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radio) {
                        radio.checked = true;
                    }
                } else {
                    field.value = data[key];
                }
            }
        });
        
        // Recalcular puntuación
        calculateScore();
        
        // Mostrar mensaje de carga
        if (data.lastSaved) {
            const lastSaved = new Date(data.lastSaved);
            showToast(`Borrador cargado (${formatDate(lastSaved)})`, 'info');
        }
        
        console.log('Datos cargados correctamente');
    } catch (error) {
        console.error('Error al cargar datos:', error);
        showToast('Error al cargar el borrador guardado', 'error');
    }
}

function clearFormData() {
    try {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error al limpiar datos:', error);
        return false;
    }
}

// ================================
// AUTOGUARDADO
// ================================
function startAutoSave() {
    autoSaveTimer = setInterval(() => {
        if (hasUnsavedChanges()) {
            saveFormData();
            showAutoSaveIndicator();
        }
    }, CONFIG.AUTO_SAVE_INTERVAL);
}

function stopAutoSave() {
    if (autoSaveTimer) {
        clearInterval(autoSaveTimer);
        autoSaveTimer = null;
    }
}

function showAutoSaveIndicator() {
    elements.autoSaveIndicator.classList.add('show');
    
    setTimeout(() => {
        elements.autoSaveIndicator.classList.remove('show');
    }, 2000);
}

// ================================
// MANEJO DE ACCIONES
// ================================
function handleManualSave() {
    if (saveFormData()) {
        showToast('✓ Borrador guardado correctamente', 'success');
    }
}

function handleClearForm() {
    showConfirmModal(
        '¿Está seguro de que desea limpiar el formulario? Se perderán todos los datos ingresados.',
        () => {
            elements.form.reset();
            clearFormData();
            calculateScore();
            
            // Limpiar validaciones
            elements.form.querySelectorAll('.valid, .invalid').forEach(field => {
                field.classList.remove('valid', 'invalid');
            });
            
            // Establecer fecha actual
            const today = new Date().toISOString().split('T')[0];
            document.getElementById('evaluationDate').value = today;
            
            showToast('Formulario limpiado', 'info');
            closeModal();
        }
    );
}

async function handleDownloadPDF() {
    // Validar formulario antes de generar PDF
    if (!validateForm()) {
        showToast('⚠️ Complete todos los campos obligatorios antes de descargar el PDF', 'error');
        return;
    }
    
    // Mostrar indicador de carga
    elements.downloadPdfBtn.disabled = true;
    elements.downloadPdfBtn.innerHTML = '<span class="btn-icon">⏳</span> Generando PDF...';
    
    try {
        await generatePDF();
        showToast('✓ PDF descargado correctamente', 'success');
    } catch (error) {
        console.error('Error al generar PDF:', error);
        showToast('Error al generar el PDF', 'error');
    } finally {
        elements.downloadPdfBtn.disabled = false;
        elements.downloadPdfBtn.innerHTML = '<span class="btn-icon">📄</span> Descargar PDF';
    }
}

// ================================
// GENERACIÓN DE PDF
// ================================
async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    let yPosition = margin;
    
    // Colores
    const primaryColor = [44, 62, 80];
    const secondaryColor = [52, 152, 219];
    const textColor = [50, 50, 50];
    const lightGray = [240, 240, 240];
    
    // Función auxiliar para agregar nueva página
    function checkPageBreak(requiredHeight) {
        if (yPosition + requiredHeight > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    }
    
    // ENCABEZADO
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('Lista de Verificación', margin, 20);
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text('Liderazgo en Terreno', margin, 30);
    
    yPosition = 50;
    
    // INFORMACIÓN GENERAL
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Información General', margin, yPosition);
    yPosition += 8;
    
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
    
    const generalInfo = [
        { label: 'Evaluador', value: document.getElementById('evaluatorName').value },
        { label: 'Cargo Evaluador', value: document.getElementById('evaluatorPosition').value },
        { label: 'Líder Evaluado', value: document.getElementById('leaderName').value },
        { label: 'Cargo Líder', value: document.getElementById('leaderPosition').value },
        { label: 'Área/Departamento', value: document.getElementById('area').selectedOptions[0].text },
        { label: 'Ubicación', value: document.getElementById('location').value },
        { label: 'Fecha Evaluación', value: formatDate(new Date(document.getElementById('evaluationDate').value)) },
        { label: 'Hora', value: document.getElementById('evaluationTime').value || 'No especificada' }
    ];
    
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    
    generalInfo.forEach(item => {
        checkPageBreak(10);
        doc.setFont(undefined, 'bold');
        doc.text(item.label + ':', margin, yPosition);
        doc.setFont(undefined, 'normal');
        doc.text(item.value, margin + 40, yPosition);
        yPosition += 6;
    });
    
    yPosition += 10;
    
    // CRITERIOS DE EVALUACIÓN
    const criteria = [
        { name: 'communication', title: '1. Comunicación Efectiva', comments: 'communicationComments' },
        { name: 'presence', title: '2. Presencia Activa en Terreno', comments: 'presenceComments' },
        { name: 'problemSolving', title: '3. Resolución de Problemas', comments: 'problemSolvingComments' },
        { name: 'teamwork', title: '4. Fomento del Trabajo en Equipo', comments: 'teamworkComments' },
        { name: 'safety', title: '5. Seguridad y Cumplimiento Normativo', comments: 'safetyComments' },
        { name: 'development', title: '6. Desarrollo y Capacitación del Equipo', comments: 'developmentComments' },
        { name: 'planning', title: '7. Planificación y Organización', comments: 'planningComments' },
        { name: 'roleModel', title: '8. Liderazgo por Ejemplo', comments: 'roleModelComments' }
    ];
    
    checkPageBreak(20);
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Criterios de Evaluación', margin, yPosition);
    yPosition += 10;
    
    criteria.forEach(criterion => {
        checkPageBreak(30);
        
        // Título del criterio
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(criterion.title, margin, yPosition);
        yPosition += 6;
        
        // Puntuación
        const selectedRadio = document.querySelector(`input[name="${criterion.name}"]:checked`);
        const score = selectedRadio ? selectedRadio.value : 'No evaluado';
        const scoreText = getScoreText(score);
        
        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text('Puntuación:', margin + 5, yPosition);
        doc.setFont(undefined, 'normal');
        doc.text(scoreText, margin + 30, yPosition);
        yPosition += 6;
        
        // Observaciones
        const comments = document.getElementById(criterion.comments).value;
        if (comments) {
            checkPageBreak(15);
            doc.setFont(undefined, 'bold');
            doc.text('Observaciones:', margin + 5, yPosition);
            yPosition += 5;
            
            doc.setFont(undefined, 'normal');
            const splitComments = doc.splitTextToSize(comments, contentWidth - 10);
            splitComments.forEach(line => {
                checkPageBreak(5);
                doc.text(line, margin + 5, yPosition);
                yPosition += 5;
            });
        }
        
        yPosition += 5;
        
        // Línea separadora
        doc.setDrawColor(...lightGray);
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;
    });
    
    // RESUMEN
    checkPageBreak(40);
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('Resumen y Plan de Acción', margin, yPosition);
    yPosition += 10;
    
    // Puntuación total
    const totalScore = elements.totalScore.textContent;
    const averageScore = elements.averageScore.textContent;
    const performanceLevel = elements.performanceLevel.textContent;
    
    doc.setFillColor(...lightGray);
    doc.roundedRect(margin, yPosition, contentWidth, 25, 3, 3, 'F');
    
    doc.setTextColor(...primaryColor);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Puntuación Total:', margin + 5, yPosition + 8);
    doc.setFontSize(16);
    doc.text(totalScore + ' / 40', margin + 50, yPosition + 8);
    
    doc.setFontSize(12);
    doc.text('Promedio:', margin + 5, yPosition + 18);
    doc.setFontSize(16);
    doc.text(averageScore + ' / 5.0', margin + 50, yPosition + 18);
    
    doc.setFontSize(12);
    doc.text('Nivel:', margin + 120, yPosition + 13);
    doc.setFontSize(14);
    doc.text(performanceLevel, margin + 140, yPosition + 13);
    
    yPosition += 30;
    
    // Fortalezas
    const strengths = document.getElementById('strengths').value;
    if (strengths) {
        checkPageBreak(20);
        doc.setTextColor(...textColor);
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.text('Fortalezas Identificadas:', margin, yPosition);
        yPosition += 6;
        
        doc.setFont(undefined, 'normal');
        const splitStrengths = doc.splitTextToSize(strengths, contentWidth);
        splitStrengths.forEach(line => {
            checkPageBreak(5);
            doc.text(line, margin, yPosition);
            yPosition += 5;
        });
        yPosition += 5;
    }
    
    // Áreas de mejora
    const areasImprovement = document.getElementById('areasImprovement').value;
    if (areasImprovement) {
        checkPageBreak(20);
        doc.setFont(undefined, 'bold');
        doc.text('Áreas de Mejora:', margin, yPosition);
        yPosition += 6;
        
        doc.setFont(undefined, 'normal');
        const splitAreas = doc.splitTextToSize(areasImprovement, contentWidth);
        splitAreas.forEach(line => {
            checkPageBreak(5);
            doc.text(line, margin, yPosition);
            yPosition += 5;
        });
        yPosition += 5;
    }
    
    // Plan de acción
    const actionPlan = document.getElementById('actionPlan').value;
    if (actionPlan) {
        checkPageBreak(20);
        doc.setFont(undefined, 'bold');
        doc.text('Plan de Acción Propuesto:', margin, yPosition);
        yPosition += 6;
        
        doc.setFont(undefined, 'normal');
        const splitPlan = doc.splitTextToSize(actionPlan, contentWidth);
        splitPlan.forEach(line => {
            checkPageBreak(5);
            doc.text(line, margin, yPosition);
            yPosition += 5;
        });
    }
    
    // PIE DE PÁGINA EN CADA PÁGINA
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(...textColor);
        doc.setFont(undefined, 'normal');
        doc.text(
            `Generado el ${formatDateTime(new Date())}`,
            margin,
            pageHeight - 10
        );
        doc.text(
            `Página ${i} de ${totalPages}`,
            pageWidth - margin - 20,
            pageHeight - 10
        );
    }
    
    // Descargar PDF
    const filename = generateFilename();
    doc.save(filename);
}

function getScoreText(score) {
    const scoreMap = {
        '5': '⭐ Excelente (5)',
        '4': '👍 Bueno (4)',
        '3': '⚠️ Regular (3)',
        '2': '⚠️ Deficiente (2)',
        '1': '🔴 Crítico (1)',
        '0': 'N/A'
    };
    return scoreMap[score] || 'No evaluado';
}

function generateFilename() {
    const leaderName = document.getElementById('leaderName').value || 'Sin_Nombre';
    const date = document.getElementById('evaluationDate').value || new Date().toISOString().split('T')[0];
    const sanitizedName = leaderName.replace(/[^a-zA-Z0-9]/g, '_');
    return `${CONFIG.PDF_FILENAME_PREFIX}${sanitizedName}_${date}.pdf`;
}

// ================================
// MODAL
// ================================
function showConfirmModal(message, callback) {
    elements.modalMessage.textContent = message;
    modalCallback = callback;
    elements.confirmModal.classList.add('show');
    
    // Configurar el botón de confirmar
    elements.modalConfirmBtn.onclick = () => {
        if (modalCallback) {
            modalCallback();
        }
    };
}

function closeModal() {
    elements.confirmModal.classList.remove('show');
    modalCallback = null;
}

// ================================
// TOAST (NOTIFICACIONES)
// ================================
function showToast(message, type = 'info') {
    elements.toastMessage.textContent = message;
    elements.toast.classList.add('show');
    
    // Cambiar color según el tipo
    if (type === 'success') {
        elements.toast.style.background = '#27ae60';
    } else if (type === 'error') {
        elements.toast.style.background = '#e74c3c';
    } else if (type === 'warning') {
        elements.toast.style.background = '#f39c12';
    } else {
        elements.toast.style.background = '#3498db';
    }
    
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, CONFIG.TOAST_DURATION);
}

// ================================
// UTILIDADES
// ================================
function hasUnsavedChanges() {
    // Verificar si hay cambios desde la última carga
    const currentData = new FormData(elements.form);
    const savedData = localStorage.getItem(CONFIG.STORAGE_KEY);
    
    if (!savedData) return true;
    
    try {
        const saved = JSON.parse(savedData);
        
        for (let [key, value] of currentData.entries()) {
            if (saved[key] !== value) {
                return true;
            }
        }
        
        return false;
    } catch {
        return true;
    }
}

function markFormAsDirty() {
    elements.statusBadge.querySelector('span:last-child').textContent = 'Editando...';
    elements.statusBadge.querySelector('.status-dot').style.background = '#f39c12';
}

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function formatDateTime(date) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
}

// ================================
// MANEJO DE ERRORES GLOBAL
// ================================
window.addEventListener('error', (e) => {
    console.error('Error global capturado:', e.error);
    showToast('Ha ocurrido un error. Por favor, recargue la página.', 'error');
});

// ================================
// EXPORTAR FUNCIONES PARA USO EXTERNO
// ================================
window.leadershipApp = {
    saveFormData,
    loadFormData,
    clearFormData,
    validateForm,
    calculateScore,
    showToast
};

console.log('app.js cargado correctamente');
