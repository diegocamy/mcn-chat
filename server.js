const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.send('<h1>FUNCA</h1>');
});

io.on('connection', socket => {
  console.log('HOLA HDP');
});

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => console.log(`Live on port ${PORT}`));
