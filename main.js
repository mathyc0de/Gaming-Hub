const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const path = require('path');
const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const {config} = require('dotenv')



config()
let mainWindow;
let tray;


function promiseSpawn(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args);

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Process exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      reject(err);
    });
  });
}

async function setuṕPath() {
  if (!process.env.APP_PATH) {
    const dir = path.join(__dirname, './setup')
    switch(process.platform) {
      case 'linux':
        promiseExec = promisify(exec)
        await promiseExec(`sh ${dir}.sh`)  
        break;
      case 'win32':
        await promiseSpawn("powershell.exe", [`${dir}.ps1`])
        break;
    }
  }
}

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
  mainWindow.loadFile('./src/pages/home_page.html');
  mainWindow.on('resize', () => {})
}

app.on('ready', async () => {
  setuṕPath().then((val) => {
    config()
    createWindow()
  })
});

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
    tray = new Tray(path.join(__dirname, './src/assets/icons/icon.png'))
    tray.on('click', () => createWindow())
      const contextMenu = Menu.buildFromTemplate([
          { label: "Sair", type: "normal", click: () => app.quit()},
      ]);
  tray.setContextMenu(contextMenu)
  }
});


ipcMain.on('back', () => {
  mainWindow.webContents.navigationHistory.goBack()
})

ipcMain.on('load-local-url', (event, url) => {
  mainWindow.loadURL(url);
});

ipcMain.on('open-dev-tools', () => {
  if (!mainWindow.webContents.isDevToolsOpened()) {
    mainWindow.webContents.openDevTools()
  }
})