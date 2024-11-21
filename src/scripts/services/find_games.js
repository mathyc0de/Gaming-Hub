const fs = require('fs')
const { type } = require('os')

class Game {
    constructor(name, id, launchScript) {
        this.name = name
        this.id = id
        this.store = launchScript
    }

    gameURL() {
        return this.store + this.id
    }
}

const lib = {
    STEAM: "C:/Program Files (x86)/Steam/steamapps/",
    EPIC: "com.epicgames.launcher://apps/",
    UPLAY: "uplay://launch/",
    ORIGIN: "origin://launchgame/",
    STANDALONE: "STANDALONE"
}


const launch = {
    STEAM: "steam://rungameid/",
    EPIC: "com.epicgames.launcher://apps/",
    UPLAY: "uplay://launch/",
    ORIGIN: "origin://launchgame/",
    STANDALONE: "STANDALONE"
}

function extractData(acfFiles, path) {
    if (acfFiles == null) return;
    for (let idx = 0; idx < acfFiles.length; idx++) {
        const content = fs.readFileSync(path + acfFiles[idx], { encoding: 'utf8', flag: 'r' })
        const lines = content.split('\n')
        console.log(lines[2])
    } 
    
}

function parseACF(path = lib.STEAM) {
    const files = fs.readdirSync(path)
    console.log(files);
    const acfFiles = files.filter(file => file.endsWith('.acf'));
    console.log(acfFiles)
    return extractData(acfFiles, path)
}

async function getSteamIDs() {
    const content = parseACF();
    const data = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`)
    const json = await data.json()
    const name = json[appid].data.name
    const game = new Game(name, appid, launch.STEAM)
    console.log(game.gameURL())
}

module.exports = {getSteamIDs}