const mensajeBienvenida = (nombre, sala) => {
  return {
    autor: 'Admin',
    mensaje: `Hola ${nombre} bienvenido a la sala ${sala}!`,
    color: '#f3f3f3',
    id: 'admin',
  };
};

const mensajeUsuarioAbandonoSala = nombre => {
  return {
    autor: 'Admin',
    mensaje: `${nombre} se fue de la sala!`,
    color: '#f3f3f3',
    id: 'admin',
  };
};

const mensajeUsuarioIngresoALaSala = nombre => {
  return {
    autor: 'Admin',
    mensaje: `${nombre} se unió a la sala!`,
    color: '#f3f3f3',
    id: 'admin',
  };
};

const mensajeEnviadoPorUsuario = (nombre, socket, color, mensaje) => {
  return {
    autor: nombre,
    id: socket.id,
    avatar: `https://avatars.dicebear.com/api/bottts/${nombre}.svg`,
    color: color,
    hora: new Date().toLocaleTimeString(),
    mensaje,
  };
};

module.exports = {
  mensajeBienvenida,
  mensajeUsuarioIngresoALaSala,
  mensajeEnviadoPorUsuario,
  mensajeUsuarioAbandonoSala,
};
