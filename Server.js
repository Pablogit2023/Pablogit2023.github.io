/*const net = require('net');*/
import { createServer } from 'net';

const server = createServer()

server.on('connection', (socket) => {
    socket.on('data', (data) => {
        console.log('\nEl cliente ' + socket.remoteAddress + ":" + socket.remotePort + "dice: " + data)
        socket.write('Recibido!')
    })

    socket.on('close', () => {
        console.log('Comunicación finalizada')
    })

    socket.on('error', (err) => {
        console.log(err.message)
    })
})

server.listen(3000, () => {
    console.log('servidor esta escuchando en la puerta', server.address().port)
})