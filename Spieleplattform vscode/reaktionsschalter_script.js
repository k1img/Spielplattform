// Variablen für das Spiel
let gameState = 'START'; // START, WAITING, READY, DONE
let startTime;
let endTime;
let darkInterval;
let darkFactor = 0;

// Elemente
const switchElement = document.querySelector('.light-switch');
const instructionDisplay = document.getElementById('instruction-display');
const resultDisplay = document.getElementById('result-display');

// Cookie Banner Logik (kopiert aus der Haupt-script.js)
const STORAGE_KEY_COOKIE_ACCEPTED = 'klickzaehler_cookie_accepted';
let cookieBanner;
let acceptCookieBtn;
let cookieOverlay;


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

window.loadState = function() {
    // Zuweisung der Cookie-Elemente
    cookieBanner = document.getElementById("cookieBanner");
    acceptCookieBtn = document.getElementById("acceptCookie");
    cookieOverlay = document.getElementById("cookieOverlay"); 
    showCookieBanner();
}


// --- SPIEL LOGIK ---

function handleSwitchClick() {
    if (gameState === 'START' || gameState === 'DONE') {
        startGame();
    } else if (gameState === 'READY') {
        endGame();
    } else if (gameState === 'WAITING') {
        tooEarly();
    }
}

function startGame() {
    gameState = 'WAITING';
    instructionDisplay.innerText = "Warten Sie auf das Signal...";
    resultDisplay.style.display = 'none';
    switchElement.classList.remove('off');
    switchElement.classList.add('on');
    resetBackground();

    darkInterval = setInterval(makeDarker, 500); 
    
    const waitTime = Math.random() * 3000 + 2000; 
    setTimeout(readySignal, waitTime);
}

function makeDarker() {
    darkFactor += 0.05; // Wird alle 0.5s dunkler
    document.body.style.filter = `brightness(${1 - darkFactor})`;
    if (darkFactor >= 1) { // Spiel beenden, wenn es komplett dunkel ist
        endGame(true); 
    }
}

function readySignal() {
    if (gameState !== 'WAITING') return; 
    
    gameState = 'READY';
    clearInterval(darkInterval); 
    startTime = Date.now();
    instructionDisplay.innerText = "JETZT KLICKEN!";
}

function endGame(timeout = false) {
    gameState = 'DONE';
    switchElement.classList.remove('on');
    switchElement.classList.add('off');
    document.body.style.filter = 'brightness(1)'; 
    clearInterval(darkInterval);

    if (timeout) {
        instructionDisplay.innerText = "Zu langsam! Versuchen Sie es erneut.";
        resultDisplay.style.display = 'none';
    } else {
        endTime = Date.now();
        const reactionTime = endTime - startTime;
        instructionDisplay.innerText = "Ihre Reaktionszeit:";
        resultDisplay.innerText = `${reactionTime} ms`;
        resultDisplay.style.display = 'block';
    }
}

function tooEarly() {
    gameState = 'START'; 
    instructionDisplay.innerText = "Zu früh geklickt! Versuchen Sie es erneut.";
    document.body.style.filter = 'brightness(1)'; 
    switchElement.classList.remove('on');
    switchElement.classList.add('off');
    clearInterval(darkInterval);
    darkFactor = 0;
}

function resetBackground() {
    darkFactor = 0;
    document.body.style.filter = 'brightness(1)';
    document.body.style.transition = 'filter 0.5s ease-out';
}

// Initialer Aufruf
resetBackground();
