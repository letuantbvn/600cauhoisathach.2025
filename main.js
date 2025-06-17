// Khi truy cập index.html, giả lập URL là /
if (window.location.pathname.endsWith("../600cauhoisathach.2025/index.html")) {
    history.replaceState({}, "", "/");
} <

// Khi truy cập meo.html, giả lập URL là /meo
if (window.location.pathname.endsWith("../600cauhoisathach.2025/meo.html")) {
    history.replaceState({}, "", "/meo");
} <

// Khi truy cập index.html, giả lập URL là /
if (window.location.pathname.endsWith("../600cauhoisathach.2025/index.html")) {
    history.replaceState({}, "", "/");
} <


// Khi truy cập 120mophong.html, giả lập URL là /120mophong
if (window.location.pathname.endsWith("../600cauhoisathach.2025/120mophong.html")) {
    history.replaceState({}, "", "/120mophong");
} <

// Khi truy cập galery.html, giả lập URL là /galery
if (window.location.pathname.endsWith("../600cauhoisathach.2025/galery.html")) {
    history.replaceState({}, "", "/galery");
} <

// Khi truy cập exam.html, giả lập URL là /exam
if (window.location.pathname.endsWith("../600cauhoisathach.2025/exam.html")) {
    history.replaceState({}, "", "/exam");
} <

// Khi truy cập examb.html, giả lập URL là /examb
if (window.location.pathname.endsWith("../600cauhoisathach.2025/examb.html")) {
    history.replaceState({}, "", "/examb");
} <

// Khi truy cập examc1.html, giả lập URL là /examc1
if (window.location.pathname.endsWith("../600cauhoisathach.2025/examc1.html")) {
    history.replaceState({}, "", "/examc1");
} <

// Khi truy cập examc.html, giả lập URL là /examc
if (window.location.pathname.endsWith("../600cauhoisathach.2025/examc.html")) {
    history.replaceState({}, "", "/examc");
} <

// Khi truy cập examd.html, giả lập URL là /examd
if (window.location.pathname.endsWith("../600cauhoisathach.2025/examd.html")) {
    history.replaceState({}, "", "/examd");
} <

// Khi truy cập exam60.html, giả lập URL là /exam60
if (window.location.pathname.endsWith("../600cauhoisathach.2025/exam60.html")) {
    history.replaceState({}, "", "/exam60");
} <

// Khi truy cập exam600.html, giả lập URL là /exam600
if (window.location.pathname.endsWith("../600cauhoisathach.2025/exam600.html")) {
    history.replaceState({}, "", "/exam600");
} <
// Khi truy cập exam600cauhoisathach.html, giả lập URL là /exam600cauhoisathach
if (window.location.pathname.endsWith("../600cauhoisathach.2025/exam600cauhoisathach.html")) {
    history.replaceState({}, "", "/exam600cauhoisathach");
} <

// Giả lập URL cho các trang khác nếu cần
const pages = ["exam.html", "examb.html", "examc1.html", "examc.html", "examd.html", "exam60.html", "exam600.html"];
pages.forEach(page => {
    if (window.location.pathname.endsWith(`../600cauhoisathach.2025/${page}`)) {
        history.replaceState({}, "", `/${page.replace('.html', '')}`);
    }
});