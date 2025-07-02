// URL Google Apps Script
const QUESTIONS_API_URL = "https://script.google.com/macros/s/AKfycbyBE2_f58KpjSl490VVp6-h0rHwMdiJ5MW_9gWfEyXZiIQe9bmDHqfSGbSNkzFSipS7Ew/exec";
const SUBMIT_API_URL = "https://script.google.com/macros/s/AKfycby8755k-eccdi8ehjHWe0G_tGvIR_D2QL5o09PaF6xNIGYRDQBBux9EInBs4ecHofY39g/exec";

// Biến toàn cục
let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let answeredQuestions = 0;
let userInfo = {};

// DOM Elements (giữ nguyên)
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

// Hiển thị form thông tin người dùng
infoFormContainer.classList.remove('hidden');
quizContainer.classList.add('hidden');

// Hiển thị thông báo gửi thành công
successMessage.classList.remove('show');

// Hiển thị kết quả
resultContainer.style.display = 'none';


// Thêm biến toàn cục để kiểm soát trạng thái
let formSubmitted = false;

// Khởi tạo ứng dụng
async function init() {
    // Thiết lập sự kiện cho form thông tin
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        formSubmitted = true; // Đánh dấu đã submit form

        userInfo = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value || '',
            timestamp: new Date().toISOString()
        };

        sendDataToGoogleSheets(userInfo);
    });

    // Thiết lập sự kiện cho nút khởi động lại
    restartBtn.addEventListener('click', restartQuiz);

    // Load questions từ Google Sheets
    await fetchQuestions();
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

        // THÊM PHẦN CHUYỂN ĐỔI LINK GOOGLE DRIVE
        if (Array.isArray(data)) {
            data = data.map(q => ({
                ...q,
                imageUrl: convertToDirectLink(q.imageUrl)
            }));
        }

        if (data.error) {
            throw new Error(data.error);
        }

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Dữ liệu không hợp lệ hoặc không có câu hỏi');
        }

        questions = data;
        userAnswers = Array(questions.length).fill(null);

        // CHỈ hiển thị quiz nếu đã submit form
        if (formSubmitted) {
            startQuiz();
        }

    } catch (error) {
        console.error('Lỗi khi tải câu hỏi:', error);
        const errorMessage = `LỖI: ${error.message}. Vui lòng tải lại trang.`;
        alert(errorMessage);

        questions = [{
            question: "Hà Nội là thủ đô của quốc gia nào?",
            options: ["Việt Nam", "Lào", "Campuchia", "Thái Lan"],
            correctAnswer: 0,
            imageUrl: ""
        }];
        userAnswers = Array(questions.length).fill(null);

        if (formSubmitted) {
            startQuiz();
        }
    }
}






