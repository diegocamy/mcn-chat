import React, { useState, useEffect } from 'react';
import { Input, Alert } from 'antd';

import './Registro.css';
import logo from '../img/mcn.png';

const { Search } = Input;

const Registro = ({ socket, setUsuario }) => {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('registro-error-nombre-en-uso', () => {
      setError('Ese nombre no está disponible');
    });

    socket.on('registro-exitoso', usuario => {
      setUsuario(usuario);
    });
  }, []);

  const intentarIngreso = nombre => {
    if (nombre.trim().length === 0) {
      return setError('Debe ingresar un nombre');
    }

    if (nombre.trim().length > 12) {
      return setError('El nombre no debe contener mas de 12 caracteres');
    }

    socket.emit('intentar-ingreso', nombre);
  };

  return (
    <div className='Registro'>
      <img src={logo} alt='logo' />
      <h2>Tipica app de chat con Socket.io</h2>
      {error && (
        <Alert
          message={error}
          type='error'
          style={{ width: '50%', margin: '10px auto' }}
          showIcon
        />
      )}
      <Search
        className='input-nombre'
        value={nombre}
        enterButton='Chatear!'
        onChange={e => {
          setNombre(e.target.value);
          setError('');
        }}
        placeholder='Ingresa tu nombre/apodo'
        onSearch={value => intentarIngreso(value)}
      />
    </div>
  );
};

export default Registro;
