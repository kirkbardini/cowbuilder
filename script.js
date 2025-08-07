// Global variables
let currentQuestionIndex = 0;
let questions = [];
let draggedElement = null;
let dropZones = [];

// Language translations
const languageTranslations = {
    en: {
        footnote: "View ad to continue",
        namePlaceholder: "Your name",
        emailPlaceholder: "Your email",
        phonePlaceholder: "Your phone"
    },
    pt: {
        footnote: "Assista a um anúncio para continuar",
        namePlaceholder: "Seu nome",
        emailPlaceholder: "Seu email",
        phonePlaceholder: "Seu telefone"
    },
    it: {
        footnote: "Visualizza l'annuncio per continuare",
        namePlaceholder: "Il tuo nome",
        emailPlaceholder: "La tua email",
        phonePlaceholder: "Il tuo telefono"
    },
    es: {
        footnote: "Ver anuncio para continuar",
        namePlaceholder: "Tu nombre",
        emailPlaceholder: "Tu email",
        phonePlaceholder: "Tu teléfono"
    },
    de: {
        footnote: "Anzeige anzeigen um fortzufahren",
        namePlaceholder: "Ihr Name",
        emailPlaceholder: "Ihre E-Mail",
        phonePlaceholder: "Ihr Telefon"
    },
    fr: {
        footnote: "Voir l'annonce pour continuer",
        namePlaceholder: "Votre nom",
        emailPlaceholder: "Votre email",
        phonePlaceholder: "Votre téléphone"
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    setupTheme();
    setupColorInputs();
    setupColorValidation();
    setupSubscribeFormToggle();
    setupCharCounters();
    setupDragAndDrop();
    
    // Initialize viewer with default data
    updateViewer();
    
    // Set up real-time updates
    setupRealTimeUpdates();
});

// Change language function
function changeLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    const selectedLanguage = languageSelect.value;
    const translations = languageTranslations[selectedLanguage];
    
    if (translations) {
        // Update footnote
        const footnoteInput = document.getElementById('footnote');
        if (footnoteInput) {
            footnoteInput.value = translations.footnote;
        }
        
        // Update placeholders
        const namePlaceholderInput = document.getElementById('namePlaceholder');
        if (namePlaceholderInput) {
            namePlaceholderInput.value = translations.namePlaceholder;
        }
        
        const emailPlaceholderInput = document.getElementById('emailPlaceholder');
        if (emailPlaceholderInput) {
            emailPlaceholderInput.value = translations.emailPlaceholder;
        }
        
        const phonePlaceholderInput = document.getElementById('phonePlaceholder');
        if (phonePlaceholderInput) {
            phonePlaceholderInput.value = translations.phonePlaceholder;
        }
        
        // Update viewer to reflect changes
        updateViewer();
    }
}

// Color input setup
function setupColorInputs() {
    const colorInputs = [
        { color: 'buttonColor', text: 'buttonColorText' },
        { color: 'progressColor', text: 'progressColorText' },
        { color: 'buttonTextColor', text: 'buttonTextColorText' }
    ];

    colorInputs.forEach(input => {
        const colorInput = document.getElementById(input.color);
        const textInput = document.getElementById(input.text);

        if (colorInput && textInput) {
            colorInput.addEventListener('input', function() {
                textInput.value = this.value;
                updateViewer();
            });

            textInput.addEventListener('input', function() {
                colorInput.value = this.value;
                updateViewer();
            });
        }
    });
}

// Color validation
function setupColorValidation() {
    const textInputs = ['buttonColorText', 'progressColorText', 'buttonTextColorText'];
    
    textInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                const value = this.value;
                if (value.match(/^#[0-9A-Fa-f]{6}$/)) {
                    this.style.borderColor = '#10b981';
                } else {
                    this.style.borderColor = '#ef4444';
                }
                updateViewer();
            });
        }
    });
}

// Subscribe form toggle setup
function setupSubscribeFormToggle() {
    const toggle = document.getElementById('subscribeFormEnabled');
    const fields = document.getElementById('subscribeFields');
    
    if (toggle && fields) {
        // Set initial state
        fields.style.display = toggle.checked ? 'grid' : 'none';
        fields.style.opacity = toggle.checked ? '1' : '0.5';
        updateFormButtonState(toggle.checked);
        
        toggle.addEventListener('change', function() {
            fields.style.display = this.checked ? 'grid' : 'none';
            fields.style.opacity = this.checked ? '1' : '0.5';
            updateFormButtonState(this.checked);
            updateViewer();
        });
    }
}

