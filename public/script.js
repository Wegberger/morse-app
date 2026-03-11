const socket = io();
const btn = document.getElementById('morse-btn');
const display = document.getElementById('display');
const textOutput = document.getElementById('text-output');

let startTime;
let timeout;

const MORSE_MAP = {
    ".-": "A", "-...": "B", "-.-.": "C", "-..": "D", ".": "E", "..-.": "F", "--.": "G", "....": "H", "..": "I", ".---": "J", "-.-": "K", ".-..": "L", "--": "M", "-.": "N", "---": "O", ".--.": "P", "--.-": "Q", ".-.": "R", "...": "S", "-": "T", "..-": "U", "...-": "V", ".--": "W", "-..-": "X", "-.--": "Y", "--..": "Z", "-----": "0", ".----": "1", "..---": "2", "...--": "3", "....-": "4", ".....": "5", "-....": "6", "--...": "7", "---..": "8", "----.": "9"
};

let currentLetter = "";

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(duration) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + (duration / 1000));
    osc.stop(audioCtx.currentTime + (duration / 1000));
}

function handleSignal(type, duration, isRemote = false) {
    playTone(duration);
    display.innerHTML += type;
    currentLetter += type;

    // Warte auf Ende des Buchstabens
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const char = MORSE_MAP[currentLetter] || "?";
        textOutput.innerHTML += char;
        display.innerHTML += " ";
        currentLetter = "";
    }, 800);
}

btn.onpointerdown = (e) => {
    e.preventDefault();
    startTime = Date.now();
};

btn.onpointerup = (e) => {
    const duration = Date.now() - startTime;
    const type = duration < 200 ? '.' : '-';
    
    handleSignal(type, duration);
    socket.emit('morse-signal', { type, duration });
};

socket.on('morse-receive', (data) => {
    handleSignal(data.type, data.duration, true);
});