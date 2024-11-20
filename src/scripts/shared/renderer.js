const { ipcRenderer } = require('electron');
const { Background } = require('./src/scripts/shared/background_shader.js');
const { getSteamIDs } = require('./src/scripts/services/find_games.js');

let bg;

function main() {
    bg = new Background()
    bg.animate()


    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
          ipcRenderer.send('exit-fullscreen')}});
    window.addEventListener('resize', () => bg.resize())

        // Handle button clicks
    document.getElementById('stardew').addEventListener('click', () => {
        console.log('stardew clicked');
        ipcRenderer.send('load-local-url', "steam://rungameid/413150")
        // Add your logic here
    });
    getSteamIDs()
    
}

main()