// Update form button state
function updateFormButtonState(isEnabled) {
    const formButtons = document.querySelectorAll('.btn-viewer');
    formButtons.forEach(btn => {
        if (btn.textContent === 'Form') {
            if (isEnabled) {
                btn.disabled = false;
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            } else {
                btn.disabled = true;
                btn.style.opacity = '0.5';
                btn.style.cursor = 'not-allowed';
            }
        }
    });
}

// Character counters setup
function setupCharCounters() {
    const inputs = ['cta', 'headline'];
    
    inputs.forEach(id => {
        const input = document.getElementById(id);
        const counter = input?.nextElementSibling;
        
        if (input && counter) {
            updateCharCounter(input, counter);
            input.addEventListener('input', function() {
                updateCharCounter(this, counter);
                updateViewer();
            });
        }
    });
}

// Update character counter
function updateCharCounter(input, counter) {
    const maxLength = input.getAttribute('maxlength');
    const currentLength = input.value.length;
    counter.textContent = `${currentLength}/${maxLength}`;
    
    if (currentLength >= maxLength) {
        counter.classList.add('limit');
    } else {
        counter.classList.remove('limit');
    }
}

// Setup theme functionality
function setupTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Toggle theme function
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Update theme icon
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Setup drag and drop functionality
function setupDragAndDrop() {
    const container = document.getElementById('questionsContainer');
    if (container) {
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);
        container.addEventListener('dragenter', handleDragEnter);
        container.addEventListener('dragleave', handleDragLeave);
        
        // Setup drag events for existing questions
        const existingQuestions = container.querySelectorAll('.question-item');
        existingQuestions.forEach((question, index) => {
            question.draggable = true;
            question.dataset.questionIndex = index;
            setupQuestionDragEvents(question);
            
            // Drag handle removed - not needed
        });
    }
}

// Add question with drag and drop support
function addQuestion() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    
    const questionIndex = container.children.length;
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.draggable = true;
    questionDiv.dataset.questionIndex = questionIndex;
    
    questionDiv.innerHTML = `
        <div class="question-header">
            <span class="question-number">Question ${questionIndex + 1}</span>
            <div class="question-actions">
                <button class="btn-remove" onclick="removeQuestion(this)">Remove</button>
            </div>
        </div>
        <div class="form-group">
            <label>Question Text</label>
            <input type="text" class="question-input" value="" maxlength="50" oninput="updateViewer()">
            <div class="char-counter">0/50</div>
        </div>
        <div class="checkbox-container">
            <input type="checkbox" class="isLoading-checkbox" onchange="updateViewer()">
            <label class="checkbox-label">Loading</label>
        </div>
        <div class="options-container">
            <div class="options-header">
                <span>Options</span>
                <button class="btn-add-option" onclick="addOption(this)">Add Option</button>
            </div>
            <div class="options-list">
                <div class="option-item">
                    <input type="text" class="option-input" value="" maxlength="30" oninput="updateViewer()">
                    <button class="btn-remove-option" onclick="removeOption(this)">×</button>
                </div>
            </div>
        </div>
    `;
    
    container.appendChild(questionDiv);
    
    // Setup drag events for new question
    setupQuestionDragEvents(questionDiv);
    
    updateQuestionCount();
    updateViewer();
    
    // Set up character counter for new question
    const questionInput = questionDiv.querySelector('.question-input');
    const counter = questionInput.nextElementSibling;
    updateCharCounter(questionInput, counter);
    questionInput.addEventListener('input', function() {
        updateCharCounter(this, counter);
        updateViewer();
    });
}

// Setup drag events for a question element
function setupQuestionDragEvents(questionElement) {
    console.log('Setting up drag events for:', questionElement);
    
    // Remove existing events to prevent duplicates
    questionElement.removeEventListener('dragstart', handleDragStart);
    questionElement.removeEventListener('dragend', handleDragEnd);
    questionElement.removeEventListener('dragover', handleDragOver);
    questionElement.removeEventListener('dragenter', handleDragEnter);
    questionElement.removeEventListener('dragleave', handleDragLeave);
    questionElement.removeEventListener('drop', handleDrop);
    
    // Add new events
    questionElement.addEventListener('dragstart', handleDragStart);
    questionElement.addEventListener('dragend', handleDragEnd);
    questionElement.addEventListener('dragover', handleDragOver);
    questionElement.addEventListener('dragenter', handleDragEnter);
    questionElement.addEventListener('dragleave', handleDragLeave);
    questionElement.addEventListener('drop', handleDrop);
    
    console.log('✅ Drag events setup complete for:', questionElement);
}

