const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config()

try {
  require('electron-reloader')(module)
} catch (_) {}

if (!process.env.APP_PATH) {
  console.log("Run setup.ps1(Windows) or setup.sh(Linux) before execute")
  app.quit()
}

let mainWindow;
let tray;

function createWindow() {
    if (tray != null) {
        tray.destroy();
    }
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, './src/scripts/shared/preload.js'),
      contextIsolation: false,
      enableRemoteModule: false,
      nodeIntegration: true
    }
  });
  mainWindow.loadFile('index.html');
  mainWindow.on('resize', () => {})
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    
  }
});

// app.on('activate', () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

ipcMain.on('exit-fullscreen', () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
    tray = new Tray("./src/assets/icon.png")
    tray.on('click', () => createWindow())
      const contextMenu = Menu.buildFromTemplate([
          { label: "Sair", type: "normal", click: () => app.quit()},
      ]);
  tray.setContextMenu(contextMenu)
  }
});


ipcMain.on('load-local-url', (event, url) => {
  mainWindow.loadURL(url);
});

ipcMain.on('open-dev-tools', () => {
  if (!mainWindow.webContents.isDevToolsOpened()) {
    mainWindow.webContents.openDevTools()
  }
})