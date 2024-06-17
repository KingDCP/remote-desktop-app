const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const screenshot = require('screenshot-desktop');
const robot = require('robotjs');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');

const app = express();
connectDB(); // Подключение к базе данных

// Middleware
app.use(express.json());
app.use('/auth', authRoutes);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(message) {
    const command = JSON.parse(message);
    console.log('Received command:', command);
    handleCommand(command);
  });

  setInterval(async () => {
    try {
      const img = await screenshot({ format: 'png' });
      ws.send(img.toString('base64'));
      console.log('Sent screenshot');
    } catch (err) {
      console.error('Screenshot error:', err);
    }
  }, 1000);
});

function handleCommand(command) {
  switch (command.type) {
    case 'mouse':
      robot.moveMouse(command.x, command.y);
      break;
    case 'click':
      robot.mouseClick(command.button);
      break;
    case 'keyboard':
      robot.keyTap(command.key);
      break;
    default:
      console.log('Unknown command:', command);
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
