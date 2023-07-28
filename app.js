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
sumador[0].push(1);
var listos = [];
listos.push(0);
var nombreaula = 'aula0';
var numaula = 0;
libres = [];
libres.push(true);
var soquetes = [];
soquetes.push([]);
var lista = '';
var lista2 = '';
var adondereenvio;



io.on('connection', (socket) => {
    socket.join(nombreaula);
    let indiceaula = nombreaula.indexOf('aula');
    let antesnumaula = nombreaula.slice(indiceaula + 4);
    numaula = parseInt(antesnumaula);
    conectados[numaula] += 1;
    soquetes[numaula].push(socket.id);
    
    console.log(`Un usuario se ha conectado: ${socket.id}, total conectados: ${conectados} y nombreaula: aula${numaula}`);

    if (conectados[numaula] < maximo[numaula] + 1) {
        if (conectados[numaula] < 2) {
            socket.emit('chat', 'bienvenido, primer jugador');
            io.in(nombreaula).emit('chat', 'AGRE' + conectados[numaula] + 'GADOS');
        } else {
            socket.emit('chat', 'bienvenido, hay ' + conectados[numaula] + ' jugadores conectados');
            io.in(nombreaula).emit('chat', 'AGRE' + conectados[numaula] + 'GADOS');
        };
    } else { 
        socket.emit('chat', 'completo');
    };

    socket.on('disconnect', () => {
        for (var s = 0; s < soquetes.length; s++) {
            for (i = 0; i < soquetes[s].length; i++) {
                if (soquetes[s][i] == socket.id) {
                    soquetes[s].splice(i, 1);
                    let esteaula = 'aula' + s;
                    console.log(`soquetes[s]: ${s} y soquetes[i]: ${i}`);
                    nombres[s].splice(i, 1);
                    console.log('splice del disconnect');
                    console.log(nombres);
                    lista2 = '';
                    for (var ni = 0; ni < nombres[s].length; ni++) {
                        let siguiente = ni + 1;
                        lista2 = lista2.concat(siguiente + ') ');
                        lista2 = lista2.concat(nombres[s][ni]);
                        lista2 = lista2.concat('~  ');
                        lista2 = lista2.toString();
                    };
                    io.in(esteaula).emit('chat', `ESTOS ${lista2} SOMOS`);
                    conectados[s]--;
                    if (libres[s] == false) { maximo[s]-- };
                    console.log('libres[s]: ' + libres[s] + ' y maximo[s]: ' + maximo[s]);
                    if (listos[s] > 1) { listos[s]-- };
                    if (conectados[s] < 1) {
                        nombres[s] = [];
                        sumador[s] = [];
                        sumador[s].push(1);
                        maximo[s] = 12;
                        listos[s] = 0;
                        for (var l = 0; l < libres.length; l++) {
                            if (libres[l] == true && conectados[l] > 0) {
                                libres[s] = false;
                            } else { 
                                libres[s] = true;
                            };
                        };
                    };
                    for (var c = 0; c < conectados.length; c++) {
                        if (conectados[c] == 0) {
                            nombres[c] = [];
                            console.log(`se borro nombres[c], [c]= ${c}, ${nombres}`);
                            console.log(nombres);
                        };
                    };
                };
            };
        };

        console.log(`Ususario desconectado: ${socket.id}, total: ${conectados}`);
        console.log(` todos los soquetes: ${soquetes}`);
        console.log('libres: ' + libres);
        console.log('listos: ' + listos);
        console.log('nombres: ' + nombres + ' y conectados: ' + conectados);
        io.in(adondereenvio).emit('chat', 'INCO' + conectados[numaula] + 'NECTADO');
    });

    socket.on('chat', (msg) => {
        if (msg.includes('DESDESCONCON')) {
            socket.disconnect(true);
        };
        if (msg.includes('aula')) {
            let veraula = msg.indexOf('aula');
            adondereenvio = msg.slice(veraula);
            numaula = msg.slice(veraula + 4);
            msg = msg.slice(0, veraula);
            console.log('a donde reenvio: ' + adondereenvio + ' y mensage: ' + msg);
        };
        if (msg.includes('LISTOSI')) {
            listos[numaula]++;
            io.in(adondereenvio).emit('chat', 'LISTADOS' + listos[numaula] + 'CALISTO');
            console.log('listos[numaula]: ' + listos[numaula] + ' y numaula: ' + numaula);
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
                        nuevonombre = nuevonombre + '_' + sumador[numaula][i];
                        socket.emit('chat', 'CAMBIAR' + nuevonombre + 'BIARCAM');
                    } else
                        sumador[numaula].push(1);
                };
            };
            nombres[numaula].push(nuevonombre);
            lista = '';
            for (var n = 0; n < nombres[numaula].length; n++) {
                let aumen = n + 1;
                lista = lista.concat(aumen + ') ');
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
            console.log('se borraron nombres[~' + numaula + '~] por ganador y quedo: ' + nombres);
            sumador[numaula] = [];
            sumador[numaula].push(1);
            maximo[numaula] = 12;
            console.log('aula antes: ' + nombreaula);
            for (var lu = 0; lu < libres.length; lu++) {
                if (libres[lu] == true && conectados[lu] > 0) {
                    libres[numaula] = false
                } else { 
                    libres[numaula] = true
                };
            };
            for (var li = 0; li < libres.length; li++) {
                if (libres[li] == true) {
                    nombreaula = 'aula' + li;
                    li = libres.length;
                };
            };
            console.log('aula despues: ' + nombreaula);
            console.log('maximo: ' + numaula + ' = ' + maximo[numaula]);
        };

        if (msg.includes('MAXIMO')) {
            let quitar = msg.split(' ');
            maximo[numaula] = parseInt(quitar[1]);
            console.log('los maximos: ' + maximo);
            listos[numaula] = 0;
            console.log('numero aula:' + numaula);
            libres[numaula] = false;
            if (conectados[numaula + 1] == null) { numaula++ };
            if (conectados[numaula] == null) { conectados.push(0) };
            if (maximo[numaula] == null) { maximo.push(12) };
            if (nombres[numaula] == null) { nombres.push([]) };
            if (listos[numaula] == null) { listos.push(0) };
            if (sumador[numaula] == null) { sumador.push([]) };
            if (sumador[numaula][0] == null) { sumador[numaula].push(1) };
            if (libres[numaula] == null) { libres.push(true) };
            if (soquetes[numaula] == null) { soquetes.push([]) };
            console.log('libres: ' + libres);
            for (var la = 0; la < libres.length; la++) {
                if (libres[la] == false && conectados[la] < 1) {
                    libres[la] = true;
                };
            };
            for (var le = 0; le < libres.length; le++) {
                if (libres[le] == false && conectados[le] > 0 && nombres[le].length < 1) {
                    libres[le] = true;
                };
            };
            for (var lo = 0; lo < libres.length; lo++) {
                if (libres[lo] == true) {
                    nombreaula = 'aula' + lo;
                    lo = libres.length;
                }; 
            };
            console.log('los soquetes: ' + soquetes);
        };

    });

    if (conectados[numaula] == 12) {
        let proximo = numaula + 1;
        if (conectados[proximo] == null) { conectados.push(0) };
        if (maximo[proximo] == null) { maximo.push(12) };
        if (nombres[proximo] == null) { nombres.push([]) };
        if (listos[proximo] == null) { listos.push(0) };
        if (sumador[proximo] == null) { sumador.push([]) };
        if (sumador[proximo][0] == null) { sumador[proximo].push(1) };
        if (libres[proximo] == null) { libres.push(true) };
        if (soquetes[proximo] == null) { soquetes.push([]) };
        nombreaula = 'aula' + proximo;
    };
});

app.get('/', (req, res) => {
    if (conectados[0] < maximo[0] && libres[0] == true) {
        res.sendFile(`${__dirname}/index0.html`);
    } else if (conectados[1] < maximo[1] && libres[1] == true) {
        res.sendFile(`${__dirname}/index1.html`);
    } else if (conectados[2] < maximo[2] && libres[2] == true) {
        res.sendFile(`${__dirname}/index2.html`);
    } else if (conectados[3] < maximo[3] && libres[3] == true) {
        res.sendFile(`${__dirname}/index3.html`);
    } else if (conectados[4] < maximo[4] && libres[4] == true) {
        res.sendFile(`${__dirname}/index4.html`);
    } else if (conectados[5] < maximo[5] && libres[5] == true) {
        res.sendFile(`${__dirname}/index5.html`);
    } else { 
        res.send('<h2 id="aula">SALONES COMPLETOS</h2>');
    };
});

server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');

});

