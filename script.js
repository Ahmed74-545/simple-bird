const bird = document.getElementById('bird');
const column = document.getElementById('column');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over');
const finalScore = document.getElementById('final-score');
const backgroundMusic = document.getElementById('background-music');
const jumpSound = document.getElementById('jump-sound');
const hitSound = document.getElementById('hit-sound');

let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
let gravity = 2; // قوة الجاذبية
let jumpHeight = 20; // ارتفاع القفزة الابتدائي
let score = 0;
let columnSpeed = 3;
let columnInterval, scoreInterval;
let isGameRunning = false;

// احضار النقاط العليا من التخزين المحلي
let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.innerText = 'النقاط العليا: ' + highScore;

function startGame() {
    document.getElementById('start-screen').style.display = 'none';
    backgroundMusic.play();
    isGameRunning = true;
    columnInterval = setInterval(moveColumn, 20);
    scoreInterval = setInterval(increaseScore, 1000);
    falling();
}

function jump() {
    if (isGameRunning) {
        jumpSound.currentTime = 0;
        jumpSound.play();
        let jumpCount = 0;
        let jumpInterval = setInterval(function() {
            if (jumpCount < jumpHeight) {
                birdTop -= 5; // الطائر يرتفع
                bird.style.top = birdTop + 'px';
            } else {
                clearInterval(jumpInterval);
                falling(); // بدء السقوط بعد القفز
            }
            jumpCount++;
        }, 20);
        jumpHeight += 5; // زيادة ارتفاع القفزة
    }
}

function falling() {
    let fallInterval = setInterval(function() {
        if (birdTop < 520) { // إذا لم يصل إلى الأرض
            birdTop += gravity; // جعل الطائر يقع تدريجياً
            bird.style.top = birdTop + 'px';
        } else {
            birdTop = 520; // تعيين موضع الطائر
            clearInterval(fallInterval);
            jumpHeight = 20; // إعادة ارتفاع القفزة إلى البداية
        }
    }, 20);
}

function moveColumn() {
    let columnLeft = parseInt(window.getComputedStyle(column).getPropertyValue('right'));
    columnLeft += columnSpeed;

    if (columnLeft > 400) { // إذا كان العمود خرج عن الشاشة
        columnLeft = -60; // إعادة العمود إلى البداية
        randomizeColumnHeight();
    }

    column.style.right = columnLeft + 'px';

    const birdRect = bird.getBoundingClientRect();
    const columnRect = column.getBoundingClientRect();

    // التحقق من الاصطدام
    if (columnLeft > 20 && columnLeft < 80 && birdRect.bottom >= columnRect.top && birdRect.top <= columnRect.bottom) {
        hitSound.play();
        endGame();
    }
}

function increaseScore() {
    score++;
    scoreElement.innerText = 'النقاط: ' + score;

    // تحديث النقاط العليا
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        highScoreElement.innerText = 'النقاط العليا: ' + highScore;
    }

    if (score % 10 === 0) {
        columnSpeed += 1; // زيادة سرعة العمود كل 10 نقاط
    }
}

function randomizeColumnHeight() {
    const randomHeight = Math.floor(Math.random() * 150) + 100; // قيمة عشوائية بين 100 و 250
    column.style.height = randomHeight + 'px'; // تعيين ارتفاع العمود العشوائي
}

function endGame() {
    clearInterval(columnInterval);
    clearInterval(scoreInterval);
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    isGameRunning = false;
    finalScore.innerText = 'نقاطك: ' + score;
    gameOverScreen.style.display = 'block'; // عرض شاشة نهاية اللعبة
}

function resetGame() {
    score = 0;
    scoreElement.innerText = 'النقاط: 0';
    birdTop = 250;
    bird.style.top = birdTop + 'px';
    column.style.right = '-60px';
    column.style.height = '200px'; // إعادة ارتفاع العمود إلى القيم الافتراضية
    gameOverScreen.style.display = 'none';
    startGame();
}

document.addEventListener('touchstart', jump);