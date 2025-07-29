// URL Google Apps Script
const QUESTIONS_API_URL = "https://script.google.com/macros/s/AKfycbyBE2_f58KpjSl490VVp6-h0rHwMdiJ5MW_9gWfEyXZiIQe9bmDHqfSGbSNkzFSipS7Ew/exec";
const SUBMIT_API_URL = "https://script.google.com/macros/s/AKfycby8755k-eccdi8ehjHWe0G_tGvIR_D2QL5o09PaF6xNIGYRDQBBux9EInBs4ecHofY39g/exec";

// Biến toàn cục
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let answeredQuestions = 0;
let userInfo = {};
let allQuestions = []; // Lưu trữ tất cả 600 câu hỏi
let selectedExamType = '';
let examDuration = 0; // Thời gian làm bài (phút)
let timeLeft = 0; // Thời gian còn lại (giây)
let timerInterval = null; // Interval cho bộ đếm thời gian

// DOM Elements
const infoFormContainer = document.getElementById('info-form-container');
const quizContainer = document.getElementById('quiz-container');
const infoForm = document.getElementById('info-form');
const successMessage = document.getElementById('success-message');
const questionsGrid = document.getElementById('questions-grid');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedback = document.getElementById('feedback');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const resultContainer = document.getElementById('result-container');
const scoreEl = document.getElementById('score');
const resultMessage = document.getElementById('result-message');
const restartBtn = document.getElementById('restart-btn');
const examTypeContainer = document.getElementById('exam-type-container');
const timerContainer = document.getElementById('timer-container');
const timerElement = document.getElementById('timer');
// Thêm biến toàn cục
const submitBtn = document.getElementById('submit-btn');
const submitConfirmModal = document.getElementById('submit-confirm-modal');
const confirmSubmitBtn = document.getElementById('confirm-submit');
const cancelSubmitBtn = document.getElementById('cancel-submit');


// Thêm biến toàn cục để kiểm soát trạng thái
let formSubmitted = false;

// Biến lưu dữ liệu form
let savedFormData = JSON.parse(localStorage.getItem('userFormData')) || {};

// Hàm kiểm tra dữ liệu
function validateName(name) {
    // Cho phép chữ cái, dấu cách, dấu nháy đơn, dấu gạch ngang, dấu chấm
    const regex = /^[\p{L}\s.'-]+$/u;
    return regex.test(name);
}

function validatePhone(phone) {
    return /^\d{10}$/.test(phone);
}

function validateEmail(email) {
    if (!email) return true; // Email không bắt buộc
    return /@/.test(email);
}


// // Biến toàn cục để kiểm tra đã tải câu hỏi chưa
// let questionsLoaded = false;

// Khởi tạo ứng dụng
async function init() {
    // Điền dữ liệu đã lưu
    document.getElementById('name').value = savedFormData.name || '';
    document.getElementById('phone').value = savedFormData.phone || '';
    document.getElementById('address').value = savedFormData.address || '';
    document.getElementById('email').value = savedFormData.email || '';

    // Thiết lập sự kiện cho form thông tin
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Lấy và kiểm tra dữ liệu
        const nameInput = document.getElementById('name').value.trim();
        const phoneInput = document.getElementById('phone').value.trim();
        const addressInput = document.getElementById('address').value.trim();
        const emailInput = document.getElementById('email').value.trim();

        // Kiểm tra hợp lệ
        let isValid = true;
        let errorMessage = '';

        if (!nameInput) {
            isValid = false;
            errorMessage = 'Vui lòng nhập họ và tên';
        } else if (!validateName(nameInput)) {
            isValid = false;
            errorMessage = 'Họ và tên chỉ được chứa chữ cái và khoảng trắng';
        }

        if (isValid && !phoneInput) {
            isValid = false;
            errorMessage = 'Vui lòng nhập số điện thoại';
        } else if (isValid && !validatePhone(phoneInput)) {
            isValid = false;
            errorMessage = 'Số điện thoại phải gồm 10 chữ số';
        }

        if (isValid && !addressInput) {
            isValid = false;
            errorMessage = 'Vui lòng nhập địa chỉ';
        }

        if (isValid && emailInput && !validateEmail(emailInput)) {
            isValid = false;
            errorMessage = 'Email không hợp lệ. Vui lòng nhập email đúng định dạng (ví dụ: example@email.com)';
        }

        if (!isValid) {
            alert(errorMessage);
            return;
        }

        // Lưu dữ liệu vào localStorage
        savedFormData = {
            name: nameInput,
            phone: phoneInput,
            address: addressInput,
            email: emailInput
        };
        localStorage.setItem('userFormData', JSON.stringify(savedFormData));

        userInfo = {
            name: nameInput,
            phone: phoneInput,
            address: addressInput,
            email: emailInput || '',
            timestamp: new Date().toISOString()
        };

        // Đánh dấu đã submit form
        formSubmitted = true;
        sendDataToGoogleSheets(userInfo);
    });

    // Thiết lập sự kiện cho nút khởi động lại
    restartBtn.addEventListener('click', restartQuiz);

    // Load questions từ Google Sheets
    await fetchQuestions();
    // questionsLoaded = true;
}

