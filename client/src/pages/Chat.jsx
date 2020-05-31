import React, { useState, useEffect } from 'react';
import MenuLateral from '../components/MenuLateral';
import VentanaChat from '../components/VentanaChat';

import './Chat.css';

const Chat = ({ socket, usuario }) => {
  const [mensajesChat, setMensajesChat] = useState([]);
  const [salas, setSalas] = useState([]);
  const [salaSeleccionada, setSalaSeleccionada] = useState(['General']);
  const [usuarios, setUsuarios] = useState({});

  useEffect(() => {
    socket.on('usuarios-en-sala', usuariosEnSala => {
      setUsuarios(usuariosEnSala);
    });
  }, [usuarios]);

  useEffect(() => {
    socket.emit('ingreso');

    socket.on('salas', salasDisponibles => setSalas(salasDisponibles));

    socket.on('mensaje', mensaje => {
      setMensajesChat(prevState => [...prevState, mensaje]);
    });
  }, []);

  useEffect(() => {
    socket.emit('cambio-de-sala', salaSeleccionada[0]);
    setMensajesChat([]);
  }, [salaSeleccionada]);

  return (
    <div className='Chat'>
      <div className='tarjeta'>
        <MenuLateral
          socket={socket}
          nombre={usuario.nombre}
          salas={salas}
          salaSeleccionada={salaSeleccionada}
          setSalaSeleccionada={setSalaSeleccionada}
        />
        <VentanaChat
          usuarios={usuarios}
          salas={salas}
          mensajesChat={mensajesChat}
          socket={socket}
          salaSeleccionada={salaSeleccionada[0]}
        />
      </div>
    </div>
  );
};

export default Chat;
