// --- 1. ALLE VARIABLEN UND KONSTANTEN DEKLARIEREN (ganz oben) ---
let counter = 0;
let time = 0;
let timerInterval = null;
let timerGestartet = false;
let highscore = 0; 

// Diese Variablen werden später in loadState() zugewiesen
let countElement;
let timerElement;
let counterTitleElement;
let mainBtn;
let highscoreElement;
let sidebarElement;
let overlayElement;
let leistBtn;
let cookieBanner;
let acceptCookieBtn;
let cookieOverlay; // NEU

const STORAGE_KEY_COUNT = 'klickzaehler_count';
const STORAGE_KEY_TIME  = 'klickzaehler_time';
const STORAGE_KEY_TITLE = 'klickzaehler_title';
const STORAGE_KEY_HIGHS = 'klickzaehler_highscore';
const STORAGE_KEY_COOKIE_ACCEPTED = 'klickzaehler_cookie_accepted'; // NEUER KEY


// --- 2. HILFS- UND ANIMATIONSFUNKTIONEN ---

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function getRandomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 30) + 50; 
    const l = Math.floor(Math.random() * 10) + 20; 
    return `hsl(${h}, ${s}%, ${l}%)`;
}

function changeBackgroundColors() {
    const newColor1 = getRandomColor();
    const newColor2 = getRandomColor(); 
    const newColor3 = getRandomColor();

    document.body.style.setProperty('--color-bg-start', newColor1);
    document.body.style.setProperty('--color-bg-mid', newColor2);
    document.body.style.setProperty('--color-bg-end', newColor3);
}

function triggerBubbleAnimation() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('bubble-wrapper');
    document.body.appendChild(wrapper);

    for (let i = 0; i < 20; i++) {
        createBubble(wrapper);
    }

    setTimeout(() => {
        document.body.removeChild(wrapper);
    }, 6000); 
}

