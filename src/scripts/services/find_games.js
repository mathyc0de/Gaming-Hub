const fs = require('fs')

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

const launch = {
    STEAM: "steam://rungameid/",
    EPIC: "com.epicgames.launcher://apps/",
    UPLAY: "uplay://launch/",
    ORIGIN: "origin://launchgame/",
    STANDALONE: "STANDALONE"
}

function extractData(content) {
    const lines = content.split('\n')
}

function parseACF(path = launch.STEAM) {
    const files = fs.readdirSync(path)
    const acfFiles = files.filter(file => file.endsWith('.acf'));
}

async function getSteamIDs(appid = 629520) {
    const data = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`)
    const json = await data.json()
    const name = json[appid].data.name
    const game = new Game(name, appid, launch.STEAM)
    console.log(game.gameURL())
}

module.exports = {getSteamIDs}