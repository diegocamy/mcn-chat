import React from 'react';
import { Badge, Button, Menu } from 'antd';

import './MenuLateral.css';

const MenuLateral = ({ nombre }) => {
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
        <Button
          type='primary'
          shape='circle'
          size='small'
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            borderColor: 'white',
          }}
        >
          +
        </Button>
      </div>
      <div className='menu-salas' id='style-1'>
        <Menu
          style={{ background: 'transparent', color: 'white', border: 'none' }}
        >
          <Menu.Item>Menu</Menu.Item>
          <Menu.Item>Menu</Menu.Item>
          <Menu.Item>Menu</Menu.Item>
          <Menu.Item>Menu</Menu.Item>
          <Menu.Item>Menu</Menu.Item>
          <Menu.Item>Menu</Menu.Item>
          <Menu.Item>Menu</Menu.Item>
          <Menu.Item>Menu</Menu.Item>
          <Menu.Item>Menu</Menu.Item>
        </Menu>
      </div>
    </div>
  );
};

export default MenuLateral;
