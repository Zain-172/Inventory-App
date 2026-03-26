import { app, BrowserWindow, dialog } from "electron";
import path from "path";
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import updater from "electron-updater";
const { autoUpdater } = updater;
// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProcess = null;
let mainWindow = null;

// Only production mode
const isDev = true;

if (!isDev) {
  // Start backend server (production only)
  function startBackend() {
    const backendPath = path.join(process.resourcesPath, "backend", "server.cjs");

    backendProcess = spawn(process.execPath, [backendPath], {
      env: {
        ...process.env,
        ELECTRON_RUN_AS_NODE: "1",
        PORT: "5000"
      },
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

  // Automatically update application (production only)
  function setupAutoUpdater() {
    autoUpdater.autoDownload = false;

    autoUpdater.on("checking-for-update", () => {
      console.log("Checking for update...");
    });

    autoUpdater.on("update-available", (info) => {
      console.log("Update available:", info.version);
      dialog.showMessageBox({
        type: "info",
        title: "Update available",
        message: `Version ${info.version} is available. Do you want to update now?`,
        buttons: ["Yes", "Later"]
      }).then(result => {
        if (result.response === 0) autoUpdater.downloadUpdate();
      });
    });

    autoUpdater.on("update-not-available", () => {
      console.log("No updates available.");
    });

    autoUpdater.on("update-downloaded", () => {
      dialog.showMessageBox({
        type: "info",
        title: "Update ready",
        message: "Update downloaded. The app will restart to install it.",
        buttons: ["Restart"]
      }).then(() => {
        autoUpdater.quitAndInstall();
      });
    });

    autoUpdater.on("error", (err) => {
      console.error("Update error:", err);
    });

    autoUpdater.checkForUpdatesAndNotify();
  }


  // Create main window
  function createWindow() {
    const iconPath = path.join(process.resourcesPath, "dist-frontend", "logo.png");

    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      icon: iconPath,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js") // optional
      }
    });

    const indexPath = path.join(process.resourcesPath, "dist-frontend", "index.html");
    mainWindow.loadFile(indexPath);

    mainWindow.once("ready-to-show", () => mainWindow.show());
  }

  // App events
  app.whenReady().then(() => {
    startBackend(); // only in production
    createWindow();
    setupAutoUpdater()
  });

  app.on("window-all-closed", () => {
    if (backendProcess) backendProcess.kill();
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
} else {
  // Function to create main Electron window
  function createWindow() {
    const iconPath = path.join(__dirname, "..", "frontend", "public", "logo.ico");

    mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      icon: iconPath,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, "preload.js") // optional
      }
    });

    const isDev = true; //process.env.NODE_ENV === "development";
    const indexPath = isDev
      ? "http://localhost:5173"
      : path.join(process.resourcesPath, "dist-frontend", "index.html");

    mainWindow.loadURL(isDev ? indexPath : `file://${indexPath}`);

    mainWindow.once("ready-to-show", () => mainWindow.show());
  }

  // App events
  app.whenReady().then(async () => {
    createWindow();
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}