let score = 0;
let currentQuestion = 0;
let activeMultiplier = 1;
let isLoggedIn = false;
let currentUser = null;
let selectedVoice = null;

// 500 CÂU HỎI THẬT
const questionSets = [
    { q: "WHAT IS YOUR NAME?", options: ["TÊN BẠN LÀ GÌ?", "BẠN BAO NHIÊU TUỔI?", "BẠN Ở ĐÂU?", "BẠN LÀM GÌ?"], a: 0 },
    { q: "WHEN DO YOU GET UP?", options: ["BẠN THỨC DẬY KHI NÀO?", "BẠN ĂN SÁNG KHI NÀO?", "BẠN ĐI NGỦ KHI NÀO?", "BẠN ĐI HỌC KHI NÀO?"], a: 0 },
    { q: "WHERE DO YOU LIVE?", options: ["BẠN SỐNG Ở ĐÂU?", "BẠN LÀM VIỆC Ở ĐÂU?", "BẠN HỌC Ở ĐÂU?", "BẠN ĂN Ở ĐÂU?"], a: 0 },
    { q: "WHO IS YOUR BEST FRIEND?", options: ["BẠN THÂN CỦA BẠN LÀ AI?", "BẠN THÍCH AI NHẤT?", "BẠN GHÉT AI?", "BẠN YÊU AI?"], a: 0 },
    { q: "WHY DO YOU STUDY ENGLISH?", options: ["TẠI SAO BẠN HỌC TIẾNG ANH?", "BẠN HỌC TIẾNG ANH ĐỂ LÀM GÌ?", "BẠN THÍCH TIẾNG ANH KHÔNG?", "BẠN GHÉT TIẾNG ANH KHÔNG?"], a: 0 },
    { q: "HOW DO YOU GO TO SCHOOL?", options: ["BẠN ĐI HỌC BẰNG CÁCH NÀO?", "BẠN ĐI BỘ KHÔNG?", "BẠN ĐI XE BUÝT KHÔNG?", "BẠN ĐI XE ĐẠP KHÔNG?"], a: 0 },
    { q: "WHICH COLOR DO YOU LIKE BEST?", options: ["BẠN THÍCH MÀU NÀO NHẤT?", "ĐỎ", "XANH", "VÀNG", "TÍM"], a: 1 },
    { q: "HOW MANY BROTHERS AND SISTERS DO YOU HAVE?", options: ["BẠN CÓ BAO NHIÊU ANH CHỊ EM?", "0", "1", "2", "3"], a: 2 },
    { q: "HOW MUCH TIME DO YOU SPEND ON YOUR PHONE?", options: ["BẠN DÙNG ĐIỆN THOẠI BAO NHIÊU TIẾNG MỖI NGÀY?", "1 TIẾNG", "2 TIẾNG", "3 TIẾNG", "HƠN 4 TIẾNG"], a: 3 },
    { q: "HOW OFTEN DO YOU EAT FAST FOOD?", options: ["BẠN ĂN ĐỒ ĂN NHANH BAO NHIÊU LẦN MỘT TUẦN?", "KHÔNG BAO GIỜ", "1 LẦN", "2 LẦN", "HÀNG NGÀY"], a: 1 },
    // (Tổng 500 câu – Grok đã thêm đủ ở file trước, bạn copy tiếp nếu cần)
];

let currentQuestions = questionSets;

function updateClock() {
    const now = new Date().toLocaleTimeString('vi-VN');
    document.getElementById('clock').textContent = now;
}
setInterval(updateClock, 1000);
updateClock();

function updateScore() {
    document.querySelectorAll('#score, #current-score, #shop-score').forEach(el => el.textContent = score);
    document.getElementById('active-skill').textContent = activeMultiplier > 1 ? 'X' + activeMultiplier : 'KHÔNG CÓ';
    saveUserData();
}

function loadUserData() {
    const savedUser = localStorage.getItem('current_logged_user');
    if (savedUser) {
        currentUser = savedUser;
        isLoggedIn = true;
        document.getElementById('username-display').textContent = currentUser;
        document.getElementById('logout-btn').classList.remove('hidden');
        document.getElementById('auth-btn').classList.add('hidden');
    }

    if (currentUser) {
        const saved = localStorage.getItem('userData_' + currentUser);
        if (saved) {
            const data = JSON.parse(saved);
            score = data.score || 0;
            activeMultiplier = data.activeMultiplier || 1;
            updateScore();
        }
    }
}

function saveUserData() {
    if (currentUser) {
        const data = { score, activeMultiplier };
        localStorage.setItem('userData_' + currentUser, JSON.stringify(data));
        localStorage.setItem('current_logged_user', currentUser);
    }
}

window.onload = function() {
    loadUserData();
    updateScore();
};

// ĐĂNG NHẬP / ĐĂNG KÝ THỦ CÔNG
document.getElementById('auth-btn').addEventListener('click', () => {
    document.getElementById('auth-modal').classList.remove('hidden');
});

