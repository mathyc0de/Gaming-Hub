const { ipcRenderer } = require('electron');
const { Background } = require('../scripts/shared/background_shader.js');

let bg;

function main() {
    bg = new Background()
    bg.animate()


    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          ipcRenderer.send('exit-fullscreen')}});
    window.addEventListener('resize', () => bg.resize())
    // fetch_games()
}

main()