async function fetchQuestions() {
    try {
        const response = await fetch(QUESTIONS_API_URL);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi ${response.status}: ${errorText}`);
        }

        let data = await response.json();
        console.log("Dữ liệu nhận được:", data); // Debug

        // Lưu toàn bộ 600 câu
        if (Array.isArray(data)) {
            allQuestions = data.map(q => ({
                ...q,
                imageUrl: convertToDirectLink(q.imageUrl)
            }));
        } else {
            throw new Error('Dữ liệu không hợp lệ');
        }

        if (data.error) {
            throw new Error(data.error);
        }

        // Nếu không có câu hỏi, ném lỗi
        if (allQuestions.length === 0) {
            throw new Error('Không có câu hỏi nào được tải');
        }

    } catch (error) {
        console.error('Lỗi khi tải câu hỏi:', error);
        const errorMessage = `LỖI: ${error.message}. Vui lòng tải lại trang.`;
        alert(errorMessage);

        // Tạo dữ liệu mẫu để test
        allQuestions = [{
            question: "Phần của đường bộ được sử dụng cho các phương tiện giao thông qua lại là gì?",
            options: [
                "Phần mặt đường và lề đường",
                "Phần đường xe chạy",
                "Phần đường xe cơ giới"
            ],
            correctAnswer: 1,
            imageUrl: ""
        }, {
            question: "Khi điều khiển xe chạy trên đường, người lái xe phải mang theo các loại giấy tờ gì?",
            options: [
                "Giấy phép lái xe, đăng ký xe, giấy chứng nhận bảo hiểm trách nhiệm dân sự của chủ xe cơ giới",
                "Giấy phép lái xe phù hợp với loại xe đó, đăng ký xe, giấy chứng nhận kiểm định kỹ thuật và bảo vệ môi trường (nếu có)",
                "Tất cả các giấy tờ trên"
            ],
            correctAnswer: 2,
            imageUrl: ""
        }, {
            question: "Trên đường có nhiều làn đường, khi điều khiển phương tiện ở tốc độ chậm bạn phải đi ở làn đường nào?",
            options: [
                "Đi ở làn bên phải trong cùng",
                "Đi ở làn phía bên trái",
                "Đi ở làn giữa"
            ],
            correctAnswer: 0,
            imageUrl: ""
        }];
    }
}

// Hàm hiển thị chọn bộ đề
function showExamTypeSelection() {
    infoFormContainer.classList.add('hidden');
    successMessage.classList.remove('show');
    examTypeContainer.classList.remove('hidden');
    timerContainer.classList.add('hidden');
    quizContainer.classList.add('hidden');
    resultContainer.style.display = 'none';
}

// Gửi dữ liệu đến Google Sheets
function sendDataToGoogleSheets(data) {
    // Hiển thị thông báo gửi dữ liệu
    successMessage.classList.add('show');

    // Tạo form data
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('email', data.email);
    formData.append('timestamp', data.timestamp);

    // Gửi dữ liệu
    fetch(SUBMIT_API_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                setTimeout(() => {
                    // Sau khi gửi thông tin thành công, hiển thị màn hình chọn đề
                    showExamTypeSelection();
                }, 2000);
            } else {
                alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.');
        });
}

// Hàm chọn bộ đề
function selectExamType(type, time) {
    selectedExamType = type;
    examDuration = parseInt(time);
    let numQuestions = 0;

    switch (type) {
        case 'B':
            numQuestions = 30;
            break;
        case 'C':
            numQuestions = 35;
            break;
        case 'C1':
            numQuestions = 40;
            break;
    }

    // Lấy ngẫu nhiên số câu hỏi theo loại đề
    questions = getRandomQuestions(allQuestions, numQuestions);
    userAnswers = Array(questions.length).fill(null);
    answeredQuestions = 0;
    currentQuestionIndex = 0;

    // Thiết lập thời gian
    timeLeft = examDuration * 60; // Chuyển sang giây

    // Ẩn phần chọn bộ đề, hiển thị quiz và timer
    examTypeContainer.classList.add('hidden');
    timerContainer.classList.remove('hidden');
    quizContainer.classList.remove('hidden');
    resultContainer.style.display = 'none';

    // Khởi tạo bài thi
    initQuiz();
    startTimer();
}

// Hàm bắt đầu đếm thời gian
function startTimer() {
    // Cập nhật hiển thị thời gian ban đầu
    updateTimerDisplay();

    // Bắt đầu đếm ngược
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        // Kiểm tra nếu sắp hết giờ (dưới 1 phút)
        if (timeLeft <= 60 && timeLeft > 0) {
            timerElement.classList.add('warning');
        }

        // Kiểm tra nếu hết giờ
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Hết giờ làm bài! Hệ thống sẽ tự động nộp bài của bạn.');
            showResults();
        }
    }, 1000);
}

// Hàm cập nhật hiển thị thời gian
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Hàm lấy câu hỏi ngẫu nhiên
function getRandomQuestions(questionsArray, num) {
    const shuffled = [...questionsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// Bắt đầu bài trắc nghiệm (sau khi đã chọn đề)
function initQuiz() {
    console.log("Số câu hỏi trong đề:", questions.length);
    console.log("Câu hỏi đầu tiên:", questions[0]);

    // Cập nhật tiêu đề
    document.getElementById('exam-title').textContent = `Đề ${selectedExamType} - ${questions.length} câu`;

    totalQuestionsEl.textContent = questions.length;

    // Tạo grid câu hỏi (xóa cũ trước)
    questionsGrid.innerHTML = '';
    questions.forEach((_, index) => {
        const questionNumber = document.createElement('div');
        questionNumber.className = 'question-number';
        questionNumber.textContent = index + 1;
        questionNumber.dataset.index = index;

        questionNumber.addEventListener('click', () => {
            goToQuestion(index);
        });

        questionsGrid.appendChild(questionNumber);
    });

    // Hiển thị câu hỏi đầu tiên
    showQuestion(currentQuestionIndex);

    // Cập nhật tiến độ
    updateProgress();

    // Sửa sự kiện cho nút điều hướng
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            goToQuestion(currentQuestionIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            goToQuestion(currentQuestionIndex + 1);
        } else {
            // Nếu là câu cuối, cho phép nộp bài
            showResults();
        }
    });
    // Thay bằng:
    submitBtn.addEventListener('click', function() {
        // Kiểm tra nếu chưa trả lời câu nào
        if (answeredQuestions === 0) {
            alert('Bạn chưa trả lời câu hỏi nào. Vui lòng trả lời ít nhất một câu trước khi nộp bài.');
            return;
        }

        // Hiển thị modal xác nhận
        submitConfirmModal.classList.remove('hidden');
    });



    // Thêm sự kiện phím tắt
    document.addEventListener('keydown', handleKeyNavigation);
    submitBtn.addEventListener('click', function() {
        // Kiểm tra nếu chưa trả lời câu nào
        if (answeredQuestions === 0) {
            alert('Bạn chưa trả lời câu hỏi nào. Vui lòng trả lời ít nhất một câu trước khi nộp bài.');
            return;
        }

        // Hiển thị modal xác nhận
        submitConfirmModal.classList.remove('hidden');
    });

    confirmSubmitBtn.addEventListener('click', function() {
        submitConfirmModal.classList.add('hidden');
        showResults();
    });

    cancelSubmitBtn.addEventListener('click', function() {
        submitConfirmModal.classList.add('hidden');
    });
}

// Hàm xử lý điều hướng bằng bàn phím
function handleKeyNavigation(e) {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) {
        goToQuestion(currentQuestionIndex - 1);
    } else if (e.key === 'ArrowRight' && !nextBtn.disabled) {
        if (currentQuestionIndex < questions.length - 1) {
            goToQuestion(currentQuestionIndex + 1);
        } else {
            showResults();
        }
    }
}

// Thêm các hàm này vào exam.js
function openImageOverlay(src) {
    const overlay = document.getElementById('image-overlay');
    const overlayImg = document.getElementById('overlay-image');

    overlayImg.src = src;
    overlay.style.display = 'flex';

    // Ngăn scroll khi overlay mở
    document.body.style.overflow = 'hidden';
}

function closeImageOverlay() {
    const overlay = document.getElementById('image-overlay');
    overlay.style.display = 'none';

    // Khôi phục scroll
    document.body.style.overflow = '';
}



// Hiển thị câu hỏi
function showQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    console.log("Câu hỏi hiện tại:", question); // Debug

    // Cập nhật chỉ số câu hỏi
    currentQuestionEl.textContent = index + 1;

    // Hiển thị nội dung câu hỏi
    questionText.innerHTML = '';

    // Tạo phần tử cho câu hỏi
    const questionContent = document.createElement('div');

    // Thêm văn bản câu hỏi
    const textElement = document.createElement('p');
    textElement.textContent = question.question;
    questionContent.appendChild(textElement);

    // Thêm hình ảnh nếu có
    if (question.imageUrl && question.imageUrl.trim() !== '') {
        const imgElement = document.createElement('img');
        imgElement.src = question.imageUrl;
        imgElement.crossOrigin = "anonymous";
        imgElement.alt = 'Hình minh họa câu hỏi';
        imgElement.classList.add('question-image');

        // Thêm sự kiện click để phóng to
        imgElement.addEventListener('click', () => {
            openImageOverlay(question.imageUrl);
        });

        // Thêm xử lý lỗi chi tiết
        imgElement.onerror = function() {
            console.error('Lỗi tải ảnh:', this.src);
            const errorElement = createImageErrorElement(this.src);
            this.parentNode.replaceChild(errorElement, this);
        };

        questionContent.appendChild(imgElement);
    }

    // Gán nội dung vào DOM
    questionText.appendChild(questionContent);

    // Tạo các lựa chọn
    optionsContainer.innerHTML = '';
    const options = ['A', 'B', 'C', 'D'];

    question.options.forEach((option, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';

        // Kiểm tra xem người dùng đã chọn đáp án này chưa
        if (userAnswers[index] === i) {
            optionElement.classList.add('selected');

            // Kiểm tra đúng/sai và thêm lớp phù hợp
            if (i === question.correctAnswer) {
                optionElement.classList.add('correct');
            } else {
                optionElement.classList.add('incorrect');
            }
        } else if (i === question.correctAnswer && userAnswers[index] !== null) {
            // Hiển thị đáp án đúng nếu người dùng đã trả lời
            optionElement.classList.add('correct');
        }

        optionElement.innerHTML = `
                    <div class="option-letter">${options[i]}</div>
                    <div class="option-text">${option}</div>
                `;

        // Chỉ cho phép chọn nếu chưa trả lời
        if (userAnswers[index] === null) {
            optionElement.addEventListener('click', () => selectOption(i));
        }

        optionsContainer.appendChild(optionElement);
    });

    // Hiển thị phản hồi nếu đã trả lời
    if (userAnswers[index] !== null) {
        showFeedback(index);
    } else {
        feedback.className = 'feedback';
        feedback.style.display = 'none';
    }

    // Cập nhật trạng thái nút điều hướng
    updateNavigationButtons();

    // Cập nhật trạng thái câu hỏi trong grid
    updateQuestionGrid();

}

// Hàm tạo phần tử thông báo lỗi hình ảnh
function createImageErrorElement(src) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'image-error';
    errorDiv.innerHTML = `
                <p>⚠️ Không thể tải hình ảnh</p>
                <p><small>URL: ${src}</small></p>
            `;
    return errorDiv;
}

// Chọn đáp án
function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    answeredQuestions++;

    // Hiển thị phản hồi
    showFeedback(currentQuestionIndex);

    // Cập nhật giao diện
    showQuestion(currentQuestionIndex);

    // Cập nhật tiến độ
    updateProgress();
    // Hiển thị nút nộp bài khi có ít nhất 1 câu trả lời
    if (answeredQuestions > 0) {
        submitBtn.style.display = 'block';
    }
    // // Kiểm tra nếu đã hoàn thành tất cả câu hỏi
    // if (answeredQuestions === questions.length) {
    //     setTimeout(() => {
    //         showResults();
    //     }, 1000);
    // }
    // Sau khi chọn đáp án, kích hoạt nút tiếp theo
    updateNavigationButtons();
}

// Hiển thị phản hồi
function showFeedback(index) {
    const question = questions[index];
    const userAnswer = userAnswers[index];

    feedback.style.display = 'block';
    feedback.className = 'feedback';

    if (userAnswer === question.correctAnswer) {
        feedback.classList.add('correct');
        feedback.innerHTML = `
                    <strong>✓ Chính xác!</strong>
                    <p>Bạn đã chọn đáp án đúng cho câu hỏi này.</p>
                `;
    } else {
        feedback.classList.add('incorrect');
        const correctOption = ['A', 'B', 'C', 'D'][question.correctAnswer];
        feedback.innerHTML = `
                    <strong>✗ Chưa chính xác!</strong>
                    <p>Đáp án đúng là <strong>${correctOption}</strong>: ${question.options[question.correctAnswer]}</p>
                `;
    }
}

// Chuyển đến câu hỏi
function goToQuestion(index) {
    if (index >= 0 && index < questions.length) {
        currentQuestionIndex = index;
        showQuestion(index);
    }

    // Cập nhật trạng thái nút ngay lập tức
    updateNavigationButtons();
}


// Cập nhật nút điều hướng
function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === questions.length - 1;

    // Cập nhật trạng thái nút dựa trên câu trả lời
    if (userAnswers[currentQuestionIndex] !== null) {
        nextBtn.disabled = false;
    }
    // Luôn bật nút nộp bài
    submitBtn.disabled = false;

    // Hiển thị nút nộp bài khi có câu trả lời
    submitBtn.style.display = answeredQuestions > 0 ? 'block' : 'none';
}

// Cập nhật grid câu hỏi
function updateQuestionGrid() {
    const questionNumbers = document.querySelectorAll('.question-number');

    questionNumbers.forEach((number, index) => {
        number.classList.remove('active', 'answered');

        if (index === currentQuestionIndex) {
            number.classList.add('active');
        }

        if (userAnswers[index] !== null) {
            number.classList.add('answered');
        }
    });
}

// Cập nhật tiến độ
function updateProgress() {
    const progress = (answeredQuestions / questions.length) * 100;
    progressBar.style.width = `${progress}%`;
    progressText.textContent = `${Math.round(progress)}%`;
}

// Hiển thị kết quả
function showResults() {
    // Kiểm tra nếu chưa trả lời câu nào
    if (answeredQuestions === 0) {
        alert('Vui lòng trả lời ít nhất 1 câu hỏi trước khi nộp bài');
        return;
    }
    // Dừng timer nếu đang chạy
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    // Tính điểm
    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correctAnswer) {
            score++;
        }
    });

    // Hiển thị điểm
    scoreEl.textContent = score;
    document.getElementById('total-score').textContent = questions.length;

    // Thông điệp kết quả
    let message = '';
    const passThreshold = selectedExamType === 'B' ? 26 :
        selectedExamType === 'C' ? 32 :
        selectedExamType === 'C1' ? 36 : 0;

    if (score === questions.length) {
        message = 'Xuất sắc! Bạn đã trả lời đúng tất cả các câu hỏi.';
    } else if (score >= passThreshold) {
        message = 'Chúc mừng! Bạn đã đạt yêu cầu.';
    } else {
        message = 'Cố gắng hơn nữa nhé! Hãy ôn tập lại kiến thức.';
    }
    resultMessage.textContent = message;

    // Hiển thị màn hình kết quả
    document.querySelector('.content').style.display = 'none';
    resultContainer.style.display = 'block';

    // Hiển thị nút tải PDF
    const downloadBtn = document.getElementById('download-pdf');
    downloadBtn.style.display = 'inline-block';

    // Gắn sự kiện Tải PDF (gắn tại đây để đảm bảo userInfo đã có)
    downloadBtn.addEventListener('click', function() {
        const pdf = generatePDF();
        if (pdf) {
            pdf.save(`ket-qua-thi-bang-lai-${selectedExamType}-${userInfo.name}.pdf`);
        }
    });
}

// Khởi động lại bài trắc nghiệm
function restartQuiz() {
    // Đặt lại tất cả giá trị
    currentQuestionIndex = 0;
    userAnswers = Array(questions.length).fill(null);
    answeredQuestions = 0;

    // Reset thời gian
    timeLeft = examDuration * 60;
    timerElement.classList.remove('warning');
    updateTimerDisplay();

    // Đặt lại giao diện
    document.querySelector('.content').style.display = 'flex';
    resultContainer.style.display = 'none';

    // Cập nhật tiến độ
    updateProgress();

    // Hiển thị lại câu hỏi đầu tiên
    showQuestion(currentQuestionIndex);

    // Khởi động lại timer
    startTimer();
    // Ẩn nút nộp bài
    submitBtn.style.display = 'none';
}

// Thêm event listeners cho nút chọn đề
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.exam-type-btn').forEach(button => {
        button.addEventListener('click', function() {
            const type = this.dataset.type;
            const time = this.dataset.time;
            selectExamType(type, time);
        });
    });
    // Thêm sự kiện cho nút đóng
    document.querySelector('.close-btn').addEventListener('click', closeImageOverlay);

    // Đóng khi nhấn vào overlay (ngoài ảnh)
    document.getElementById('image-overlay').addEventListener('click', function(e) {
        if (e.target === this) {
            closeImageOverlay();
        }
    });

    // Đóng khi nhấn phím ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !document.getElementById('image-overlay').classList.contains('hidden')) {
            closeImageOverlay();
        }
    });
});


// Hàm mở ảnh phóng to với chức năng zoom
function openImageOverlay(src) {
    const overlay = document.getElementById('image-overlay');
    const overlayImg = document.getElementById('overlay-image');

    overlayImg.src = src;
    overlay.style.display = 'flex';

    // Xóa class zoom nếu có
    overlayImg.classList.remove('zoomed');
    overlayImg.style.transform = 'scale(1)';

    // Ngăn scroll khi overlay mở
    document.body.style.overflow = 'hidden';

    // Thêm nút điều khiển zoom
    const zoomControls = document.createElement('div');
    zoomControls.className = 'zoom-controls';
    zoomControls.innerHTML = `
        <div class="zoom-btn" id="zoom-in">+</div>
        <div class="zoom-btn" id="zoom-out">-</div>
        <div class="zoom-btn" id="zoom-reset">↺</div>
    `;
    overlay.appendChild(zoomControls);

    // Xử lý sự kiện zoom
    document.getElementById('zoom-in').addEventListener('click', () => zoomImage(0.5));
    document.getElementById('zoom-out').addEventListener('click', () => zoomImage(-0.5));
    document.getElementById('zoom-reset').addEventListener('click', resetZoom);

    // Cho phép kéo ảnh khi zoom
    let isDragging = false;
    let startX, startY, scrollLeft, scrollTop;

    overlayImg.addEventListener('mousedown', (e) => {
        if (overlayImg.classList.contains('zoomed')) {
            isDragging = true;
            startX = e.pageX - overlayImg.offsetLeft;
            startY = e.pageY - overlayImg.offsetTop;
            scrollLeft = overlay.scrollLeft;
            scrollTop = overlay.scrollTop;
            overlayImg.style.cursor = 'grabbing';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        if (overlayImg.classList.contains('zoomed')) {
            overlayImg.style.cursor = 'move';
        }
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !overlayImg.classList.contains('zoomed')) return;
        e.preventDefault();
        const x = e.pageX - overlayImg.offsetLeft;
        const y = e.pageY - overlayImg.offsetTop;
        const walkX = (x - startX) * 2;
        const walkY = (y - startY) * 2;
        overlay.scrollLeft = scrollLeft - walkX;
        overlay.scrollTop = scrollTop - walkY;
    });

    // Cho phép zoom bằng chuột
    overlayImg.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY < 0) {
            zoomImage(0.5);
        } else {
            zoomImage(-0.5);
        }
    });
}

// Hàm zoom ảnh (phiên bản đã sửa)
function zoomImage(zoomFactor) {
    const overlayImg = document.getElementById('overlay-image');

    // Lấy tỉ lệ zoom hiện tại một cách chính xác
    let currentScale = 1;
    if (overlayImg.style.transform) {
        const match = overlayImg.style.transform.match(/scale\(([\d.]+)\)/);
        if (match && match[1]) {
            currentScale = parseFloat(match[1]);
        }
    }

    // Tính toán tỉ lệ zoom mới
    let newScale = currentScale + zoomFactor;

    // Giới hạn mức zoom (1x - 3x)
    if (newScale < 1) newScale = 1;
    if (newScale > 3) newScale = 3;

    // Áp dụng zoom mới
    overlayImg.style.transform = `scale(${newScale})`;
    overlayImg.style.cursor = 'move';

    // Thêm class zoomed nếu zoom > 1x
    if (newScale > 1) {
        overlayImg.classList.add('zoomed');
    } else {
        overlayImg.classList.remove('zoomed');
    }
}

// Hàm reset zoom
function resetZoom() {
    const overlayImg = document.getElementById('overlay-image');
    overlayImg.style.transform = 'scale(1)';
    overlayImg.classList.remove('zoomed');
    overlayImg.style.cursor = 'zoom-in';
}

// Hàm đóng overlay
function closeImageOverlay() {
    const overlay = document.getElementById('image-overlay');
    overlay.style.display = 'none';

    // Xóa các nút điều khiển zoom
    const zoomControls = document.querySelector('.zoom-controls');
    if (zoomControls) zoomControls.remove();

    // Khôi phục scroll
    document.body.style.overflow = '';
}





// Dừng timer khi trang đóng
window.addEventListener('beforeunload', function() {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
});

// HÀM CHUYỂN ĐỔI LINK ẢNH
function convertToDirectLink(shareableLink) {
    if (!shareableLink || shareableLink.trim() === '') return '';

    // Xử lý link prnt.sc
    if (shareableLink.includes('prnt.sc')) {
        const url = new URL(shareableLink);
        const pathParts = url.pathname.split('/');
        const imageId = pathParts[pathParts.length - 1];
        return `https://i.imgur.com/${imageId}.png`;
    }

    // Xử lý link postimg.cc
    if (shareableLink.includes('postimg.cc')) {
        const url = new URL(shareableLink);
        const pathParts = url.pathname.split('/');
        const imageId = pathParts[pathParts.length - 1];
        return `https://i.postimg.cc/${imageId}/image.png`;
    }

    // Xử lý các link ảnh trực tiếp khác
    return shareableLink;
}

