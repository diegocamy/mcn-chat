import React from 'react';
import { Badge, Menu } from 'antd';

import './MenuLateral.css';

const MenuLateral = ({
  socket,
  nombre,
  salas,
  salaSeleccionada,
  setSalaSeleccionada,
}) => {
  return (
    <div className='MenuLateral'>
      <div className='info-usuario'>
        <div className='avatar'>
          <img
            src={`https://avatars.dicebear.com/api/bottts/${nombre}.svg`}
            alt='avatar'
          />
        </div>
        <div className='nombre-estado'>
          <Badge status='success'>
            <h3>{nombre}</h3>
          </Badge>
          <p>Online</p>
        </div>
      </div>
      <div className='agregar-sala'>
        <h3>Salas de Chat</h3>
      </div>
      <div className='menu-salas' id='style-1'>
        <Menu
          selectedKeys={salaSeleccionada}
          style={{ background: 'transparent', color: 'white', border: 'none' }}
        >
          {salas.map(s => (
            <Menu.Item
              key={s.nombre}
              onClick={() => {
                socket.emit('abandonar-sala', salaSeleccionada[0]);
                setSalaSeleccionada([s.nombre]);
              }}
            >
              {s.nombre}
            </Menu.Item>
          ))}
        </Menu>
      </div>
    </div>
  );
};

export default MenuLateral;