// Xử lý submit form
function handleFormSubmit(e) {
    e.preventDefault();

    userInfo = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value || '',
        timestamp: new Date().toISOString()
    };

    sendDataToGoogleSheets(userInfo);
}
//-------------------------------------------------------------------------------------------------------------------------------------//
// URL Google Apps Script (thay bằng URL của bạn)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby8755k-eccdi8ehjHWe0G_tGvIR_D2QL5o09PaF6xNIGYRDQBBux9EInBs4ecHofY39g/exec";

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
        // .then(response => {
        //     if (response.ok) {
        //         // Chuyển sang bài trắc nghiệm sau 1.5 giây
        //         setTimeout(() => {
        //             startQuiz();
        //         }, 2000);
        //     } else {
        //         alert('Có lỗi xảy ra khi gửi thông tin. Vui lòng thử lại.');
        //     }
        // })
        .then(response => {
            if (response.ok) {
                setTimeout(() => {
                    // KIỂM TRA LẠI ĐIỀU KIỆN
                    if (formSubmitted && questions.length > 0) {
                        startQuiz();
                    }
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
// Bắt đầu bài trắc nghiệm
function startQuiz() {
    console.log("Số câu hỏi đã tải:", questions.length);
    console.log("Câu hỏi đầu tiên:", questions[0]);

    // ĐẢM BẢO ẩn form thông tin và hiển thị quiz
    infoFormContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');
    resultContainer.style.display = 'none';


    // Khởi tạo phần trắc nghiệm
    initQuiz();
}

// Khởi tạo phần trắc nghiệm
function initQuiz() {
    totalQuestionsEl.textContent = questions.length;

    // Tạo grid câu hỏi
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

    // Thêm sự kiện cho nút điều hướng
    prevBtn.addEventListener('click', () => goToQuestion(currentQuestionIndex - 1));
    nextBtn.addEventListener('click', () => goToQuestion(currentQuestionIndex + 1));
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

    // Thêm hình ảnh nếu có - SỬA LỖI Ở ĐÂY
    if (question.imageUrl && question.imageUrl.trim() !== '') {
        const imgElement = document.createElement('img');
        imgElement.src = question.imageUrl;
        imgElement.crossOrigin = "anonymous";
        imgElement.alt = 'Hình minh họa câu hỏi';
        imgElement.classList.add('question-image');

        // Thêm xử lý lỗi chi tiết
        imgElement.onerror = function() {
            console.error('Lỗi tải ảnh:', this.src);
            const errorElement = createImageErrorElement(this.src);
            this.parentNode.replaceChild(errorElement, this);
        };

        questionContent.appendChild(imgElement); // THÊM DÒNG NÀY ĐỂ HIỂN THỊ ẢNH
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
function createImageErrorElement() {
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

    // // Tự động chuyển đến câu tiếp theo sau 2 giây (nếu chưa phải câu cuối)
    // if (currentQuestionIndex < questions.length - 1) {
    //     setTimeout(() => {
    //         if (currentQuestionIndex === index) { // Đảm bảo vẫn đang ở cùng câu hỏi
    //             goToQuestion(currentQuestionIndex + 1);
    //         }
    //     }, 2000);
    // }
}

// Chuyển đến câu hỏi
function goToQuestion(index) {
    if (index >= 0 && index < questions.length) {
        showQuestion(index);
    }

    // Kiểm tra nếu đã hoàn thành tất cả câu hỏi
    if (answeredQuestions === questions.length) {
        showResults();
    }
}

// Cập nhật nút điều hướng
function updateNavigationButtons() {
    prevBtn.disabled = currentQuestionIndex === 0;
    nextBtn.disabled = currentQuestionIndex === questions.length - 1;
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
    // Tính điểm
    let score = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === questions[index].correctAnswer) {
            score++;
        }
    });

    // Hiển thị điểm
    scoreEl.textContent = score;

    // Thông điệp kết quả
    let message = '';
    if (score === questions.length) {
        message = 'Xuất sắc! Bạn đã trả lời đúng tất cả các câu hỏi.';
    } else if (score >= questions.length * 0.8) {
        message = 'Rất tốt! Kiến thức của bạn thật đáng ngưỡng mộ.';
    } else if (score >= questions.length * 0.6) {
        message = 'Khá tốt! Bạn có kiến thức khá vững.';
    } else {
        message = 'Cố gắng hơn nữa nhé! Hãy ôn tập lại kiến thức.';
    }
    resultMessage.textContent = message;

    // Hiển thị màn hình kết quả
    document.querySelector('.content').style.display = 'none';
    resultContainer.style.display = 'block';
}

// Khởi động lại bài trắc nghiệm
function restartQuiz() {
    // Đặt lại tất cả giá trị
    currentQuestionIndex = 0;
    userAnswers = Array(questions.length).fill(null);
    answeredQuestions = 0;

    // Đặt lại giao diện
    document.querySelector('.content').style.display = 'flex';
    resultContainer.style.display = 'none';

    // Cập nhật tiến độ
    updateProgress();

    // Hiển thị lại câu hỏi đầu tiên
    showQuestion(currentQuestionIndex);
}

// Khởi chạy ứng dụng khi trang được tải
window.onload = init;

// HÀM CHUYỂN ĐỔI LINK ẢNH - BẢN SỬA MỚI
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