const { ipcRenderer } = require('electron');

// DEBUG F12 OPENS devtools
window.addEventListener('keydown', (keyPressed) => {
  if (keyPressed.key == 'F12')   ipcRenderer.send('open-dev-tools')
})