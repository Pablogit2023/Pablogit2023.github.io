const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

/*const mostrar = document.getElementById('cantidad');*/

var conectados = 0;
var maximo = 12;

io.on('connection', (socket) => {
    conectados += 1;
    console.log(`Un usuario se ha conectado: ${socket.id}, total: ${conectados}`);

    if (conectados < maximo + 1) {
        if (conectados < 2) {
            socket.emit('chat', 'bienvenido, primer jugador')
        } else
            socket.emit('chat', 'bienvenido, hay ' + conectados + ' jugadores conectados');
        io.emit('chat', 'AGRE' + conectados + 'GADOS');
    } else
        socket.emit('chat', 'completo');

    socket.on('disconnect', () => {
        conectados -= 1;
        if (conectados < 1) {
            maximo = 12
        };
        console.log(`Ususario desconectado: ${socket.id}, total: ${conectados}`);
        io.emit('chat', 'INCO' + conectados + 'NECTADO');
    });
    //socket.on('create', function (room) {
    //    socket.join(room);
    //});
    //socket.on('join', (room) => {
    //    console.log(`Socket ${socket.id} joining ${room}`);
    //    socket.join(room);
    //});
    /*socket.join('some room')*/
    //socket.on('chat', (msg) => {
    //    console.log('Mensaje: ' + msg)
    //});
    socket.on('chat', (msg) => {
        if (msg.includes('MAXIMO')) {
            quitar = msg.split(' ');
            maximo = quitar[1];
        };
        if (conectados < maximo + 1) {
            socket.broadcast.emit('chat', msg)
        } else
            socket.emit('chat', 'completo');
    });
});

app.get('/', (req, res) => {
    //res.send('<hi>Aplicacion de Chat</hi>')
    if (conectados < maximo) {
        res.sendFile(`${__dirname}/index.html`)
    } else
        /*res.send('<hi id="completo">SALON COMPLETO</hi>') */
        res.sendFile(`${__dirname}/indexlleno.html`)

});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000')

});