// Handle drag start
function handleDragStart(e) {
    console.log('=== DRAG START ===');
    console.log('Target:', e.target);
    console.log('Target classList:', e.target.classList);
    
    // Only allow dragging from question-item elements
    if (!e.target.classList.contains('question-item') && !e.target.closest('.question-item')) {
        console.log('❌ Not a question item, preventing drag');
        e.preventDefault();
        return;
    }
    
    draggedElement = e.target.classList.contains('question-item') ? e.target : e.target.closest('.question-item');
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', draggedElement.outerHTML);
    
    // Prevent text selection during drag
    draggedElement.style.userSelect = 'none';
    
    // Add dragging class to container
    const container = document.getElementById('questionsContainer');
    if (container) {
        container.classList.add('dragging');
    }
    
    console.log('✅ Drag started for:', draggedElement);
}

// Handle drag end
function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    e.target.style.userSelect = '';
    draggedElement = null;
    
    // Remove dragging class from container
    const container = document.getElementById('questionsContainer');
    if (container) {
        container.classList.remove('dragging');
    }
    
    // Remove drag-over classes
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
}

// Handle drag over
function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

// Handle drag enter
function handleDragEnter(e) {
    e.preventDefault();
    const targetQuestion = e.target.closest('.question-item');
    if (targetQuestion && targetQuestion !== draggedElement) {
        targetQuestion.classList.add('drag-over');
    }
}

// Handle drag leave
function handleDragLeave(e) {
    const targetQuestion = e.target.closest('.question-item');
    if (targetQuestion) {
        targetQuestion.classList.remove('drag-over');
    }
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('=== DROP DEBUG ===');
    console.log('draggedElement:', draggedElement);
    console.log('e.target:', e.target);
    
    // Find the closest question-item element
    const targetQuestion = e.target.closest('.question-item');
    console.log('targetQuestion:', targetQuestion);
    
    if (!draggedElement || !targetQuestion || targetQuestion === draggedElement) {
        console.log('❌ Basic conditions not met');
        return;
    }
    
    const container = document.getElementById('questionsContainer');
    if (!container) {
        console.log('❌ Container not found');
        return;
    }
    
    const questions = Array.from(container.children);
    const draggedIndex = questions.indexOf(draggedElement);
    const targetIndex = questions.indexOf(targetQuestion);
    
    console.log('Container children count:', questions.length);
    console.log('draggedIndex:', draggedIndex);
    console.log('targetIndex:', targetIndex);
    
    if (draggedIndex === -1 || targetIndex === -1 || draggedIndex === targetIndex) {
        console.log('❌ Reorder conditions not met');
        return;
    }
    
    console.log('✅ Reordering will happen');
    
    // Store the dragged element reference
    const draggedElementRef = draggedElement;
    
    // Remove dragged element
    draggedElement.remove();
    console.log('Dragged element removed from DOM');
    
    // Insert at new position
    if (draggedIndex < targetIndex) {
        targetQuestion.parentNode.insertBefore(draggedElementRef, targetQuestion.nextSibling);
        console.log('Inserted after target');
    } else {
        targetQuestion.parentNode.insertBefore(draggedElementRef, targetQuestion);
        console.log('Inserted before target');
    }
    
    console.log('New DOM order:');
    const newQuestions = Array.from(container.children);
    newQuestions.forEach((q, i) => {
        console.log(`  ${i}: ${q.querySelector('.question-number')?.textContent}`);
    });
    
    // Update question numbers and indices
    updateQuestionNumbers();
    updateViewer();
    
    console.log('✅ Reorder complete');
    
    // Remove drag-over classes
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });
}

// Update question numbers after reordering
function updateQuestionNumbers() {
    const container = document.getElementById('questionsContainer');
    if (!container) return;
    
    const questions = container.querySelectorAll('.question-item');
    questions.forEach((question, index) => {
        const numberElement = question.querySelector('.question-number');
        if (numberElement) {
            numberElement.textContent = `Question ${index + 1}`;
        }
        question.dataset.questionIndex = index;
    });
}

// Remove question
function removeQuestion(button) {
    const questionItem = button.closest('.question-item');
    if (questionItem) {
        questionItem.remove();
        updateQuestionNumbers();
        updateQuestionCount();
        updateViewer();
    }
}

// Add option
function addOption(button) {
    const optionsList = button.closest('.options-container').querySelector('.options-list');
    const optionDiv = document.createElement('div');
    optionDiv.className = 'option-item';
    optionDiv.innerHTML = `
        <input type="text" class="option-input" value="" maxlength="30" oninput="updateViewer()">
        <button class="btn-remove-option" onclick="removeOption(this)">×</button>
    `;
    
    optionsList.appendChild(optionDiv);
    updateViewer();
    
    // Focus on new input
    const newInput = optionDiv.querySelector('.option-input');
    newInput.focus();
}

