const randomColor = require('randomcolor');

const registrarUsuario = (usuarios, nombre, socket, listaNombres, io) => {
  const nombreUtilizado = listaNombres.includes(nombre.toLowerCase());
  if (nombreUtilizado) {
    return io.to(socket.id).emit('registro-error-nombre-en-uso');
  }

  listaNombres.push(nombre.toLowerCase());

  const nuevoUsuario = {
    id: socket.id,
    nombre: nombre,
    color: randomColor({ luminosity: 'dark' }),
    mensajesPrivados: [],
  };

  usuarios[socket.id] = nuevoUsuario;

  io.to(socket.id).emit('registro-exitoso', nuevoUsuario);
};

const eliminarUsuario = (usuarios, socket, listaNombres) => {
  const { nombre } = usuarios[socket.id];

  //eliminar de la lista de nombres
  listaNombres = listaNombres.filter(n => n !== nombre.toLowerCase());

  //eliminar el usuario
  delete usuarios[socket.id];

  console.log(`Adios ${nombre}`);
};

module.exports = {
  registrarUsuario,
  eliminarUsuario,
};
