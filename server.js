const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { registrarUsuario } = require('./utils/usuarios');

const usuarios = {};
const listaNombres = [];
const salas = [{ nombre: 'General', usuarios: [] }];

io.on('connection', socket => {
  console.log('HOLA HDP, la lista de usuarios es: ', listaNombres);
  socket.on('intentar-ingreso', nombre => {
    registrarUsuario(usuarios, nombre, socket, listaNombres, io);
  });

  socket.on('ingreso', () => {
    //unirse a sala "general"
    socket.join('General');

    const usuarioSeHaConectado = {
      autor: 'Admin',
      mensaje: `${usuarios[socket.id].nombre} se ha conectado!`,
      color: '#f3f3f3',
      id: 'admin',
    };

    const mensajeBienvenida = {
      autor: 'Admin',
      mensaje: `Hola ${usuarios[socket.id].nombre} bienvenido al chat!`,
      color: '#f3f3f3',
      id: 'admin',
    };

    socket.broadcast.emit('mensaje', usuarioSeHaConectado);
    io.to(socket.id).emit('mensaje', mensajeBienvenida);
  });

  //enviar mensaje
  socket.on('enviar-mensaje', mensaje => {
    const { nombre, color } = usuarios[socket.id];

    const mensajito = {
      autor: nombre,
      id: socket.id,
      avatar: `https://avatars.dicebear.com/api/bottts/${nombre}.svg`,
      color: color,
      hora: new Date().toLocaleTimeString(),
      mensaje,
    };

    io.to('General').emit('mensaje', mensajito);
  });
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`Live on port ${PORT}`));
