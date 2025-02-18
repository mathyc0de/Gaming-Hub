const fs = require('fs')
const download = require('image-downloader');
const path = require('path')
const launch = "steam://rungameid/"
const VDF = require('vdf-parser');

function downloadImage(url, filepath) {
    return download.image({
       url,
       dest: filepath 
    });
}
class Steam {
    constructor(path) {
        this.path = path
        this.data = []
        this.lib = 'steam'
        this.needUpdate = false
    }

    getSteamApps() {
        const text = fs.readFileSync(path.join(this.path, '/steamapps/', 'libraryfolders.vdf'))
        const parsed = VDF.parse(text.toString('utf-8'))
        const libraryfolders = parsed.libraryfolders
        const apps = []
        for (let lib in libraryfolders) {
            console.log(libraryfolders[lib])
            for (let app in libraryfolders[lib].apps) {
                apps.push(app)
            }
        }
        return apps
    }

    isUpdated(apps) {
        const app_path = process.env.APP_PATH + 'steamapps.json'
        let localApps = fs.readFileSync(app_path)
        if (JSON.stringify(apps) == localApps) return true;
        this.needUpdate = true
        return false; 
    }

    async #getSteamIDs() {
        const apps = this.getSteamApps()
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
            await downloadImage(img, img_path)
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