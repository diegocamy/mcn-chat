import React from 'react';

const Mensaje = ({ clase, avatar, id, autor, hora, color, mensaje }) => {
  return (
    <li className={clase}>
      <div className='superior'>
        {avatar && <img src={avatar} alt='avatar' />}
        {id !== 'admin' && <p>{autor}</p>}
        {id !== 'admin' && <p>{hora}</p>}
      </div>
      <div className='inferior'>
        <p
          className='mensaje'
          style={{
            background: `${color}`,
            color: clase === 'mensaje-admin' ? 'black' : 'white',
          }}
        >
          {mensaje}
        </p>
      </div>
    </li>
  );
};

export default Mensaje;