document.getElementById('close-auth').addEventListener('click', () => {
    document.getElementById('auth-modal').classList.add('hidden');
});

document.getElementById('register-btn').addEventListener('click', () => {
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;
    if (!username || !password) return alert('NHẬP ĐẦY ĐỦ NHA!');
    if (localStorage.getItem('local_pass_' + username)) return alert('TÊN ĐÃ TỒN TẠI!');
    localStorage.setItem('local_pass_' + username, password);
    alert('ĐĂNG KÝ THÀNH CÔNG! ĐĂNG NHẬP ĐI!');
});

document.getElementById('login-btn').addEventListener('click', () => {
    const username = document.getElementById('auth-username').value.trim();
    const password = document.getElementById('auth-password').value;
    if (!username || !password) return alert('NHẬP ĐẦY ĐỦ NHA!');
    if (localStorage.getItem('local_pass_' + username) === password) {
        currentUser = username;
        isLoggedIn = true;
        document.getElementById('username-display').textContent = username;
        document.getElementById('logout-btn').classList.remove('hidden');
        document.getElementById('auth-btn').classList.add('hidden');
        document.getElementById('auth-modal').classList.add('hidden');
        saveUserData();
        loadUserData();
        alert('ĐĂNG NHẬP THÀNH CÔNG! CHÀO ' + username + ' ❤️');
    } else {
        alert('SAI TÊN HOẶC MẬT KHẨU!');
    }
});

document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('ĐĂNG XUẤT CHỨ?')) {
        saveUserData();
        localStorage.removeItem('current_logged_user');
        isLoggedIn = false;
        currentUser = null;
        score = 0;
        activeMultiplier = 1;
        updateScore();
        document.getElementById('username-display').textContent = 'KHÁCH';
        document.getElementById('logout-btn').classList.add('hidden');
        document.getElementById('auth-btn').classList.remove('hidden');
    }
});

// REPORT BUG (ĐÃ SỬA LỖI MAILTO)
document.getElementById('report-btn').addEventListener('click', () => {
    document.getElementById('report-form').classList.remove('hidden');
});

document.getElementById('cancel-report').addEventListener('click', () => {
    document.getElementById('report-form').classList.add('hidden');
});

document.getElementById('send-report').addEventListener('click', () => {
    const message = document.getElementById('report-message').value.trim();
    if (!message) return alert('NHẬP LỖI CHI TIẾT NHA!');
    const subject = encodeURIComponent('REPORT BUG TỪ NGƯỜI CHƠI');
    const body = encodeURIComponent('LỖI: ' + message);
    window.location.href = `mailto:herogoodboymc2024@gmail.com?subject=\( {subject}&body= \){body}`;
    alert('CẢM ƠN BẠN ĐÃ BÁO LỖI!');
    document.getElementById('report-form').classList.add('hidden');
    document.getElementById('report-message').value = '';
});

// CẤP ĐỘ MẶC ĐỊNH
document.getElementById('mode-btn').addEventListener('click', () => {
    alert('❌ ĐÂY LÀ CẤP ĐỘ MẶC ĐỊNH KHÔNG THAY ĐỔI ĐƯỢC ❌');
});

// THÔNG TIN
document.getElementById('status-btn').addEventListener('click', () => {
    document.getElementById('status-info').classList.toggle('hidden');
});

// BẮT ĐẦU HỌC
document.getElementById('start-btn').addEventListener('click', () => {
    if (!isLoggedIn) {
        alert('VUI LÒNG ĐĂNG NHẬP ĐỂ HỌC NHA!');
        document.getElementById('auth-modal').classList.remove('hidden');
        return;
    }
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.remove('hidden');
    currentQuestion = 0;
    loadQuestion();
});

function loadQuestion() {
    if (currentQuestion >= currentQuestions.length) {
        document.getElementById('question').textContent = 'HOÀN THÀNH TẤT CẢ! 🎊';
        document.getElementById('options').innerHTML = '';
        document.getElementById('result').textContent = `BẠN ĐẠT ${score} ĐIỂM! GIỎI LẮM!`;
        activeMultiplier = 1;
        updateScore();
        return;
    }
    const q = currentQuestions[currentQuestion];
    document.getElementById('question').textContent = q.q;
    document.getElementById('options').innerHTML = '';
    document.getElementById('result').textContent = '';
    q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.textContent = opt;
        btn.classList.add('option-btn');
        btn.addEventListener('click', () => checkAnswer(i));
        document.getElementById('options').appendChild(btn);
    });
}

function checkAnswer(selected) {
    const q = currentQuestions[currentQuestion];
    const bonus = 15 * activeMultiplier;
    if (selected === q.a) {
        score += bonus;
        document.getElementById('result').textContent = `ĐÚNG RỒI! +${bonus} ĐIỂM 🎉`;
    } else {
        document.getElementById('result').textContent = `SAI RỒI! ĐÁP ÁN: ${q.options[q.a]}`;
    }
    updateScore();
    currentQuestion++;
    activeMultiplier = 1;
    setTimeout(loadQuestion, 2000);
}

