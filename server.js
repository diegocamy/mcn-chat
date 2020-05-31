const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const { registrarUsuario } = require('./utils/usuarios');

const usuarios = {};
const listaNombres = [];
const salas = [
  {
    nombre: 'General',
    descripcion: 'Sala para temas en general',
  },
  { nombre: 'Covid-19', descripcion: 'Todo sobre la pandemia!' },
  { nombre: 'Xicos', descripcion: 'La sala perfecta para vos!' },
];

io.on('connection', socket => {
  //INTENTAR INGRESO AL CHAT LUEGO DE ELEGIR NOMBRE EN FRONTEND
  socket.on('intentar-ingreso', nombre => {
    registrarUsuario(usuarios, nombre, socket, listaNombres, io);
  });

  //CUANDO EL USER INGRESA VA DIRECTO A LA SALA GENERAL
  socket.on('ingreso', () => {
    socket.join('General');

    io.to(socket.id).emit('salas', salas);
  });

  //ABANDONAR SALA
  socket.on('abandonar-sala', sala => {
    const usuarioHaAbandonado = {
      autor: 'Admin',
      mensaje: `${usuarios[socket.id].nombre} se fue de la sala!`,
      color: '#f3f3f3',
      id: 'admin',
    };

    socket.to(sala).broadcast.emit('mensaje', usuarioHaAbandonado);
    socket.leave(sala);

    const estaSala = io.sockets.adapter.rooms[sala];

    let usuariosEnLaSala;
    if (estaSala) {
      usuariosEnLaSala = Object.keys(estaSala.sockets).map(u => usuarios[u]);
    } else {
      usuariosEnLaSala = [];
    }

    io.to(sala).emit('usuarios-en-sala', usuariosEnLaSala);
  });

  //CAMBIAR DE SALA
  socket.on('cambio-de-sala', sala => {
    socket.join(sala);

    const mensajeBienvenida = {
      autor: 'Admin',
      mensaje: `Hola ${
        usuarios[socket.id].nombre
      } bienvenido a la sala ${sala}!`,
      color: '#f3f3f3',
      id: 'admin',
    };

    io.to(socket.id).emit('mensaje', mensajeBienvenida);

    const usuarioEntradoALaSala = {
      autor: 'Admin',
      mensaje: `${usuarios[socket.id].nombre} se unió a la sala!`,
      color: '#f3f3f3',
      id: 'admin',
    };
    socket.to(sala).broadcast.emit('mensaje', usuarioEntradoALaSala);

    const usuariosEnLaSala = Object.keys(
      io.sockets.adapter.rooms[sala].sockets,
    ).map(u => usuarios[u]);
    io.to(sala).emit('usuarios-en-sala', usuariosEnLaSala);
  });

  //enviar mensaje
  socket.on('enviar-mensaje', ({ mensaje, sala }) => {
    const { nombre, color } = usuarios[socket.id];

    const mensajito = {
      autor: nombre,
      id: socket.id,
      avatar: `https://avatars.dicebear.com/api/bottts/${nombre}.svg`,
      color: color,
      hora: new Date().toLocaleTimeString(),
      mensaje,
    };

    io.to(sala).emit('mensaje', mensajito);
  });
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`Live on port ${PORT}`));
