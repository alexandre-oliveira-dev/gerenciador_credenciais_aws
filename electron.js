import { fork ,exec} from 'child_process';
import path, { join, dirname } from 'path';
import { app, BrowserWindow } from 'electron';
import { fileURLToPath } from 'url';

let mainWindow;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './public/icon.ico',
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile('dist/index.html');
  mainWindow.webContents.openDevTools()
}

let apiProcess;

app.whenReady().then(() => {
  createWindow();

   exec(`sudo chmod 777 ${path.join(__dirname, 'api')}`, (err) => { 
      console.log("🚀 ~ Erro ao dar permissão:", err)
    })

  const apiPath = join(__dirname, 'api', 'index.js');
  apiProcess = fork(apiPath, {
    cwd: __dirname,
    env: process.env,
  });
});

app.on('before-quit', () => {
  if (apiProcess) apiProcess.kill();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
