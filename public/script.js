const socket = io();
const btn = document.getElementById('morse-btn');
const display = document.getElementById('display');
let startTime;

// Audio Kontext für den Piepton
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(duration) {
    const osc = audioCtx.createOscillator();
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + (duration / 1000));
}

btn.onpointerdown = (e) => {
    e.preventDefault();
    startTime = Date.now();
};

btn.onpointerup = (e) => {
    const duration = Date.now() - startTime;
    const type = duration < 200 ? '.' : '-';
    
    // Selbst hören
    playTone(duration);
    
    // An Partner senden
    socket.emit('morse-signal', { type, duration });
    display.innerHTML += type;
};

socket.on('morse-receive', (data) => {
    playTone(data.duration);
    display.innerHTML += data.type;
});