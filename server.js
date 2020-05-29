const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { registrarUsuario } = require('./utils/usuarios');

const usuarios = {};
const listaNombres = [];

io.on('connection', socket => {
  console.log('HOLA HDP, la lista de usuarios es: ', listaNombres);
  socket.on('intentar-ingreso', nombre => {
    registrarUsuario(usuarios, nombre, socket, listaNombres, io);
  });
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`Live on port ${PORT}`));
