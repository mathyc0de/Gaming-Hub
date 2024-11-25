const { Console } = require('console');
const fs = require('fs')
const download = require('image-downloader');
const { type } = require('os');
const path = require('path')
const launch = "steam://rungameid/"

function downloadImage(url, filepath) {
    return download.image({
       url,
       dest: filepath 
    });
}
class Steam {
    constructor() {
        this.data = []
        this.lib = 'steam'
        this.needUpdate = false
    }

    isUpdated(apps) {
        const app_path = process.env.APP_PATH + 'steamapps.json'
        if (!fs.existsSync(app_path)) {
            fs.writeFileSync(app_path, JSON.stringify([]))
            this.needUpdate = true
            return false
        }
        let localApps = fs.readFileSync(app_path)
        localApps = JSON.parse(localApps)
        if (apps.toString() == localApps.toString()) return true;
        this.needUpdate = true
        console.log(this.needUpdate)
        return false; 
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

    #parseACF(path = process.env.STEAM) {
        const files = fs.readdirSync(path)
        const acfFiles = files.filter(file => file.endsWith('.acf'));
        return this.#extractData(acfFiles, path)
    }

    async #getSteamIDs() {
        const apps = this.#parseACF();
        if (this.isUpdated(apps)) return;
        fs.writeFileSync(process.env.APP_PATH + 'steamapps.json', JSON.stringify(apps))
        for (let idx = 0; idx < apps.length; idx++) {
            const appid = apps[idx]
            const data = await fetch(`https://store.steampowered.com/api/appdetails?appids=${appid}`)
            const json = await data.json()
            const content = json[appid]
            if (content.success == false) {
                continue
            }
            const img = content.data.header_image
            const img_path = path.join(process.env.APP_PATH, 'assets/images/', appid + '.jpg')
            downloadImage(img, img_path)
            const script =  launch + appid
            this.data.push({
                name: content.data.name,
                image: img_path,
                script: script
            })
            console.log(this.data)
        }
        return;
    }

    async fetchGames() {
        await this.#getSteamIDs()
        return this.data
    }
}

module.exports = {Steam}