const app = require('express')();
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const { registrarUsuario, eliminarUsuario } = require('./utils/usuarios');
const {
  mensajeBienvenida,
  mensajeUsuarioAbandonoSala,
  mensajeUsuarioIngresoALaSala,
  mensajeEnviadoPorUsuario,
} = require('./utils/mensajes');

const usuarios = {};
const listaNombres = [];
const salas = [
  {
    nombre: 'General',
    descripcion: 'Sala para chatear sobre cualquier cosa',
  },
  { nombre: 'Covid-19', descripcion: 'Usen tapabocas! 😷' },
  { nombre: 'Cine y TV', descripcion: 'Hablemos de peliculas y series' },
  {
    nombre: 'Deportes',
    descripcion: 'Sala para lo relacionado a todos los deportes',
  },
  { nombre: 'Guampud@s', descripcion: 'La sala perfecta para vos!' },
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
    const { nombre } = usuarios[socket.id];
    const mensaje = mensajeUsuarioAbandonoSala(nombre);

    socket.to(sala).broadcast.emit('mensaje', mensaje);
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
    const { nombre } = usuarios[socket.id];

    const msjBienvenida = mensajeBienvenida(nombre, sala);

    io.to(socket.id).emit('mensaje', msjBienvenida);

    const msjUsuarioEntroSala = mensajeUsuarioIngresoALaSala(nombre, sala);

    socket.to(sala).broadcast.emit('mensaje', msjUsuarioEntroSala);

    const usuariosEnLaSala = Object.keys(
      io.sockets.adapter.rooms[sala].sockets,
    ).map(u => usuarios[u]);

    io.to(sala).emit('usuarios-en-sala', usuariosEnLaSala);
  });

  //enviar mensaje
  socket.on('enviar-mensaje', ({ mensaje, sala }) => {
    const { nombre, color } = usuarios[socket.id];

    const msj = mensajeEnviadoPorUsuario(nombre, socket, color, mensaje);

    io.to(sala).emit('mensaje', msj);
  });

  socket.on('escribiendo', sala => {
    const { nombre } = usuarios[socket.id];
    socket.to(sala).broadcast.emit('esta-escribiendo', nombre);
  });

  socket.on('no-esta-escribiendo', sala => {
    socket.to(sala).broadcast.emit('no-esta-escribiendo');
  });

  socket.on('disconnect', () => {
    let nombre;
    if (usuarios[socket.id]) {
      nombre = usuarios[socket.id];
    } else {
      return;
    }

    const mensaje = mensajeUsuarioAbandonoSala(nombre);

    let usuariosEnLaSala;

    for (let i = 0; i < salas.length; i++) {
      const socketsSala = io.sockets.adapter.rooms[salas[i].nombre];
      if (socketsSala) {
        usuariosEnLaSala = Object.keys(socketsSala.sockets).map(
          u => usuarios[u],
        );
        io.to(salas[i].nombre).emit('mensaje', mensaje);
        io.to(salas[i].nombre).emit('usuarios-en-sala', usuariosEnLaSala);
      }
    }

    eliminarUsuario(usuarios, socket, listaNombres);
  });
});

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

http.listen(PORT, () => console.log(`Live on port ${PORT}`));