// Hàm tạo PDF
// function generatePDF() {
//     // Khởi tạo jsPDF
//     const { jsPDF } = window.jspdf;
//     const doc = new jsPDF();

//     // 🔒 Kiểm tra dữ liệu quan trọng
//     if (!userInfo || !userInfo.name || !selectedExamType || !Array.isArray(questions)) {
//         alert("Không đủ thông tin để tạo PDF. Vui lòng hoàn tất bài thi trước.");
//         return null;
//     }

//     // Thêm thông tin người dùng
//     doc.setFontSize(16);
//     doc.setTextColor(40, 40, 40);
//     doc.text(`KẾT QUẢ BÀI THI LÝ THUYẾT LÁI XE HẠNG ${selectedExamType}`, 105, 20, { align: 'center' });

//     doc.setFontSize(12);
//     doc.text(`Họ tên: ${userInfo.name}`, 20, 30);
//     doc.text(`SĐT: ${userInfo.phone}`, 20, 38);
//     doc.text(`Thời gian làm bài: ${new Date(userInfo.timestamp).toLocaleString()}`, 20, 46);

//     // Tính điểm
//     let score = 0;
//     userAnswers.forEach((answer, index) => {
//         if (answer === questions[index].correctAnswer) {
//             score++;
//         }
//     });

