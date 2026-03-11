const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('morse-signal', (msg) => {
        // Schickt das Signal an alle außer den Absender
        socket.broadcast.emit('morse-receive', msg);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log('Server läuft...'));