// Remove option
function removeOption(button) {
    const optionItem = button.closest('.option-item');
    if (optionItem) {
        optionItem.remove();
        updateViewer();
    }
}

// Update question count
function updateQuestionCount() {
    const container = document.getElementById('questionsContainer');
    const count = container ? container.children.length : 0;
    const countElement = document.querySelector('.question-count');
    if (countElement) {
        countElement.textContent = `${count} question${count !== 1 ? 's' : ''}`;
    }
}

// Setup real-time updates
function setupRealTimeUpdates() {
    // Listen for changes in form fields
    const formInputs = document.querySelectorAll('input[type="text"], input[type="checkbox"]');
    formInputs.forEach(input => {
        input.addEventListener('input', updateViewer);
        input.addEventListener('change', updateViewer);
    });
}

// Update viewer with current data
function updateViewer() {
    console.log('🔄 updateViewer called');
    const data = collectFormData();
    console.log('📊 Collected data questions:', data.questions.length);
    updateQuestionView(data);
    updateLoadingView(data);
    updateFormView(data);
}

// Collect form data
function collectFormData() {
    const questions = [];
    const container = document.getElementById('questionsContainer');
    const questionItems = container ? Array.from(container.querySelectorAll('.question-item')) : [];
    
    // Sort questions by their current DOM order to maintain drag-and-drop order
    questionItems.forEach((item, index) => {
        const questionText = item.querySelector('.question-input')?.value || '';
        const isLoading = item.querySelector('.isLoading-checkbox')?.checked || false;
        const options = [];
        
        const optionInputs = item.querySelectorAll('.option-input');
        optionInputs.forEach(input => {
            if (input.value.trim()) {
                options.push(input.value.trim());
            }
        });
        
        questions.push({
            question: questionText,
            options: options,
            isLoading: isLoading
        });
    });
    
    return {
        questions: questions,
        buttonColor: document.getElementById('buttonColor')?.value || '#1D4ED8',
        progressColor: document.getElementById('progressColor')?.value || '#1D4ED8',
        buttonTextColor: document.getElementById('buttonTextColor')?.value || '#ffffff',
        subscribeForm: document.getElementById('subscribeFormEnabled')?.checked ? {
            cta: document.getElementById('cta')?.value || '',
            headline: document.getElementById('headline')?.value || '',
            name_placeholder: document.getElementById('namePlaceholder')?.value || '',
            email_placeholder: document.getElementById('emailPlaceholder')?.value || '',
            phone_placeholder: document.getElementById('phonePlaceholder')?.value || '',
            show_name: document.getElementById('showName')?.checked || false,
            show_email: document.getElementById('showEmail')?.checked || false,
            show_phone: document.getElementById('showPhone')?.checked || false
        } : null,
        footnote: document.getElementById('footnote')?.value || ''
    };
}

// Update question view
function updateQuestionView(data) {
    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const progressFill = document.getElementById('progressFill');
    
    if (data.questions.length > 0) {
        // Find the current question (non-loading questions only)
        const nonLoadingQuestions = data.questions.filter(q => !q.isLoading);
        const currentQuestion = nonLoadingQuestions[currentQuestionIndex] || nonLoadingQuestions[0];
        
        if (currentQuestion && questionText) {
            questionText.textContent = currentQuestion.question || 'Sample Question';
        }
        
        if (currentQuestion && optionsContainer) {
            optionsContainer.innerHTML = '';
            currentQuestion.options.forEach((option, index) => {
                const button = document.createElement('button');
                button.className = 'option-btn quiz-preview-option';
                button.textContent = option;
                button.style.backgroundColor = data.buttonColor;
                button.style.color = data.buttonTextColor;
                button.onclick = () => selectOption(index);
                optionsContainer.appendChild(button);
            });
        }
        
        if (progressFill) {
            const progress = nonLoadingQuestions.length > 0 ? 
                ((currentQuestionIndex + 1) / nonLoadingQuestions.length) * 100 : 0;
            progressFill.style.width = `${progress}%`;
            progressFill.style.backgroundColor = data.progressColor;
        }
    }
}

