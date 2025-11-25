const STUDENT_INFO_API = "https://script.google.com/macros/s/AKfycbwNfZYtH0aMpJpfS_SE-HpFdgiRU-5Z46CrCmo8IxZcNgcFUDdqACA11MGa46UyaZz2Yw/exec";
const QUESTIONS_API = "https://script.google.com/macros/s/AKfycbzl0PeyMM-G1VU_CvrizEbv_k1gsntuyR1PVkZ3uYqnTXsdz9Yi_FbkxVfgbV_5cp3k/exec";

// Exam configuration (giữ nguyên)
const EXAM_CONFIG = {
    'A1': {
        questions: 25,
        time: 19 * 60,
        passScore: 21
    },
    'A': {
        questions: 25,
        time: 19 * 60,
        passScore: 21
    },
    '250': {
        questions: 250,
        time: 0,
        passScore: 0
    }
};

// Global variables (giữ nguyên)
let studentInfo = {};
let allQuestions = [];
let examQuestions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let timerInterval;
let timeLeft = 0;
let selectedExamType = null;
let examSubmitted = false;

// DOM Elements (giữ nguyên)
const registrationSection = document.getElementById('registrationSection');
const examSelectionSection = document.getElementById('examSelectionSection');
const examSection = document.getElementById('examSection');
const resultModal = document.getElementById('resultModal');
const saveStatus = document.getElementById('saveStatus');
const fullNameInput = document.getElementById('fullName');
const phoneInput = document.getElementById('phone');
const emailInput = document.getElementById('email');
const addressInput = document.getElementById('address');
const userName = document.getElementById('userName');
const saveInfoBtn = document.getElementById('saveInfoBtn');
const continueBtn = document.getElementById('continueBtn');

const examCards = document.querySelectorAll('.exam-card');
const startExamBtn = document.getElementById('startExamBtn');

const questionCounter = document.getElementById('questionCounter');
const answeredCounter = document.getElementById('answeredCounter');
const questionText = document.getElementById('questionText');
const questionImage = document.getElementById('questionImage');
const optionsContainer = document.getElementById('optionsContainer');
const questionGrid = document.getElementById('questionGrid');
const timerElement = document.getElementById('timer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitExamBtn = document.getElementById('submitExamBtn');

const finalScore = document.getElementById('finalScore');
const passFailText = document.getElementById('passFailText');
const correctCount = document.getElementById('correctCount');
const incorrectCount = document.getElementById('incorrectCount');
const unansweredCount = document.getElementById('unansweredCount');
const retryBtn = document.getElementById('retryBtn');
const backToHomeBtn = document.getElementById('backToHomeBtn');

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Load saved student info
    loadStudentInfo();

    // Setup event listeners
    saveInfoBtn.addEventListener('click', saveStudentInfo);
    continueBtn.addEventListener('click', showExamSelection);

    examCards.forEach(card => {
        card.addEventListener('click', () => {
            examCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedExamType = card.dataset.type;
            startExamBtn.disabled = false;
        });
    });

    startExamBtn.addEventListener('click', startExam);
    prevBtn.addEventListener('click', goToPrevQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    submitExamBtn.addEventListener('click', submitExam);
    retryBtn.addEventListener('click', restartExam);
    backToHomeBtn.addEventListener('click', backToHome);

    // Load questions
    loadQuestions();
});

// Load saved student info from localStorage
function loadStudentInfo() {
    const savedInfo = localStorage.getItem('studentInfo');
    if (savedInfo) {
        studentInfo = JSON.parse(savedInfo);
        fullNameInput.value = studentInfo.fullName || '';
        phoneInput.value = studentInfo.phone || '';
        emailInput.value = studentInfo.email || '';
        addressInput.value = studentInfo.address || '';

        if (studentInfo.fullName) {
            userName.textContent = studentInfo.fullName;
            continueBtn.disabled = false;
        }
    }
}


