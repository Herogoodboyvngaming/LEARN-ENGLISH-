const data = {
    vi: { /* giữ nguyên như cũ */ 
        easy: [
            { q: "Xin chào trong tiếng Anh là gì?", options: ["Goodbye", "Hello", "Thank you", "Sorry"], a: 1 },
            { q: "Táo tiếng Anh là?", options: ["Orange", "Banana", "Apple", "Mango"], a: 2 },
            { q: "Cảm ơn là gì?", options: ["Hello", "Goodbye", "Thank you", "Please"], a: 2 },
            { q: "Nước trong tiếng Anh là gì?", options: ["Milk", "Water", "Coffee", "Tea"], a: 1 }
        ],
        normal: [
            { q: "Từ 'Beautiful' nghĩa là?", options: ["Xấu xí", "Đẹp", "Buồn", "Vui"], a: 1 },
            { q: "'Run' nghĩa là gì?", options: ["Ngồi", "Đi bộ", "Chạy", "Ngủ"], a: 2 }
        ],
        hard: [
            { q: "Từ 'Opportunity' nghĩa là gì?", options: ["Cơ hội", "Thất bại", "Kế hoạch", "Thử thách"], a: 0 },
            { q: "'Exquisite' nghĩa là?", options: ["Bình thường", "Tinh tế, tuyệt vời", "Xấu", "Lớn"], a: 1 }
        ],
        superhard: [
            { q: "Từ 'Ephemeral' nghĩa là?", options: ["Vĩnh cửu", "Ngắn ngủi", "Mạnh mẽ", "Lâu dài"], a: 1 },
            { q: "'Ubiquitous' nghĩa là?", options: ["Hiếm", "Có mặt khắp nơi", "Cổ điển", "Mới"], a: 1 }
        ],
        extreme: [
            { q: "Từ 'Sesquipedalian' nghĩa là gì?", options: ["Ngắn gọn", "Dùng từ dài phức tạp", "Im lặng", "Hài hước"], a: 1 },
            { q: "'Defenestration' nghĩa là hành động gì?", options: ["Ném ai đó ra cửa sổ", "Mở cửa", "Đóng cửa", "Ăn uống"], a: 0 }
        ]
    },
    en: { /* giữ nguyên */ 
        easy: [
            { q: "What is 'Xin chào' in English?", options: ["Goodbye", "Hello", "Thank you", "Sorry"], a: 1 },
            { q: "What is 'Táo' in English?", options: ["Orange", "Banana", "Apple", "Mango"], a: 2 }
        ],
        normal: [
            { q: "What does 'Beautiful' mean in Vietnamese?", options: ["Ugly", "Đẹp", "Sad", "Happy"], a: 1 }
        ],
        hard: [], superhard: [], extreme: []
    }
};

let currentLang = 'vi';
let currentMode = 'easy';
let currentQuestions = [];
let currentQuestion = 0;
let score = 0;

const els = {
    startScreen: document.getElementById('start-screen'),
    quizScreen: document.getElementById('quiz-screen'),
    question: document.getElementById('question'),
    options: document.getElementById('options'),
    result: document.getElementById('result'),
    scoreEl: document.getElementById('score'),
    nextBtn: document.getElementById('next-btn'),
    speakBtn: document.getElementById('speak-btn'),
    modeBtn: document.getElementById('mode-btn'),
    welcomeTitle: document.getElementById('welcome-title'),
    langModal: document.getElementById('lang-modal'),
    infoModal: document.getElementById('info-modal')
};

function updateTexts() {
    document.querySelector('header h1').textContent = currentLang === 'vi' ? '🇻🇳 Học Tiếng Anh Cùng Chí Dự 🇻🇳' : '🇻🇳 Learn English With Chí Dự 🇻🇳';
    els.welcomeTitle.textContent = currentLang === 'vi' ? 'Chào mừng bạn đến với quiz học ngoại ngữ!' : 'Welcome to the language learning quiz!';
}

// Report Bug - sửa link repo của bạn ở đây
document.getElementById('report-btn').onclick = () => {
    window.open('https://github.com/herogoodboyvngaming/LEARN-ENGLISH-/issues', '_blank'); // ← sửa tên repo nếu khác
};

// MỞ MODAL
document.getElementById('lang-btn').onclick = () => els.langModal.classList.remove('hidden');
document.getElementById('info-btn').onclick = () => els.infoModal.classList.remove('hidden');

// ĐÓNG MODAL BẰNG NÚT
document.getElementById('close-lang').onclick = () => els.langModal.classList.add('hidden');
document.getElementById('close-info').onclick = () => els.infoModal.classList.add('hidden');

// ĐÓNG KHI CLICK NỀN ĐEN HOẶC ESC
document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', e => {
        if (e.target === m) m.classList.add('hidden');
    });
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        els.langModal.classList.add('hidden');
        els.infoModal.classList.add('hidden');
    }
});

// Các chức năng khác giữ nguyên (ngôn ngữ, mode, quiz, phát âm...)
document.querySelectorAll('[data-lang]').forEach(btn =>
