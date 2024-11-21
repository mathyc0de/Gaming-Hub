const fs = require('fs')
const path = require('path')
const { homedir } = require('os')
const { app } = require('electron')
let lib



function getLib() {                
    switch (process.platform) {
        case 'win32':
            lib = {
            STEAM: "C:/Program Files (x86)/Steam/steamapps/",
            EPIC: "com.epicgames.launcher://apps/",
            UPLAY: "uplay://launch/",
            ORIGIN: "origin://launchgame/",
            STANDALONE: "STANDALONE"
            }
            break;
        case 'darwin':
            break;
        case 'linux':
            const homeDir = homedir();
            lib = {
                STEAM: path.join(homeDir, ".local/share/Steam/steamapps/"),
                EPIC: "com.epicgames.launcher://apps/",
                UPLAY: "uplay://launch/",
                ORIGIN: "origin://launchgame/",
                STANDALONE: "STANDALONE"
            }
            break;
    }
}


const launch = {
    STEAM: "steam://rungameid/",
    EPIC: "com.epicgames.launcher://apps/",
    UPLAY: "uplay://launch/",
    ORIGIN: "origin://launchgame/",
    STANDALONE: "STANDALONE"
}


class SteamGames {
    constructor() {
        this.steamData = []
    }

    #extractData(acfFiles, path) {
        const apps = []
        if (acfFiles == null) return;
        for (let idx = 0; idx < acfFiles.length; idx++) {
            const content = fs.readFileSync(path + acfFiles[idx], { encoding: 'utf8', flag: 'r' })
            const lines = content.split('\n')
            const appid = lines[2].replace(/\s/g,'').slice(8, -1)
            apps.push(appid)
        }
       return apps 
    }

    #parseACF(path = lib.STEAM) {
        const files = fs.readdirSync(path)
        const acfFiles = files.filter(file => file.endsWith('.acf'));
        return this.#extractData(acfFiles, path)
    }

    #downloadImage(url) {
        return
      }

    async #getSteamIDs() {
        const apps = this.#parseACF();
        for (let idx = 0; idx < apps.length; idx++) {
            const appid = apps[idx]
            const data = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`)
            const json = await data.json()
            const content = json[appid]
            if (content.success == false) {
                continue
            }
            const img = content.data.header_image
            const script =  launch.STEAM + appid
            // const imgPath = path.join(homedir(), ".local/share/gaming_hub/images/")
            // this.#downloadImage(img, imgPath)
            this.steamData.push({
                name: content.data.name,
                image: img,
                script: script
            })
        }
        return;
    }

    async fetchGames() {
        await this.#getSteamIDs()
        // const json = JSON.stringify(this.steamData)
        // fs.writeFileSync('./game_data.json',json, 'utf8')
        return this.steamData
    }
}

class GameData {
    constructor() {
        getLib()
        this.steamData = []
        this.epicData = []
        this.uplayData = []
        this.eaGamesData = []
        this.data = []
    }

    async #getSteamData() {
        const steam = new SteamGames()
        this.steamData = await steam.fetchGames()
    }

    async writeData() {
        await this.#getSteamData()
        const json = JSON.stringify(this.steamData)
        fs.writeFileSync('./game_data.json',json, 'utf8')
    }
}




module.exports = {GameData}