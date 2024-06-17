const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');

let mainWindow;
let ws;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile('index.html'); // Окно авторизации
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('auth-success', () => {
  mainWindow.loadFile('menu.html'); // Меню выбора
});

ipcMain.on('connect-ws', () => {
  ws = new WebSocket('wss://localhost:3000', {
    rejectUnauthorized: false,
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
  });

  ws.on('open', () => {
    console.log('Connected to secure server');
  });

  ws.on('close', () => {
    console.log('Disconnected from secure server');
  });

  ws.on('message', (message) => {
    console.log('Received:', message);
  });
});

ipcMain.on('send-text-message', (event, message) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'textMessage', text: message }));
  }
});

ipcMain.on('send-file', (event, filePath) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    const fileBuffer = fs.readFileSync(filePath);
    const base64File = fileBuffer.toString('base64');
    const fileName = path.basename(filePath);
    ws.send(JSON.stringify({ type: 'file', file: base64File, filename: fileName }));
  }
});
