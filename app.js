const { CONNREFUSED } = require('dns');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);

/*const mostrar = document.getElementById('cantidad');*/

var conectados = [];
conectados.push(0);
var maximo = [];
maximo.push(12);
var nombres = [];
nombres.push([]);
var sumador = [];
sumador.push([]);
sumador[0].push(0);
listos = [];
listos.push(0);
var nombreaula = 'aula0';
var numaula;
libres = [];
libres.push(true);
var soquetes = [];
soquetes.push([]);
var lista = '';
var adondereenvio;



io.on('connection', (socket) => {
    socket.join(nombreaula);
    let indiceaula = nombreaula.indexOf('aula');
    numaula = nombreaula.slice(indiceaula + 4);
    numaula = parseInt(numaula);
    conectados[numaula] += 1;
    soquetes[numaula].push(socket.id);
    
    console.log(`Un usuario se ha conectado: ${socket.id}, total: ${conectados}` + nombreaula);

    if (conectados[numaula] < maximo[numaula] + 1) {
        if (conectados[numaula] < 2) {
            socket.emit('chat', 'bienvenido, primer jugador')
        } else
            socket.emit('chat', 'bienvenido, hay ' + conectados[numaula] + ' jugadores conectados');
        io.in(nombreaula).emit('chat', 'AGRE' + conectados[numaula] + 'GADOS');
    } else
        socket.emit('chat', 'completo');

    socket.on('disconnect', () => {
        for (s = 0; s < soquetes.length; s++) {
            for (i = 0; i < soquetes[s].length; i++) {
                if (soquetes[s][i] == socket.id) {
                    soquetes[s].splice(i, 1);
                    console.log(`${s}__${i}`);
                    nombres[s].splice(i, 1);
                    conectados[s]--;
                    if (libres[s] == false) { maximo[s]-- };
                    console.log(libres[s] + '--' + maximo[s]);
                    if (listos[s] > 0) { listos[s]-- };
                    if (conectados[s] < 1) {
                        nombres[s] = [];
                        sumador[s] = [];
                        sumador[s].push(0);
                        maximo[s] = 12;
                        for (l = 0; l < libres.length; l++) {
                            if (libres[l] == true && conectados[l] > 0) {
                                libres[s] = false
                            } else
                                libres[s] = true
                        };
                    };
                };
            };
        };

        console.log(`Ususario desconectado: ${socket.id}, total: ${conectados}`);
        console.log(libres);
        console.log(listos);
        console.log(nombres);
        io.in(adondereenvio).emit('chat', 'INCO' + conectados[numaula] + 'NECTADO');
    });

    socket.on('chat', (msg) => {
        if (msg.includes('aula')) {
            let veraula = msg.indexOf('aula');
            adondereenvio = msg.slice(veraula);
            numaula = msg.slice(veraula + 4);
            msg = msg.slice(0, veraula);
            console.log(adondereenvio + '--' + msg);
        };
        if (msg.includes('LISTOSI')) {
            listos[numaula]++;
            io.in(adondereenvio).emit('chat', 'LISTADOS' + listos[numaula] + 'CALISTO');
            console.log(listos[numaula] + '--' + numaula);
        };
        if (msg.includes('LISTONO') && listos[numaula] > 0) {
            listos[numaula]--;
            io.in(adondereenvio).emit('chat', 'LISTADOS' + listos[numaula] + 'CALISTO');
        };
        if (msg.includes('$&&$')) {
            let antesnombre = msg.indexOf('$&&$');
            let despuesnombre = msg.indexOf('&$$&');
            let nuevonombre = msg.slice(antesnombre + 4, despuesnombre);
            if (nombres[numaula].length > 0) {
                for (var i = 0; i < nombres[numaula].length; i++) {
                    if (nuevonombre == nombres[numaula][i]) {
                        sumador[numaula][i]++;
                        nuevonombre = nuevonombre + '-' + sumador[numaula][i];
                        socket.emit('chat', 'CAMBIAR' + nuevonombre + 'BIARCAM')
                    } else
                        sumador[numaula].push(0);
                };
            };
            nombres[numaula].push(nuevonombre);
            for (var n = 0; n < nombres[numaula].length; n++) {
                let aumen = n + 1;
                lista = lista.concat(aumen + ') ')
                lista = lista.concat(nombres[numaula][n]);
                lista = lista.concat('~  ');
                lista = lista.toString();
            };
            io.in(adondereenvio).emit('chat', `ESTOS ${lista} SOMOS`);
            console.log(nombres);
            lista = '';
        };
        
        socket.broadcast.to(adondereenvio).emit('chat', msg);

        if (msg.includes('GANADOR')) {
            nombres[numaula] = [];
            sumador[numaula] = [];
            sumador[numaula].push(0);
            maximo[numaula] = 12;
            console.log('antes' + nombreaula);
            for (l = 0; l < libres.length; l++) {
                if (libres[l] == true && conectados[l] > 0) {
                    libres[numaula] = false
                } else
                    libres[numaula] = true
            };
            for (var l = 0; l < libres.length; l++) {
                if (libres[l] == true) {
                    nombreaula = 'aula' + l;
                    l = libres.length;
                }
            };
            console.log('después' + nombreaula);
            console.log('maximo' + numaula + ' = ' + maximo[numaula]);
        };

        if (msg.includes('MAXIMO')) {
            let quitar = msg.split(' ');
            maximo[numaula] = parseInt(quitar[1]);
            console.log(maximo);
            listos[numaula] = 0;
            console.log(numaula);
            libres[numaula] = false;
            if (conectados[numaula + 1] == null) { numaula++ };
            if (conectados[numaula] == null) { conectados.push(0) };
            if (maximo[numaula] == null) { maximo.push(12) };
            if (nombres[numaula] == null) { nombres.push([]) };
            if (listos[numaula] == null) { listos.push(0) };
            if (sumador[numaula] == null) { sumador.push([]) };
            if (sumador[numaula][0] == null) { sumador[numaula].push(0) };
            if (libres[numaula] == null) { libres.push(true) };
            if (soquetes[numaula] == null) { soquetes.push([]) };
            console.log(libres);
            for (var l = 0; l < libres.length; l++) {
                if (libres[l] == false && conectados[l] < 1) {
                    libres[l] = true
                };
            };
            for (var l = 0; l < libres.length; l++) {
                if (libres[l] == false && conectados[l] > 0 && nombres[l].length < 1) {
                    libres[l] = true
                };
            };
            for (var l = 0; l < libres.length; l++) {
                if (libres[l] == true) {
                    nombreaula = 'aula' + l;
                    l = libres.length;
                } 
            };
            console.log(soquetes);
        };

    });

    if (conectados[numaula] == 12) {
        let proximo = numaula + 1;
        if (conectados[proximo] == null) { conectados.push(0) };
        if (maximo[proximo] == null) { maximo.push(12) };
        if (nombres[proximo] == null) { nombres.push([]) };
        if (listos[proximo] == null) { listos.push(0) };
        if (sumador[proximo] == null) { sumador.push([]) };
        if (sumador[proximo][0] == null) { sumador[proximo].push(0) };
        if (libres[proximo] == null) { libres.push(true) };
        if (soquetes[proximo] == null) { soquetes.push([]) };
        nombreaula = 'aula' + proximo;
    };
});

app.get('/', (req, res) => {
    if (conectados[0] < maximo[0] && libres[0] == true) {
        res.sendFile(`${__dirname}/index0.html`);
    } else if (conectados[1] < maximo[1] && libres[1] == true)
        res.sendFile(`${__dirname}/index1.html`);
    else if (conectados[2] < maximo[2] && libres[2] == true) {
        res.sendFile(`${__dirname}/index2.html`);
    } else if (conectados[3] < maximo[3] && libres[3] == true) {
        res.sendFile(`${__dirname}/index3.html`);
    } else if (conectados[4] < maximo[4] && libres[4] == true) {
        res.sendFile(`${__dirname}/index4.html`);
    } else if (conectados[5] < maximo[5] && libres[5] == true) {
        res.sendFile(`${__dirname}/index5.html`);
    } else
        res.send('<h2 id="aula">SALONES COMPLETOS</h2>'); 
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');

});