// Update loading view
function updateLoadingView(data) {
    const loadingText = document.querySelector('.loading-text');
    const loadingSpinner = document.querySelector('.loading-spinner');
    
    // Find the first loading question
    const loadingQuestion = data.questions.find(q => q.isLoading);
    
    if (loadingText) {
        if (loadingQuestion && loadingQuestion.question) {
            loadingText.textContent = loadingQuestion.question;
        } else {
            loadingText.textContent = 'Looking for trusted loan providers in your area...';
        }
    }
    
    if (loadingSpinner) {
        loadingSpinner.style.borderTopColor = data.progressColor;
    }
}

// Update form view
function updateFormView(data) {
    const formHeadline = document.getElementById('formHeadline');
    const formCta = document.getElementById('formCta');
    const nameField = document.getElementById('nameField');
    const emailField = document.getElementById('emailField');
    const phoneField = document.getElementById('phoneField');
    
    if (data.subscribeForm) {
        if (formHeadline) {
            formHeadline.textContent = data.subscribeForm.headline || 'We found offers';
        }
        
        if (formCta) {
            formCta.textContent = data.subscribeForm.cta || 'View offers →';
            formCta.style.backgroundColor = data.buttonColor;
            formCta.style.color = data.buttonTextColor;
        }
        
        if (nameField) {
            nameField.style.display = data.subscribeForm.show_name ? 'block' : 'none';
            const nameInput = nameField.querySelector('.form-input');
            if (nameInput) {
                nameInput.placeholder = data.subscribeForm.name_placeholder || 'Your name';
            }
        }
        
        if (emailField) {
            emailField.style.display = data.subscribeForm.show_email ? 'block' : 'none';
            const emailInput = emailField.querySelector('.form-input');
            if (emailInput) {
                emailInput.placeholder = data.subscribeForm.email_placeholder || 'Your email';
            }
        }
        
        if (phoneField) {
            phoneField.style.display = data.subscribeForm.show_phone ? 'block' : 'none';
            const phoneInput = phoneField.querySelector('.form-input');
            if (phoneInput) {
                phoneInput.placeholder = data.subscribeForm.phone_placeholder || 'Your phone';
            }
        }
    }
}

// Select option (for viewer interaction)
function selectOption(optionIndex) {
    const data = collectFormData();
    const nonLoadingQuestions = data.questions.filter(q => !q.isLoading);
    
    if (currentQuestionIndex < nonLoadingQuestions.length - 1) {
        currentQuestionIndex++;
        updateQuestionView(data);
    }
}

// Viewer control functions
function showQuestionView() {
    hideAllViews();
    document.getElementById('questionView').style.display = 'block';
    setActiveButton('Questions');
    
    // Reset to first question when showing question view
    currentQuestionIndex = 0;
    
    updateViewer();
}

function showLoadingView() {
    hideAllViews();
    document.getElementById('loadingView').style.display = 'block';
    setActiveButton('Loading');
    updateViewer();
}

function showFormView() {
    const subscribeFormEnabled = document.getElementById('subscribeFormEnabled')?.checked;
    
    if (!subscribeFormEnabled) {
        // If form is disabled, don't show it and keep current view
        return;
    }
    
    hideAllViews();
    document.getElementById('formView').style.display = 'block';
    setActiveButton('Form');
    updateViewer();
}

function hideAllViews() {
    const views = ['questionView', 'loadingView', 'formView'];
    views.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    });
}

function setActiveButton(buttonText) {
    const buttons = document.querySelectorAll('.btn-viewer');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.textContent === buttonText) {
            btn.classList.add('active');
        }
    });
}

// Generate JSON
function generateJSON() {
    const data = collectFormData();
    const jsonString = JSON.stringify(data, null, 2);
    
    displayJSON(jsonString);
}

// Display JSON
function displayJSON(jsonString) {
    const output = document.getElementById('jsonOutput');
    const section = document.getElementById('jsonSection');
    
    if (output) {
        output.textContent = jsonString;
    }
    
    if (section) {
        section.style.display = 'block';
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Copy JSON
function copyJSON() {
    const output = document.getElementById('jsonOutput');
    if (output && output.textContent) {
        navigator.clipboard.writeText(output.textContent).then(() => {
            addClickEffect(event.target);
        });
    }
}

// Download JSON
function downloadJSON() {
    const output = document.getElementById('jsonOutput');
    if (output && output.textContent) {
        const blob = new Blob([output.textContent], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quiz-config.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Add click effect
function addClickEffect(element) {
    element.style.transform = 'scale(0.95)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 100);
}

// Enter key handler for option inputs
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.target.classList.contains('option-input')) {
        const addButton = event.target.closest('.options-container').querySelector('.btn-add-option');
        if (addButton) {
            addOption(addButton);
        }
    }
}); 