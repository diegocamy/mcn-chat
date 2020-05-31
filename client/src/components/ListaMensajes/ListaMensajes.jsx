import React from 'react';

import Mensaje from '../Mensaje';

const mostrarMensajes = (id, mensajes) => {
  return mensajes.map((m, i) => {
    let clase;
    let autor;
    if (m.id === id) {
      clase = 'mensaje-mio';
      autor = 'Yo';
    } else if (m.id === 'admin') {
      clase = 'mensaje-admin';
    } else {
      clase = 'mensaje-ajeno';
      autor = m.autor;
    }
    return (
      <Mensaje
        key={i}
        clase={clase}
        autor={autor}
        avatar={m.avatar}
        id={m.id}
        hora={m.hora}
        mensaje={m.mensaje}
        color={m.color}
      />
    );
  });
};

const ListaMensajes = ({ id, mensajes }) => {
  return <ul className='lista-mensajes'>{mostrarMensajes(id, mensajes)}</ul>;
};

export default ListaMensajes;
