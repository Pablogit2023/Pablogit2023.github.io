//import { createServer } from 'net';

//const server = createServer()

//server.on('connection', (socket) => {
//    socket.on('data', (data) => {
//        console.log('\nEl cliente ' + socket.remoteAddress + ":" + socket.remotePort + "dice: " + data)
//        socket.write('Recibido!')
//    })

//    socket.on('close', () => {
//        console.log('Comunicacion finalizada')
//    })

//    socket.on('error', (err) => {
//        console.log(err.message)
//    })
//})

//server.listen(6000, () => {
//    console.log('Servidor esta escuchando en el puerto', server.address().port)
//})

import { createServer } from 'net';

const server = createServer()

server.on('connection', (socket) => {
    socket.on('data', (data) => {
        console.log('\nEl cliente ' + socket.remoteAddress + ":" + socket.remotePort + "dice: " + data)
        socket.write('Recibido!')
    })

    socket.on('close', () => {
        console.log('Comunicacion finalizada')
    })

    socket.on('error', (err) => {
        console.log(err.message)
    })
})

server.listen(6000, () => {
    console.log('Servidor esta escuchando en el puerto', server.address().port)
})