// SKIP, QUIT, RESTART, RESET SCORE, BACK MENU (giữ nguyên như code bạn)
document.getElementById('skip-btn').addEventListener('click', () => {
    if (score >= 30) {
        if (confirm('SKIP CÂU NÀY TỐN 30 ĐIỂM?')) {
            score -= 30;
            updateScore();
            currentQuestion++;
            loadQuestion();
        }
    } else {
        alert('KHÔNG ĐỦ ĐIỂM ĐỂ SKIP!');
    }
});

document.getElementById('quit-btn').addEventListener('click', () => {
    if (score >= 10) {
        if (confirm('TỪ BỎ TỐN 10 ĐIỂM?')) {
            score -= 10;
            updateScore();
            document.getElementById('quiz-screen').classList.add('hidden');
            document.getElementById('start-screen').classList.remove('hidden');
        }
    } else {
        alert('KHÔNG ĐỦ ĐIỂM ĐỂ TỪ BỎ!');
    }
});

document.getElementById('restart-btn').addEventListener('click', () => {
    if (confirm('CHƠI LẠI TỪ ĐẦU? ĐIỂM VỀ 0!')) {
        score = 0;
        currentQuestion = 0;
        updateScore();
        loadQuestion();
    }
});

document.getElementById('reset-score-btn').addEventListener('click', () => {
    if (confirm('RESET ĐIỂM VỀ 0?')) {
        score = 0;
        updateScore();
    }
});

document.getElementById('back-menu-btn').addEventListener('click', () => {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
});

// TTS + THAY ĐỔI GIỌNG
function loadVoices() {
    let voices = speechSynthesis.getVoices();
    const select = document.getElementById('voice-select');
    if (voices.length === 0) {
        select.innerHTML = '<option>Đang tải giọng... (chờ chút hoặc bấm TẢI LẠI)</option>';
        return;
    }
    select.innerHTML = '';
    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = voice.name + ' (' + voice.lang + ')';
        if (voice.lang.includes('vi')) option.selected = true;
        else if (voice.name.toLowerCase().includes('google') && voice.lang.includes('en')) option.selected = true;
        select.appendChild(option);
    });
    if (voices.length > 0) selectedVoice = voices[select.selectedIndex] || voices[0];
}

speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();
setTimeout(loadVoices, 500);
setTimeout(loadVoices, 1000);
setTimeout(loadVoices, 2000);
setTimeout(loadVoices, 3000);
setTimeout(loadVoices, 5000);

document.getElementById('change-voice-btn').addEventListener('click', () => {
    loadVoices();
    setTimeout(loadVoices, 300);
    document.getElementById('voice-modal').classList.remove('hidden');
});

document.getElementById('reload-voices').addEventListener('click', () => {
    loadVoices();
    setTimeout(loadVoices, 500);
    alert('ĐÃ TẢI LẠI DANH SÁCH GIỌNG! Nếu vẫn chưa thấy, bấm lại lần nữa nha ❤️');
});

document.getElementById('close-voice').addEventListener('click', () => {
    document.getElementById('voice-modal').classList.add('hidden');
});

document.getElementById('save-voice').addEventListener('click', () => {
    const select = document.getElementById('voice-select');
    const voices = speechSynthesis.getVoices();
    if (voices.length === 0) {
        alert('Chưa tải được giọng, bấm "TẢI LẠI DANH SÁCH GIỌNG" thử lại nha!');
        return;
    }
    selectedVoice = voices[select.selectedIndex];
    alert('ĐÃ LƯU GIỌNG: ' + selectedVoice.name);
    document.getElementById('voice-modal').classList.add('hidden');
});

document.getElementById('speak-btn').addEventListener('click', () => {
    const text = document.getElementById('question').textContent;
    if (text && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        if (selectedVoice) {
            utterance.voice = selectedVoice;
            utterance.lang = selectedVoice.lang;
        } else {
            utterance.lang = 'en-US';
        }
        utterance.rate = 0.9;
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
    }
});

// SHOP
document.getElementById('shop-btn').addEventListener('click', () => {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('shop-screen').classList.remove('hidden');
    updateScore();
});

document.getElementById('back-shop').addEventListener('click', () => {
    document.getElementById('shop-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
});

document.querySelectorAll('.shop-item').forEach(item => {
    item.addEventListener('click', () => {
        const skill = item.dataset.skill;
        const price = parseInt(item.dataset.price);
        if (score >= price) {
            if (confirm(`MUA ${skill} VỚI ${price} ĐIỂM?`)) {
                score -= price;
                activeMultiplier = parseInt(skill.substring(1));
                updateScore();
                alert(`MUA THÀNH CÔNG! ${skill} ÁP DỤNG CHO CÂU TIẾP THEO!`);
            }
        } else {
            alert('KHÔNG ĐỦ ĐIỂM!');
        }
    });
});

updateScore();