//     // Thêm kết quả
//     doc.setFontSize(14);
//     doc.setTextColor(179, 0, 0);
//     doc.text(`Điểm: ${score}/${questions.length}`, 105, 60, { align: 'center' });

//     // Thêm chi tiết câu hỏi
//     doc.setFontSize(12);
//     doc.setTextColor(40, 40, 40);
//     let yPosition = 80;

//     questions.forEach((question, index) => {
//         // Kiểm tra nếu cần sang trang mới
//         if (yPosition > 250) {
//             doc.addPage();
//             yPosition = 20;
//         }

//         // Thêm câu hỏi
//         doc.setFont('helvetica', 'bold');
//         doc.text(`Câu ${index + 1}: ${question.question}`, 20, yPosition);
//         yPosition += 8;

//         // Thêm các lựa chọn
//         doc.setFont('helvetica', 'normal');
//         const options = ['A', 'B', 'C', 'D'];
//         question.options.forEach((option, i) => {
//             let optionText = `${options[i]}. ${option}`;

//             // Đánh dấu đáp án đúng và đáp án người dùng chọn
//             if (i === question.correctAnswer) {
//                 optionText += " (Đáp án đúng)";
//             }
//             if (userAnswers[index] === i) {
//                 optionText += " (Bạn chọn)";
//             }

