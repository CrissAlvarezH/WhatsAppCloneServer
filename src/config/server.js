
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();

let server = http.createServer(app);

module.exports.io = socketIO();// exportamos Socket IO

server.listen(3000, () => {
    console.log(`Servidor corriendo en el puerto 3000`);
});

app.get('/', (req, res) => {
    console.log(`Peticion GET`);

    res.send("Ola k ace");
});

