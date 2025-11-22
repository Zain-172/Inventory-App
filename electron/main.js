import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const isDev = process.env.NODE_ENV === 'development';

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // if (isDev) {
    mainWindow.loadURL('http://localhost:5173'); // dev server
  // } else {
  //   mainWindow.loadFile(path.join(__dirname, '../../frontend/dist/index.html')); // production build
  // }
});
