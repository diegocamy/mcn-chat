import React from 'react';
import socketIoClient from 'socket.io-client';

const ENDPOINT = 'http://localhost:5000';
const socket = socketIoClient(ENDPOINT);

function App() {
  return <h1>HOLA</h1>;
}

export default App;