function saveStudentInfo() {
    if (!fullNameInput.value || !phoneInput.value) {
        alert('Vui lòng nhập họ tên và số điện thoại');
        return;
    }

    studentInfo = {
        fullName: fullNameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        address: addressInput.value
    };

    localStorage.setItem('studentInfo', JSON.stringify(studentInfo));
    userName.textContent = studentInfo.fullName;
    continueBtn.disabled = false;

    saveStatus.textContent = "Đang lưu thông tin...";
    saveStatus.style.display = "block";
    saveStatus.className = "save-status";

    // KHÔNG dùng proxy nữa
    fetch(STUDENT_INFO_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'save_student_info', // nếu Apps Script của bạn cần field này
                ...studentInfo
            })
        })
        .then(response => response.json())
        .then(result => {
            if (result.result === 'success') {
                saveStatus.textContent = "Đã lưu thông tin thành công!";
                saveStatus.className = "save-status";
            } else {
                saveStatus.textContent = `Lỗi khi lưu: ${result.error || 'Không xác định'}`;
                saveStatus.className = "save-status error";
            }
        })
        .catch(error => {
            console.error('Lỗi khi lưu thông tin:', error);
            saveStatus.textContent = `Lỗi kết nối: ${error.message}`;
            saveStatus.className = "save-status error";
        });
}







// Xử lý CORS error khi dev
if (window.location.hostname === "localhost") {
    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        if (url.startsWith("https://script.google.com")) {
            url = url.replace(
                "https://script.google.com",
                "https://cors-anywhere.herokuapp.com/https://script.google.com"
            );
        }
        return originalFetch(url, options);
    };
}
// Show exam selection section
function showExamSelection() {
    registrationSection.style.display = 'none';
    examSelectionSection.style.display = 'block';
}

// Load questions from Google Sheets
function loadQuestions() {
    fetch(QUESTIONS_API)
        .then(response => response.json())
        .then(data => {
            allQuestions = data;
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            alert('Không thể tải câu hỏi. Vui lòng thử lại sau.');
        });
}

// Start the exam
function startExam() {
    if (!selectedExamType) {
        alert('Vui lòng chọn loại đề thi');
        return;
    }

    if (!studentInfo.fullName || !studentInfo.phone) {
        alert('Vui lòng nhập đầy đủ thông tin thí sinh');
        return;
    }

    // Hide registration and selection, show exam
    examSelectionSection.style.display = 'none';
    examSection.style.display = 'block';

    // Initialize exam
    initializeExam();
}

// Initialize exam state
function initializeExam() {
    const config = EXAM_CONFIG[selectedExamType];

    // Select questions
    if (selectedExamType === '250') {
        examQuestions = [...allQuestions];
    } else {
        // Shuffle and select random questions
        examQuestions = [...allQuestions].sort(() => Math.random() - 0.5).slice(0, config.questions);
    }

    // Initialize userAnswers array
    userAnswers = new Array(examQuestions.length).fill(null);

    // Set timer
    timeLeft = config.time;
    updateTimerDisplay();

    if (config.time > 0) {
        startTimer();
    } else {
        timerElement.textContent = "Không giới hạn";
    }

    // Create question numbers grid
    renderQuestionGrid();

    // Display first question
    displayQuestion(0);

    // Update progress
    updateProgress();
}

// Start the exam timer
function startTimer() {
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitExam();
        }
    }, 1000);
}

