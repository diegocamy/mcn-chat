import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Divider, Modal } from 'antd';
import { SendOutlined, UserOutlined } from '@ant-design/icons';
import ListaMensajes from '../ListaMensajes';

import './VentanaChat.css';

const { TextArea } = Input;

const mostrarUsuariosConectados = usuarios => {
  return (
    usuarios &&
    usuarios.map(u => {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          key={u.id}
        >
          <img
            src={`https://avatars.dicebear.com/api/bottts/${u.nombre}.svg`}
            alt='avatar-user'
            style={{ width: '45px', marginRight: '10px' }}
          />
          <h3 style={{ margin: 0, padding: 0 }}>{u.nombre}</h3>
        </div>
      );
    })
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
  const [visible, setVisible] = useState(false);
  const [estaEscribiendo, setEstaEscribiendo] = useState('');

  const sala = salas.find(s => s.nombre === salaSeleccionada);

  const divRef = useRef(null);

  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });

  useEffect(() => {
    socket.on('esta-escribiendo', nombre => {
      setEstaEscribiendo(`${nombre} está escribiendo...`);
    });

    socket.on('no-esta-escribiendo', () => {
      setEstaEscribiendo('');
    });
  }, []);

  useEffect(() => {
    if (mensaje.length === 0) {
      socket.emit('no-esta-escribiendo', sala && sala.nombre);
    }
  }, [mensaje]);

  const enviarMensaje = () => {
    //ENVIAR MENSAJE
    if (mensaje.trim().length > 0) {
      socket.emit('enviar-mensaje', { mensaje, sala: salaSeleccionada });
      setMensaje('');
    }
  };

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
            onClick={() => setVisible(true)}
          />
        </div>
      </div>
      <Divider style={{ margin: '5px 0' }} />
      <Modal
        style={{ width: 'fit-content' }}
        title={sala && `Usuarios conectados en ${sala.nombre}`}
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        {mostrarUsuariosConectados(usuarios)}
      </Modal>
      <div className='mensajes-chat'>
        <ListaMensajes id={socket.id} mensajes={mensajesChat} />
        <div ref={divRef} />
      </div>
      <div className='input-mensaje'>
        <TextArea
          style={{ resize: 'none', width: '90%' }}
          placeholder='Escribe tu mensaje'
          autoSize={{ minRows: 1, maxRows: 2 }}
          onChange={e => {
            setMensaje(e.target.value);
            socket.emit('escribiendo', sala && sala.nombre);
          }}
          value={mensaje}
          onKeyPress={e => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              socket.emit('no-esta-escribiendo', sala && sala.nombre);
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
        <br />
      </div>
      <p
        className='esta-escribiendo'
        style={{ color: !estaEscribiendo && 'white' }}
      >
        {estaEscribiendo || '-'}
      </p>
    </div>
  );
};

export default VentanaChat;
