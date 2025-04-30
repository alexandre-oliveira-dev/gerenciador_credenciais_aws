import { spawn } from 'child_process';
import path, { dirname, join } from 'path';
import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
  });

  mainWindow.loadFile('dist/index.html'); // ou sua build Vite, dependendo do caminho

  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();

  // 🟡 Inicia a API como processo filho
  const apiPath = path.join('api', 'index.js');
  const api = spawn('node', [apiPath], {
    cwd: '',
    env: process.env,
    stdio: 'inherit',
  });

  app.on('before-quit', () => {
    api.kill(); // Finaliza a API ao fechar o app
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