function createBubble(wrapper) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    const size = Math.random() * 60 + 20; 
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${Math.random() * 100}%`;
    bubble.style.animationDuration = `${Math.random() * 4 + 4}s`; 
    bubble.style.animationDelay = `${Math.random() * 0.5}s`;
    wrapper.appendChild(bubble);
}

// --- COOKIE CONSENT FUNKTIONEN ---
function showCookieBanner() {
    const consentGiven = localStorage.getItem(STORAGE_KEY_COOKIE_ACCEPTED);
    
    if (!consentGiven && cookieBanner && cookieOverlay) {
        setTimeout(() => {
            cookieBanner.classList.add('visible');
            cookieOverlay.classList.add('visible');
        }, 500); 
    }

    if (acceptCookieBtn) {
        acceptCookieBtn.addEventListener('click', () => {
            localStorage.setItem(STORAGE_KEY_COOKIE_ACCEPTED, 'true');
            if (cookieBanner && cookieOverlay) {
                cookieBanner.classList.remove('visible');
                cookieOverlay.classList.remove('visible');
                setTimeout(() => {
                    cookieBanner.style.display = 'none';
                    cookieOverlay.style.display = 'none';
                }, 500);
            }
        });
    }
}


// --- 3. HAUPT-FUNKTIONEN DER APP (GLOBAL VERFÜGBAR GEMACHT) ---

window.toggleSidebar = function() {
    if (!sidebarElement || !overlayElement || !leistBtn) return;
    sidebarElement.classList.toggle('sichtbar');
    overlayElement.classList.toggle('sichtbar');
    if (sidebarElement.classList.contains('sichtbar')) {
        leistBtn.style.transform = 'rotate(90deg)';
        leistBtn.style.opacity = '1';
    } else {
        leistBtn.style.transform = 'rotate(0deg)';
        leistBtn.style.opacity = '0.8';
    }
}

window.resetHighscore = function() {
    if (confirm("Möchten Sie Ihren Highscore wirklich löschen?")) {
        highscore = 0;
        localStorage.setItem(STORAGE_KEY_HIGHS, '0');
        if (highscoreElement) highscoreElement.innerText = `Best: 0`;
    }
}

window.increment = function() {
    counter++;
    updateDisplay();
    startTimer();
    if (mainBtn) {
        mainBtn.classList.remove('ripple');
        void mainBtn.offsetWidth;
        mainBtn.classList.add('ripple');
    }
}

window.decrement = function() {
    if (counter > 0) {
        counter--;
        updateDisplay();
    }
}

window.resetCounter = function() {
    counter = 0;
    time = 0;
    updateDisplay();
    if (timerElement) timerElement.innerText = formatTime(time);
    stopTimer();
    saveState();
}


// --- 4. HINTERGRUND-FUNKTIONEN (Speichern, Laden, Timer, Update Display) ---

function updateDisplay() {
    if (countElement) countElement.innerText = counter;
    if (countElement) countElement.classList.add('pulse');
    setTimeout(() => { if (countElement) countElement.classList.remove('pulse'); }, 100);

    if (counter > 0 && counter % 500 === 0) { triggerBubbleAnimation(); }
    if (counter > 0 && counter % 1000 === 0) { changeBackgroundColors(); }
    
    if (counter > highscore) {
        highscore = counter;
        localStorage.setItem(STORAGE_KEY_HIGHS, highscore.toString());
        if (highscoreElement) highscoreElement.innerText = `Best: ${highscore}`;
        if (highscoreElement) highscoreElement.classList.add('new-high');
        setTimeout(() => { if (highscoreElement) highscoreElement.classList.remove('new-high'); }, 600);
    }
    saveState();
}

function startTimer() {
    if (!timerGestartet) {
        timerGestartet = true;
        timerInterval = setInterval(() => {
            time++;
            if (timerElement) timerElement.innerText = formatTime(time);
            saveState();
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timerGestartet = false;
}

function saveTitle() {
    if (counterTitleElement) localStorage.setItem(STORAGE_KEY_TITLE, counterTitleElement.innerText);
}

function saveState() {
    localStorage.setItem(STORAGE_KEY_COUNT, counter.toString());
    localStorage.setItem(STORAGE_KEY_TIME,  time.toString());
}


// --- 5. INITIALISIERUNG BEIM LADEN DER SEITE ---
window.loadState = function() {
    // Hier weisen wir den Variablen die Elemente zu, wenn die Seite geladen ist
    countElement = document.getElementById("count");
    timerElement = document.getElementById("timer");
    counterTitleElement = document.getElementById("counterTitle");
    mainBtn = document.querySelector(".main-btn");
    highscoreElement = document.getElementById("highscore");
    sidebarElement = document.getElementById("sidebar");
    overlayElement = document.querySelector(".overlay");
    leistBtn = document.getElementById("leistBtn");
    cookieBanner = document.getElementById("cookieBanner");
    acceptCookieBtn = document.getElementById("acceptCookie");
    cookieOverlay = document.getElementById("cookieOverlay"); 
    
    const savedCount = localStorage.getItem(STORAGE_KEY_COUNT);
    const savedTime  = localStorage.getItem(STORAGE_KEY_TIME);
    const savedTitle = localStorage.getItem(STORAGE_KEY_TITLE);
    const savedHigh  = localStorage.getItem(STORAGE_KEY_HIGHS);

    if (savedCount !== null && savedTime !== null) {
        counter = parseInt(savedCount, 10);
        time    = parseInt(savedTime, 10);
        if (countElement) countElement.innerText = counter;
        if (timerElement) timerElement.innerText = formatTime(time);
        if (counter > 0 && time > 0) { startTimer(); }
    }
    if (savedTitle !== null) { if (counterTitleElement) counterTitleElement.innerText = savedTitle; }
    if (savedHigh !== null) { highscore = parseInt(savedHigh, 10); if (highscoreElement) highscoreElement.innerText = `Best: ${highscore}`; }

    // Cookie Banner nach dem Laden der Seite anzeigen
    showCookieBanner();
}
