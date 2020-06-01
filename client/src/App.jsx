import React, { useState } from 'react';
import socketIoClient from 'socket.io-client';

import Registro from './pages/Registro';
import Chat from './pages/Chat';

const ENDPOINT = 'http://localhost';
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
