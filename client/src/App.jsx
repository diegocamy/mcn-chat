import React, { useState, useEffect } from 'react';
import socketIoClient from 'socket.io-client';

import Registro from './pages/Registro';
import Chat from './pages/Chat';

const ENDPOINT = 'http://localhost:5000';
const socket = socketIoClient(ENDPOINT);

function App() {
  const [usuario, setUsuario] = useState(null);

  if (usuario) {
    return <Chat socket={socket} usuario={usuario} />;
  } else {
    return <Registro socket={socket} setUsuario={setUsuario} />;
  }
}

export default App;
