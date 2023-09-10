const { CONNREFUSED } = require('dns');
const express = require('express');
const app = express();

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server);
const fs = require("fs");

var rutaultimo = './recordultimo.txt';
var rutaprimero = './recordprimero.txt';
var rutadiferencia = './recorddiferencia.txt';
var ruta = './record.txt';
var texto = "Esto es una prueba";

var ultimorecord = [];
ultimorecord.push('');
var ultimonombre = [];
ultimonombre.push([]);
var ultimopuntos = [];
ultimopuntos.push([]);

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
                    console.log(`se quitara soquetes[${s}][${i}]: ${soquetes[s][i]}`);
                    soquetes[s].splice(i, 1);
                    let esteaula = 'aula' + s;
                    console.log(esteaula);
                    console.log(soquetes[s]);
                    nombres[s].splice(i, 1);
                    console.log('splice del disconnect');
                    console.log(nombres);
                    conectados[s]--;
                    io.in(esteaula).emit('chat', 'INCO' + conectados[s] + 'NECTADO');
                    lista2 = '';
                    for (var ni = 0; ni < nombres[s].length; ni++) {
                        let siguiente = ni + 1;
                        lista2 = lista2.concat(siguiente + ') ');
                        lista2 = lista2.concat(nombres[s][ni]);
                        lista2 = lista2.concat('// ');
                        lista2 = lista2.toString();
                    };
                    io.in(esteaula).emit('chat', `ESTOS ${lista2} SOMOS`);
                    
                    if (libres[s] == false) { maximo[s]-- };
                    console.log('libres[' + s + ']: ' + libres[s] + ' y maximo[' +  s + ']: ' + maximo[s]);
                    if (listos[s] > conectados[s]) { listos[s]-- };
                    if (conectados[s] < 1) {
                        nombres[s] = [];
                        sumador[s] = [];
                        sumador[s].push(1);
                        maximo[s] = 12;
                        listos[s] = 0;
                        libres[s] = true;
                        for (var l = 0; l < libres.length; l++) {
                            if (libres[l] == true) {
                                nombreaula = 'aula' + l;
                                l = libres.length;
                            };
                        };
                    };
                    for (var c = 0; c < conectados.length; c++) {
                        if (conectados[c] == 0) {
                            nombres[c] = [];
                            console.log(`se borro nombres[c], [c]= ${c},nombres: ${nombres}`);
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
            lista = '';
            for (var na = 0; na < nombres[numaula].length; na++) {
                let aumeno = na + 1;
                lista = lista.concat(aumeno + ') ');
                lista = lista.concat(nombres[numaula][na]);
                lista = lista.concat('// ');
                lista = lista.toString();
            };
            io.in(adondereenvio).emit('chat', `ESTOS ${lista} SOMOS`);
            console.log(nombres);
            lista = '';
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
                lista = lista.concat('// ');
                lista = lista.toString();
            };
            io.in(adondereenvio).emit('chat', `ESTOS ${lista} SOMOS`);
            console.log(nombres);
            lista = '';
        };

        if (msg.includes('%DOYPOSI%')) {
            msg = msg.slice(8);
            if (msg.includes('ULTIMO')) {
                ruta = rutaultimo;
            } else if (msg.includes('PRIMERO')) {
                ruta = rutaprimero;
            } else if (msg.includes('DIFERENCIA')) {
                ruta = rutadiferencia;
            } else {
                ruta = ruta;
            };

            let buscanuevopuntos = msg.indexOf('%PUNPUN%');
            let buscanuevonombre = msg.indexOf('%GANGAN%');
            let nuevopuntos = parseInt(msg.slice(buscanuevopuntos + 8, buscanuevonombre));
            let nuevonombre = msg.slice(buscanuevonombre + 8);
            console.log(nuevopuntos + '<-->' + ultimopuntos[numaula]);
            for (var bnp = 0; bnp < ultimopuntos[numaula].length; bnp++) {
                if (nuevopuntos > ultimopuntos[numaula][bnp]) {
                    ultimopuntos[numaula].splice(bnp, 0, nuevopuntos);
                    ultimonombre[numaula].splice(bnp, 0, nuevonombre);
                    bnp = ultimopuntos[numaula].length;
                } else {
                    if (bnp == ultimopuntos[numaula].length) {
                        ultimopuntos[numaula].splice(bnp, 0, nuevopuntos);
                        ultimonombre[numaula].splice(bnp, 0, nuevonombre);
                    };
                };
            };
            ultimopuntos[numaula] = ultimopuntos[numaula].slice(0, 10);
            ultimonombre[numaula] = ultimonombre[numaula].slice(0, 10);
            fs.open(ruta, 'w+', (err, fd) => {
                if (err) {
                    console.log(err);
                } else {
                    //si tienes ya el fd (file descriptor), usémoslo 
                    texto = '%PUNPUN%';
                    texto = texto.concat(ultimopuntos[numaula].toString());
                    texto = texto.concat('%GANGAN%');
                    texto = texto.concat(ultimonombre[numaula].toString());
                    fs.appendFile(fd, texto, function (err) {
                        if (err) throw err;
                        //de nuevo, usemos el fd para cerrar el fichero abierto
                        fs.close(fd, function (err) {
                            if (err) throw err;
                            console.log('It\'s saved!');
                        });
                    });
                };
            });

            socket.emit('chat', '%RECORD%' + ultimonombre[numaula] + '%TOSTOS%' + ultimopuntos[numaula]);
        };

        if (msg.includes('%PIDOPOSI%')) {
            socket.emit('chat', '%RECORD%' + ultimonombre[numaula] + '%TOSTOS%' + ultimopuntos[numaula]);
        };
        
        socket.broadcast.to(adondereenvio).emit('chat', msg);

        if (msg.includes('GANADOR')) {
            maximo[numaula] = 12;
            libres[numaula] = true;
            console.log('aula antes: ' + nombreaula);
            for (var li = 0; li < libres.length; li++) {
                if (libres[li] == true) {
                    nombreaula = 'aula' + li;
                    li = libres.length;
                };
            };
            
        };

        if (msg.includes('FORMATO')) { 
            if (msg.includes('ULTI')) {
                ruta = rutaultimo;
            } else if (msg.includes('PRIM')) {
                ruta = rutaprimero;
            } else if (msg.includes('DIFE')) {
                ruta = rutadiferencia;
            } else {
                ruta = ruta;
            };
            fs.readFile(ruta, 'utf8', (error, datos) => {
                if (error) throw error;
                ultimorecord[numaula] = datos;
                console.log("El contenido es: " + ultimorecord[numaula] + '[' + numaula + ']');
                if (ultimorecord[numaula].includes('%PUNPUN%') && ultimorecord[numaula].includes('%GANGAN%')) {
                    let buscapuntos = ultimorecord[numaula].indexOf('%PUNPUN%');
                    let buscanombre = ultimorecord[numaula].indexOf('%GANGAN%');
                    let interpuntos = ultimorecord[numaula].slice(buscapuntos + 8, buscanombre);
                    let internombre = ultimorecord[numaula].slice(buscanombre + 8);
                    ultimonombre[numaula] = internombre.split(',');
                    ultimopuntos[numaula] = interpuntos.split(',');
                    console.log('si incluye ' + ultimopuntos[numaula] + '<--->' + ultimonombre[numaula]);
                } else {
                    ultimopuntos[numaula] = [];
                    ultimopuntos[numaula].push(0);
                    ultimonombre[numaula] = [];
                    ultimonombre[numaula].push('');
                };
                console.log(ultimopuntos[numaula] + '<---->' + ultimonombre[numaula])
            });
            
        };


        if (msg.includes('MAXIMO')) {
            let quitar = msg.split(' ');
            maximo[numaula] = parseInt(quitar[1]);
            console.log('los maximos: ' + maximo);
            listos[numaula] = 0;
            console.log('numero aula:' + numaula);
            libres[numaula] = false;
            if (conectados[numaula + 1] == null) { numaula++ };
            if (ultimopuntos[numaula] == null) {
                ultimopuntos.push([]);
                ultimonombre.push([]);
                ultimorecord.push('');
            };
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
        if (ultimopuntos[proximo] == null) {
            ultimopuntos.push([]);
            ultimonombre.push([]);
            ultimorecord.push('');
        };
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

