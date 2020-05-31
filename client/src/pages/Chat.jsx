import React, { useState, useEffect } from 'react';
import MenuLateral from '../components/MenuLateral';
import VentanaChat from '../components/VentanaChat';

import './Chat.css';

const Chat = ({ socket, usuario }) => {
  const [mensajesChat, setMensajesChat] = useState([]);

  useEffect(() => {
    socket.emit('ingreso');

    socket.on('mensaje', mensaje => {
      console.log(mensaje);
      setMensajesChat(prevState => [...prevState, mensaje]);
    });
  }, []);

  return (
    <div className='Chat'>
      <div className='tarjeta'>
        <MenuLateral nombre={usuario.nombre} />
        <VentanaChat mensajesChat={mensajesChat} socket={socket} />
      </div>
    </div>
  );
};

export default Chat;