// Update timer display
function updateTimerDisplay() {
    if (timeLeft <= 0) {
        timerElement.textContent = "00:00";
        return;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    // Change color when time is running out
    if (timeLeft < 120) { // Less than 2 minutes
        timerElement.style.backgroundColor = '#e74c3c';
    }
}

// Display a question
function displayQuestion(index) {
    if (index < 0 || index >= examQuestions.length) return;

    currentQuestionIndex = index;
    const question = examQuestions[index];

    // Update question counter
    questionCounter.textContent = `Câu hỏi ${index + 1}/${examQuestions.length}`;

    // Update question text
    questionText.textContent = question.Question;

    // Show image if available
    if (question.ImageUrl && question.ImageUrl.trim() !== "") {
        questionImage.src = question.ImageUrl;
        questionImage.style.display = 'block';
    } else {
        questionImage.style.display = 'none';
    }

    // Render options
    renderOptions(question);

    // Update question grid
    updateQuestionGrid();
}

// Render options for a question
function renderOptions(question) {
    optionsContainer.innerHTML = '';
    const showAnswers = selectedExamType === '250' || examSubmitted;

    const options = [
        question.Option1,
        question.Option2,
        question.Option3,
        question.Option4
    ];

    options.forEach((optionText, index) => {
        if (!optionText) return;

        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';

        // Check selected answer
        if (userAnswers[currentQuestionIndex] === index.toString()) {
            optionDiv.classList.add('selected');
        }

        // Show correct answer when needed
        if (showAnswers && index.toString() === question.CorrectAnswer) {
            optionDiv.classList.add('correct');
        }

        // Mark incorrect if selected
        if (userAnswers[currentQuestionIndex] === index.toString() &&
            userAnswers[currentQuestionIndex] !== question.CorrectAnswer) {
            optionDiv.classList.add('incorrect');
        }

        optionDiv.innerHTML = `
                <input type="radio" id="option${index + 1}" name="answer" 
                       value="${index}" ${userAnswers[currentQuestionIndex] === index.toString() ? 'checked' : ''}
                       ${userAnswers[currentQuestionIndex] !== null ? 'disabled' : ''}>
                <label for="option${index + 1}">${optionText}</label>
            `;

        if (userAnswers[currentQuestionIndex] === null) {
            optionDiv.addEventListener('click', () => {
                userAnswers[currentQuestionIndex] = index.toString();

                // Show answer immediately in practice mode
                if (selectedExamType === '250') {
                    renderOptions(question);
                }

                updateProgress();
                updateQuestionGrid();
            });
        }

        optionsContainer.appendChild(optionDiv);
    });
}

// Render question number grid
function renderQuestionGrid() {
    questionGrid.innerHTML = '';

    for (let i = 0; i < examQuestions.length; i++) {
        const questionNum = document.createElement('div');
        questionNum.className = 'question-number';

        // Set status classes
        if (i === currentQuestionIndex) {
            questionNum.classList.add('current');
        }

        if (userAnswers[i] !== null) {
            if (userAnswers[i] === examQuestions[i].CorrectAnswer) {
                questionNum.classList.add('answered');
            } else {
                questionNum.classList.add('incorrect');
            }
        }

        questionNum.textContent = i + 1;

        questionNum.addEventListener('click', () => {
            displayQuestion(i);
        });

        questionGrid.appendChild(questionNum);
    }
}

// Update question grid highlighting
function updateQuestionGrid() {
    const questionNumbers = document.querySelectorAll('.question-number');
    questionNumbers.forEach((num, index) => {
        num.classList.remove('current', 'answered', 'incorrect');

        if (index === currentQuestionIndex) {
            num.classList.add('current');
        }

        if (userAnswers[index] !== null) {
            if (userAnswers[index] === examQuestions[index].CorrectAnswer) {
                num.classList.add('answered');
            } else {
                num.classList.add('incorrect');
            }
        }
    });
}

// Update progress counters
function updateProgress() {
    const answeredCount = userAnswers.filter(answer => answer !== null).length;
    answeredCounter.textContent = `Đã trả lời: ${answeredCount}/${examQuestions.length}`;
}

// Navigation functions
function goToPrevQuestion() {
    if (currentQuestionIndex > 0) {
        displayQuestion(currentQuestionIndex - 1);
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex < examQuestions.length - 1) {
        displayQuestion(currentQuestionIndex + 1);
    }
}

// Trong hàm submitExam, LOẠI BỎ phần gọi saveResults
function submitExam() {
    examSubmitted = true;
    clearInterval(timerInterval);

    // Tính toán kết quả
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    userAnswers.forEach((answer, index) => {
        if (answer === null) {
            unanswered++;
        } else if (answer === examQuestions[index].CorrectAnswer) {
            correct++;
        } else {
            incorrect++;
        }
    });

    // Hiển thị kết quả
    finalScore.textContent = `${correct}/${examQuestions.length}`;

    // Kiểm tra đỗ/trượt
    const config = EXAM_CONFIG[selectedExamType];
    if (selectedExamType !== '250') {
        if (correct >= config.passScore) {
            passFailText.textContent = "CHÚC MỪNG BẠN ĐÃ ĐỖ!";
            passFailText.className = "pass";
        } else {
            passFailText.textContent = "RẤT TIẾC, BẠN ĐÃ TRƯỢT!";
            passFailText.className = "fail";
        }
    } else {
        passFailText.textContent = "HOÀN THÀNH ÔN TẬP!";
        passFailText.className = "pass";
    }

    correctCount.textContent = correct;
    incorrectCount.textContent = incorrect;
    unansweredCount.textContent = unanswered;

    // Hiển thị modal kết quả
    resultModal.classList.add('show');

    // KHÔNG gọi saveResults ở đây
}

// Restart the exam
function restartExam() {
    examSubmitted = false;
    resultModal.classList.remove('show');
    initializeExam();
}

// Back to home screen
function backToHome() {
    resultModal.classList.remove('show');
    registrationSection.style.display = 'block';
    examSelectionSection.style.display = 'none';
    examSection.style.display = 'none';
}