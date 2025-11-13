// ================================
// CONFIGURACIÓN GLOBAL - PUMA
// ================================
const CONFIG = {
    AUTO_SAVE_INTERVAL: 30000, // 30 segundos
    STORAGE_KEY: 'pumaLeadershipFormData',
    TOAST_DURATION: 3000,
    PDF_FILENAME_PREFIX: 'PUMA_Liderazgo_Terreno_'
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
    // Establecer fecha y hora actual por defecto
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const timeStr = today.toTimeString().split(' ')[0].substring(0, 5);
    
    document.getElementById('visitDate').value = dateStr;
    document.getElementById('visitTime').value = timeStr;
    
    // Cargar datos guardados
    loadFormData();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Iniciar autoguardado
    startAutoSave();
    
    console.log('Aplicación PUMA inicializada correctamente');
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
    
    // Formulario - todos los campos
    elements.form.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', markFormAsDirty);
        input.addEventListener('change', markFormAsDirty);
    });
    
    // Prevenir pérdida de datos
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges()) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
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
        
        // Restaurar campos
        Object.keys(data).forEach(key => {
            if (key === 'lastSaved') return;
            
            const field = elements.form.querySelector(`[name="${key}"]`);
            
            if (field) {
                if (field.type === 'radio') {
                    const radio = elements.form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else if (field.type === 'checkbox') {
                    field.checked = data[key] === 'on';
                } else {
                    field.value = data[key];
                }
            }
        });
        
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
            
            // Restablecer fecha y hora
            const today = new Date();
            document.getElementById('visitDate').value = today.toISOString().split('T')[0];
            document.getElementById('visitTime').value = today.toTimeString().split(' ')[0].substring(0, 5);
            
            showToast('Formulario limpiado', 'info');
            closeModal();
        }
    );
}

