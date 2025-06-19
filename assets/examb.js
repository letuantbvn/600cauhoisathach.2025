// File: assets/examb.js
// Giả lập URL cho bài trắc nghiệm
// Dữ liệu câu hỏi (30 câu)
const questions = [{
    question: "Hà Nội là thủ đô của quốc gia nào?",
    options: ["Việt Nam", "Lào", "Campuchia", "Thái Lan"],
    correctAnswer: 0
}, {
    question: "Loại trái cây nào được mệnh danh là 'vua của các loại trái cây'?",
    options: ["Xoài", "Chôm chôm", "Sầu riêng", "Măng cụt"],
    correctAnswer: 2
}, {
    question: "Đơn vị tiền tệ của Nhật Bản là gì?",
    options: ["Won", "Yên", "Đô la", "Bạt"],
    correctAnswer: 1
}, {
    question: "Con sông nào dài nhất Việt Nam?",
    options: ["Sông Hồng", "Sông Đà", "Sông Mê Kông", "Sông Đồng Nai"],
    correctAnswer: 2
}, {
    question: "Ai là tác giả của truyện Kiều?",
    options: ["Hồ Xuân Hương", "Nguyễn Du", "Nguyễn Trãi", "Nguyễn Bính"],
    correctAnswer: 1
}, {
    question: "Đỉnh núi cao nhất Việt Nam thuộc dãy núi nào?",
    options: ["Hoàng Liên Sơn", "Trường Sơn", "Đông Triều", "Ngọc Linh"],
    correctAnswer: 0
}, {
    question: "Thành phố nào được mệnh danh là 'Thành phố Hoa Phượng Đỏ'?",
    options: ["Đà Nẵng", "Nha Trang", "Hải Phòng", "Vũng Tàu"],
    correctAnswer: 2
}, {
    question: "Loài động vật nào lớn nhất trên Trái Đất?",
    options: ["Voi", "Hươu cao cổ", "Cá voi xanh", "Khủng long"],
    correctAnswer: 2
}, {
    question: "Ai là người đầu tiên đặt chân lên Mặt Trăng?",
    options: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "Alan Shepard"],
    correctAnswer: 1
}, {
    question: "Phần mềm nào sau đây dùng để xử lý bảng tính?",
    options: ["Microsoft Word", "Microsoft Excel", "Microsoft PowerPoint", "Microsoft Access"],
    correctAnswer: 1
}, {
    question: "Trong bảng tuần hoàn các nguyên tố hóa học, ký hiệu 'Au' là nguyên tố nào?",
    options: ["Bạc", "Đồng", "Vàng", "Nhôm"],
    correctAnswer: 2
}, {
    question: "Đâu không phải là một ngôn ngữ lập trình?",
    options: ["Python", "Java", "HTML", "C++"],
    correctAnswer: 2
}, {
    question: "Loại nhạc cụ nào có dây?",
    options: ["Kèn trumpet", "Trống", "Piano", "Sáo"],
    correctAnswer: 2
}, {
    question: "Môn thể thao vua là môn nào?",
    options: ["Bóng rổ", "Bóng chuyền", "Bóng đá", "Quần vợt"],
    correctAnswer: 2
}, {
    question: "Đơn vị đo cường độ dòng điện là gì?",
    options: ["Volt", "Watt", "Ampe", "Ohm"],
    correctAnswer: 2
}, {
    question: "Nước nào có diện tích lớn nhất thế giới?",
    options: ["Trung Quốc", "Canada", "Hoa Kỳ", "Nga"],
    correctAnswer: 3
}, {
    question: "Ai vẽ bức tranh Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2
}, {
    question: "Thành phần chính của không khí là gì?",
    options: ["Oxy", "Nitơ", "CO2", "Hydro"],
    correctAnswer: 1
}, {
    question: "Con vật nào sau đây không thuộc lớp bò sát?",
    options: ["Rắn", "Thằn lằn", "Cá sấu", "Ếch"],
    correctAnswer: 3
}, {
    question: "Ngày Quốc tế Phụ nữ là ngày nào?",
    options: ["8/3", "20/10", "1/6", "14/2"],
    correctAnswer: 0
}, {
    question: "Đâu là tên của một hành tinh trong hệ Mặt Trời?",
    options: ["Sirius", "Andromeda", "Sao Hỏa", "Thiên Hà"],
    correctAnswer: 2
}, {
    question: "Thủ đô của Pháp là gì?",
    options: ["London", "Berlin", "Paris", "Rome"],
    correctAnswer: 2
}, {
    question: "Kim tự tháp Giza nằm ở quốc gia nào?",
    options: ["Hy Lạp", "Ấn Độ", "Ai Cập", "Mexico"],
    correctAnswer: 2
}, {
    question: "Loại quả nào sau đây không phải là quả mọng?",
    options: ["Dâu tây", "Nho", "Chuối", "Việt quất"],
    correctAnswer: 2
}, {
    question: "Ai là tác giả của bộ truyện Harry Potter?",
    options: ["J.R.R. Tolkien", "J.K. Rowling", "George R.R. Martin", "Stephen King"],
    correctAnswer: 1
}, {
    question: "Thế vận hội Olympic hiện đại đầu tiên được tổ chức vào năm nào?",
    options: ["1886", "1896", "1900", "1924"],
    correctAnswer: 1
}, {
    question: "Đâu là tên một hệ điều hành máy tính?",
    options: ["Microsoft Word", "Adobe Photoshop", "Windows", "Google Chrome"],
    correctAnswer: 2
}, {
    question: "Nguyên tố nào phổ biến nhất trong vũ trụ?",
    options: ["Oxy", "Sắt", "Hydro", "Carbon"],
    correctAnswer: 2
}, {
    question: "Loại đá nào được hình thành từ xác động thực vật?",
    options: ["Đá hoa cương", "Đá vôi", "Đá bazan", "Đá cuội"],
    correctAnswer: 1
}, {
    question: "Quốc gia nào có hình dạng giống chiếc ủng?",
    options: ["Hy Lạp", "Thổ Nhĩ Kỳ", "Ý", "Tây Ban Nha"],
    correctAnswer: 2
}];

// Các biến toàn cục
let currentQuestionIndex = 0;
let userAnswers = Array(questions.length).fill(null);
let answeredQuestions = 0;
let userInfo = {};

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

// URL Google Apps Script (thay bằng URL của bạn)
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycby8755k-eccdi8ehjHWe0G_tGvIR_D2QL5o09PaF6xNIGYRDQBBux9EInBs4ecHofY39g/exec";

// Khởi tạo ứng dụng
function init() {
    // Thêm sự kiện cho form thông tin
    infoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Lấy thông tin từ form
        userInfo = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value || '',
            timestamp: new Date().toISOString()
        };

        // Gửi dữ liệu đến Google Sheets
        sendDataToGoogleSheets(userInfo);
    });

    // Thêm sự kiện cho nút khởi động lại
    restartBtn.addEventListener('click', restartQuiz);
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
    fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Chuyển sang bài trắc nghiệm sau 1.5 giây
                setTimeout(() => {
                    startQuiz();
                }, 1500);
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
    // Ẩn form thông tin, hiển thị bài trắc nghiệm
    infoFormContainer.classList.add('hidden');
    quizContainer.classList.remove('hidden');

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

    // Cập nhật chỉ số câu hỏi
    currentQuestionEl.textContent = index + 1;

    // Hiển thị nội dung câu hỏi
    questionText.textContent = question.question;

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