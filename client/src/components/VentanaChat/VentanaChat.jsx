import React, { useState } from 'react';
import { Input, Button, Divider } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import scrollToBottom from 'react-scroll-to-bottom';

import './VentanaChat.css';

const { TextArea } = Input;

const mostrarMensajes = (id, mensajes) => {
  return (
    <ul className='lista-mensajes'>
      {mensajes.map((m, i) => {
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
          <li className={clase} key={i}>
            <div className='superior'>
              {m.avatar && <img src={m.avatar} alt='avatar' />}
              {m.id !== 'admin' && <p>{autor}</p>}
              {m.id !== 'admin' && <p>{m.hora}</p>}
            </div>
            <div className='inferior'>
              <p
                className='mensaje'
                style={{
                  background: `${m.color}`,
                  color: clase === 'mensaje-admin' ? 'black' : 'white',
                }}
              >
                {m.mensaje}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

const VentanaChat = ({
  socket,
  mensajesChat,
  salaSeleccionada,
  salas,
  usuarios,
}) => {
  const [mensaje, setMensaje] = useState('');

  const enviarMensaje = () => {
    //ENVIAR MENSAJE
    socket.emit('enviar-mensaje', { mensaje, sala: salaSeleccionada });
    setMensaje('');
  };

  const sala = salas.find(s => s.nombre === salaSeleccionada);

  return (
    <div className='VentanaChat'>
      <div className='info-sala'>
        <div className='info'>
          <h3>{sala && sala.nombre}</h3>
          <p>{sala && sala.descripcion}</p>
        </div>
        <div className='users-conectados'>
          {usuarios && usuarios.length}
          <Button
            icon={<UserOutlined />}
            style={{ background: 'transparent', border: 'none' }}
          />
        </div>
      </div>
      <Divider style={{ margin: '5px 0' }} />
      <div className='mensajes-chat'>
        <scrollToBottom>
          {mostrarMensajes(socket.id, mensajesChat)}
        </scrollToBottom>
      </div>
      <div className='input-mensaje'>
        <TextArea
          style={{ resize: 'none', width: '90%' }}
          placeholder='Escribe tu mensaje'
          autoSize={{ minRows: 1, maxRows: 2 }}
          onChange={e => setMensaje(e.target.value)}
          value={mensaje}
          onKeyPress={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              enviarMensaje();
            }
          }}
        />
        <Button
          icon={<SendOutlined />}
          type='primary'
          style={{ marginTop: 'auto' }}
          onClick={enviarMensaje}
        />
      </div>
    </div>
  );
};

export default VentanaChat;