//             doc.text(optionText, 25, yPosition);
//             yPosition += 8;
//         });

//         // Thêm khoảng cách giữa các câu
//         yPosition += 8;
//     });

//     return doc;
// }


// Hàm tạo PDF
function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Dùng font Roboto đã nhúng
    doc.setFont("Roboto", "normal");

    if (!userInfo || !userInfo.name || !selectedExamType || !Array.isArray(questions)) {
        alert("Không đủ thông tin để tạo PDF. Vui lòng hoàn tất bài thi trước.");
        return null;
    }

    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(`KẾT QUẢ BÀI THI LÝ THUYẾT LÁI XE HẠNG ${selectedExamType}`, 105, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Họ tên: ${userInfo.name}`, 20, 30);
    doc.text(`SĐT: ${userInfo.phone}`, 20, 38);
    doc.text(`Thời gian làm bài: ${new Date(userInfo.timestamp).toLocaleString()}`, 20, 46);

    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correctAnswer) score++;
    });

    doc.setFontSize(14);
    doc.setTextColor(179, 0, 0);
    doc.text(`Điểm: ${score}/${questions.length}`, 105, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    let yPosition = 80;

    questions.forEach((question, index) => {
        if (yPosition > 250) {
            doc.addPage();
            doc.setFont("Roboto", "normal");
            yPosition = 20;
        }

        // Câu hỏi xuống dòng nếu dài
        doc.setFont("Roboto", "bold");
        const qText = doc.splitTextToSize(`Câu ${index + 1}: ${question.question}`, 170);
        doc.text(qText, 20, yPosition);
        yPosition += qText.length * 8;

        // Các lựa chọn
        doc.setFont("Roboto", "normal");
        const options = ['A', 'B', 'C', 'D'];
        question.options.forEach((option, i) => {
            let optionText = `${options[i]}. ${option}`;
            if (i === question.correctAnswer) optionText += " (Đáp án đúng)";
            if (userAnswers[index] === i) optionText += " (Bạn chọn)";

            const wrappedOption = doc.splitTextToSize(optionText, 165);
            doc.text(wrappedOption, 25, yPosition);
            yPosition += wrappedOption.length * 8;
        });

        yPosition += 8;
    });

    return doc;
}

// // Xử lý sự kiện khi nhấn nút "Học viên taylaimoi"
// document.getElementById('skip-info-btn').addEventListener('click', async function() {
//     // Kiểm tra nếu chưa tải câu hỏi thì tải lại
//     if (!questionsLoaded) {
//         await fetchQuestions();
//         questionsLoaded = true;
//     }

//     // Ẩn form nhập thông tin
//     document.getElementById('info-form-container').classList.add('hidden');

//     // Hiển thị phần chọn đề thi
//     document.getElementById('exam-type-container').classList.remove('hidden');
// });

// Khởi chạy ứng dụng khi trang được tải
window.onload = init;