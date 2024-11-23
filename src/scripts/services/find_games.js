const fs = require('fs')
const path = require('path')
let lib
const env = process.env
const APP_PATH = env.APP_PATH
const STEAM_PATH = env.STEAM


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

    #parseACF(path = STEAM_PATH) {
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
        return this.steamData
    }
}

class GameData {
    constructor() {
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
        console.log(APP_PATH + 'game_data.json')
        fs.writeFileSync(APP_PATH + 'game_data.json',json, 'utf8')
    }
}




module.exports = {GameData}