async function handleDownloadPDF() {
    // Validar campos requeridos
    const requiredFields = elements.form.querySelectorAll('[required]');
    let allValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim() && field.type !== 'radio') {
            allValid = false;
            field.style.borderColor = 'var(--accent-color)';
        } else if (field.type === 'radio') {
            const radioGroup = elements.form.querySelectorAll(`[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) {
                allValid = false;
            }
        }
    });
    
    if (!allValid) {
        showToast('⚠️ Complete todos los campos obligatorios (*)  antes de descargar el PDF', 'error');
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
    
    // Colores PUMA
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
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('🐆 PUMA', margin, 15);
    
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Programa de Cultura de Seguridad', margin, 27);
    
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text('Liderazgo Visible en Terreno', margin, 38);
    
    yPosition = 60;
    
    // SECCIÓN 1: PLANIFICACIÓN PREVIA
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('1. Planificación Previa', margin, yPosition);
    yPosition += 8;
    
    doc.setDrawColor(...lightGray);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 5;
    
    const section1Data = [
        { label: 'Nombre de quien visita', value: document.getElementById('visitorName').value },
        { label: 'Fecha', value: formatDate(new Date(document.getElementById('visitDate').value)) },
        { label: 'Hora', value: document.getElementById('visitTime').value },
        { label: 'Centro de trabajo', value: document.getElementById('workCenter').value },
        { label: 'Operación/lugar a visitar', value: document.getElementById('operationLocation').value },
        { label: 'Riesgo crítico a observar', value: document.getElementById('criticalRisk').value }
    ];
    
    doc.setTextColor(...textColor);
    doc.setFontSize(10);
    
    section1Data.forEach(item => {
        checkPageBreak(10);
        doc.setFont(undefined, 'bold');
        doc.text(item.label + ':', margin, yPosition);
        doc.setFont(undefined, 'normal');
        const splitText = doc.splitTextToSize(item.value, contentWidth - 60);
        doc.text(splitText, margin + 55, yPosition);
        yPosition += 5 * splitText.length + 2;
    });
    
    // Foco de la visita
    checkPageBreak(15);
    doc.setFont(undefined, 'bold');
    doc.text('Foco u objetivo de la visita:', margin, yPosition);
    yPosition += 6;
    
    const visitFocus = document.querySelector('input[name="visitFocus"]:checked');
    if (visitFocus) {
        const focusTexts = {
            'indagacion': '1. De indagación general',
            'implementacion': '2. De implementación de intervenciones',
            'critico': '3. De foco crítico',
            'emergente': '4. De sospecha de riesgo emergente'
        };
        doc.setFont(undefined, 'normal');
        doc.text(focusTexts[visitFocus.value] || visitFocus.value, margin + 5, yPosition);
        yPosition += 8;
    }
    
    yPosition += 10;
    
    // SECCIÓN 2: DURANTE LA VISITA
    checkPageBreak(20);
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('2. Durante la Visita', margin, yPosition);
    yPosition += 10;
    
    // Función para agregar preguntas y respuestas
    function addQuestionSection(title, questions) {
        checkPageBreak(15);
        doc.setTextColor(...secondaryColor);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(title, margin, yPosition);
        yPosition += 8;
        
        questions.forEach(q => {
            const answer = document.querySelector(`[name="${q.name}"]`)?.value;
            if (answer && answer.trim()) {
                checkPageBreak(15);
                doc.setTextColor(...textColor);
                doc.setFontSize(10);
                doc.setFont(undefined, 'bold');
                const questionText = doc.splitTextToSize(`${q.num}. ${q.text}`, contentWidth - 5);
                doc.text(questionText, margin + 3, yPosition);
                yPosition += 5 * questionText.length;
                
                doc.setFont(undefined, 'normal');
                const answerText = doc.splitTextToSize(answer, contentWidth - 5);
                doc.text(answerText, margin + 3, yPosition);
                yPosition += 5 * answerText.length + 5;
            }
        });
        
        yPosition += 5;
    }
    
    // 2.1 Indagación General
    addQuestionSection('2.1 Indagación General', [
        { num: 1, name: 'q2_1_1', text: '¿Cómo evaluaría la seguridad de su lugar de trabajo?' },
        { num: 2, name: 'q2_1_2', text: '¿Qué aspectos consideran podrían mantenerse?' },
        { num: 3, name: 'q2_1_3', text: '¿Qué considera podría cambiar?' },
        { num: 4, name: 'q2_1_4', text: '¿Hay algún riesgo no controlado?' },
        { num: 5, name: 'q2_1_5', text: '¿Se realiza el HCR/ART?' },
        { num: 6, name: 'q2_1_6', text: '¿Se aplican las Reglas por la Vida de un PUMA?' },
        { num: 7, name: 'q2_1_7', text: '¿Se realiza el MOT?' },
        { num: 8, name: 'q2_1_8', text: '¿Cómo cree podría mejorarse?' },
        { num: 9, name: 'q2_1_9', text: '¿Hay alguna acción que podría generar un accidente?' }
    ]);
    
    // 2.2 Verificación de Implementación
    addQuestionSection('2.2 Verificación de Implementación', [
        { num: 1, name: 'q2_2_1', text: '¿Cómo evaluaría la efectividad de la medida implementada?' },
        { num: 2, name: 'q2_2_2', text: '¿Logra controlar todos los riesgos asociados?' },
        { num: 3, name: 'q2_2_3', text: '¿Esta situación resuelve el riesgo detectado?' },
        { num: 4, name: 'q2_2_4', text: '¿Hay otra situación que podría generar riesgo?' },
        { num: '4.1', name: 'q2_2_4_1', text: '¿Cómo podría mejorarse?' },
        { num: 5, name: 'q2_2_5', text: '¿Cómo mejorar la seguridad en general?' }
    ]);
    
    // 2.3 De Foco Crítico
    addQuestionSection('2.3 De Foco Crítico', [
        { num: 1, name: 'q2_3_1', text: '¿Qué operación considera crítica?' },
        { num: 2, name: 'q2_3_2', text: '¿Se analizan en el HCR/ART y MOT?' },
        { num: 3, name: 'q2_3_3', text: '¿Cuáles son los riesgos críticos?' },
        { num: 4, name: 'q2_3_4', text: '¿Hay alguna situación no controlada?' },
        { num: 5, name: 'q2_3_5', text: '¿Qué mejoras considera?' },
        { num: 6, name: 'q2_3_6', text: '¿Ha observado riesgos en otras operaciones?' }
    ]);
    
    // 2.4 De Sospecha de Riesgo Emergente
    addQuestionSection('2.4 De Sospecha de Riesgo Emergente', [
        { num: 1, name: 'q2_4_1', text: '¿Qué riesgos identifica?' },
        { num: 2, name: 'q2_4_2', text: '¿Cómo es el control de riesgos?' },
        { num: 3, name: 'q2_4_3', text: '¿Cuáles son los riesgos críticos?' },
        { num: 4, name: 'q2_4_4', text: '¿Cómo mejorar la seguridad?' },
        { num: 5, name: 'q2_4_5', text: '¿Hay controles que no funcionan?' }
    ]);
    
    // Actitud
    checkPageBreak(15);
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Actitud y Percepción', margin, yPosition);
    yPosition += 8;
    
    const intervieweeAttitude = document.querySelector('input[name="intervieweeAttitude"]:checked');
    if (intervieweeAttitude) {
        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.text('Actitud del entrevistado: ' + intervieweeAttitude.value, margin + 3, yPosition);
        yPosition += 6;
    }
    
    const interviewerFeeling = document.querySelector('input[name="interviewerFeeling"]:checked');
    if (interviewerFeeling) {
        doc.text('Sentimiento del entrevistador: ' + interviewerFeeling.value, margin + 3, yPosition);
        yPosition += 8;
    }
    
    // SECCIÓN 3: DESPUÉS DE LA VISITA
    checkPageBreak(20);
    doc.setTextColor(...primaryColor);
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('3. Después de la Visita', margin, yPosition);
    yPosition += 10;
    
    // Tabla 1: Matriz de Hallazgos
    checkPageBreak(15);
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('3.1 Matriz de Hallazgos', margin, yPosition);
    yPosition += 8;
    
    // Obtener filas de hallazgos
    const findingsTable = document.getElementById('findingsTableBody');
    const findingsRows = findingsTable.querySelectorAll('tr');
    let findingsCount = 0;
    
    findingsRows.forEach((row, index) => {
        const cells = row.querySelectorAll('textarea');
        const hasData = Array.from(cells).some(cell => cell.value.trim());
        
        if (hasData) {
            findingsCount++;
            checkPageBreak(30);
            
            doc.setTextColor(...textColor);
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text(`Hallazgo ${findingsCount}:`, margin + 3, yPosition);
            yPosition += 5;
            
            doc.setFont(undefined, 'normal');
            
            // Operación/actividad
            if (cells[0]?.value.trim()) {
                doc.setFont(undefined, 'bold');
                doc.text('Operación/actividad:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const text = doc.splitTextToSize(cells[0].value, contentWidth - 10);
                doc.text(text, margin + 5, yPosition + 4);
                yPosition += 4 + (text.length * 4);
            }
            
            // Riesgo asociado
            if (cells[1]?.value.trim()) {
                doc.setFont(undefined, 'bold');
                doc.text('Riesgo asociado:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const text = doc.splitTextToSize(cells[1].value, contentWidth - 10);
                doc.text(text, margin + 5, yPosition + 4);
                yPosition += 4 + (text.length * 4);
            }
            
            // Fallo latente
            if (cells[2]?.value.trim()) {
                doc.setFont(undefined, 'bold');
                doc.text('Fallo latente:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const text = doc.splitTextToSize(cells[2].value, contentWidth - 10);
                doc.text(text, margin + 5, yPosition + 4);
                yPosition += 4 + (text.length * 4);
            }
            
            // Mejoras propuestas
            if (cells[3]?.value.trim()) {
                doc.setFont(undefined, 'bold');
                doc.text('Mejoras propuestas:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const text = doc.splitTextToSize(cells[3].value, contentWidth - 10);
                doc.text(text, margin + 5, yPosition + 4);
                yPosition += 4 + (text.length * 4);
            }
            
            // Derivado a
            if (cells[4]?.value.trim()) {
                doc.setFont(undefined, 'bold');
                doc.text('Derivado a:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const text = doc.splitTextToSize(cells[4].value, contentWidth - 10);
                doc.text(text, margin + 5, yPosition + 4);
                yPosition += 4 + (text.length * 4);
            }
            
            yPosition += 3;
            
            // Línea separadora
            doc.setDrawColor(...lightGray);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 5;
        }
    });
    
    if (findingsCount === 0) {
        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text('No se registraron hallazgos', margin + 3, yPosition);
        yPosition += 8;
    }
    
    // Tabla 2: Plan de Acción
    checkPageBreak(15);
    doc.setTextColor(...secondaryColor);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('3.2 Plan de Acción', margin, yPosition);
    yPosition += 8;
    
    // Obtener filas de plan de acción
    const actionTable = document.getElementById('actionPlanTableBody');
    const actionRows = actionTable.querySelectorAll('tr');
    let actionsCount = 0;
    
    actionRows.forEach((row, index) => {
        const textareas = row.querySelectorAll('textarea');
        const inputs = row.querySelectorAll('input');
        const hasData = Array.from(textareas).some(cell => cell.value.trim()) || 
                       Array.from(inputs).some(input => input.value.trim());
        
        if (hasData) {
            actionsCount++;
            checkPageBreak(25);
            
            doc.setTextColor(...textColor);
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text(`Acción ${actionsCount}:`, margin + 3, yPosition);
            yPosition += 5;
            
            doc.setFont(undefined, 'normal');
            
            // Riesgo crítico
            if (textareas[0]?.value.trim()) {
                doc.setFont(undefined, 'bold');
                doc.text('Riesgo crítico:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const text = doc.splitTextToSize(textareas[0].value, contentWidth - 10);
                doc.text(text, margin + 5, yPosition + 4);
                yPosition += 4 + (text.length * 4);
            }
            
            // Solución propuesta
            if (textareas[1]?.value.trim()) {
                doc.setFont(undefined, 'bold');
                doc.text('Solución propuesta:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const text = doc.splitTextToSize(textareas[1].value, contentWidth - 10);
                doc.text(text, margin + 5, yPosition + 4);
                yPosition += 4 + (text.length * 4);
            }
            
            // Responsable
            if (inputs[0]?.value.trim()) {
                checkPageBreak(5);
                doc.setFont(undefined, 'bold');
                doc.text('Responsable:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const text = doc.splitTextToSize(inputs[0].value, contentWidth - 10);
                doc.text(text, margin + 5, yPosition + 4);
                yPosition += 4 + (text.length * 4) + 1;
            }
            
            // Plazo
            if (inputs[1]?.value.trim()) {
                checkPageBreak(5);
                doc.setFont(undefined, 'bold');
                doc.text('Plazo:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const deadline = new Date(inputs[1].value);
                doc.text(formatDate(deadline), margin + 5, yPosition + 4);
                yPosition += 8;
            }
            
            // Retroalimentación
            if (inputs[2]?.value.trim()) {
                checkPageBreak(5);
                doc.setFont(undefined, 'bold');
                doc.text('Retroalimentación:', margin + 5, yPosition);
                doc.setFont(undefined, 'normal');
                const feedback = new Date(inputs[2].value);
                doc.text(formatDate(feedback), margin + 5, yPosition + 4);
                yPosition += 8;
            }
            
            yPosition += 3;
            
            // Línea separadora
            doc.setDrawColor(...lightGray);
            doc.line(margin, yPosition, pageWidth - margin, yPosition);
            yPosition += 5;
        }
    });
    
    if (actionsCount === 0) {
        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        doc.setFont(undefined, 'italic');
        doc.text('No se definieron acciones', margin + 3, yPosition);
        yPosition += 8;
    }
    
    // PIE DE PÁGINA
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

function generateFilename() {
    const visitorName = document.getElementById('visitorName').value || 'Sin_Nombre';
    const date = document.getElementById('visitDate').value || new Date().toISOString().split('T')[0];
    const sanitizedName = visitorName.replace(/[^a-zA-Z0-9]/g, '_');
    return `${CONFIG.PDF_FILENAME_PREFIX}${sanitizedName}_${date}.pdf`;
}

// ================================
// MODAL
// ================================
function showConfirmModal(message, callback) {
    elements.modalMessage.textContent = message;
    modalCallback = callback;
    elements.confirmModal.classList.add('show');
    
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

console.log('app_puma.js cargado correctamente');
