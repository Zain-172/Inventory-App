import { app, BrowserWindow } from "electron";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProcess = null;
let mainWindow = null;

// Function to start backend
function startBackend() {
  const isDev = process.env.NODE_ENV === "development";

  const backendPath = isDev
    ? path.join(__dirname, "../backend/server.js")
    : path.join(process.resourcesPath, "backend", "server.js");

  // Use Node executable to spawn backend
  const nodeExec = process.execPath.includes("electron")
    ? process.execPath.replace("electron.exe", "node.exe")
    : process.execPath;

  backendProcess = spawn(nodeExec, [backendPath], {
    cwd: path.dirname(backendPath),
    stdio: "pipe"
  });

  backendProcess.stdout.on("data", (data) =>
    console.log("Backend:", data.toString())
  );

  backendProcess.stderr.on("data", (data) =>
    console.error("Backend Error:", data.toString())
  );

  backendProcess.on("close", (code) =>
    console.log("Backend exited with code", code)
  );
}

// Function to create main Electron window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js") // optional
    }
  });

  const isDev = process.env.NODE_ENV === "development";
  const indexPath = isDev
    ? "http://localhost:5173"
    : path.join(process.resourcesPath, "dist-frontend", "index.html");

  mainWindow.loadURL(isDev ? indexPath : `file://${indexPath}`);

  mainWindow.once("ready-to-show", () => mainWindow.show());
}

// App events
app.on("ready", () => {
  startBackend();
  createWindow();
});

app.on("window-all-closed", () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
