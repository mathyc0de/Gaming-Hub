const fs = require('fs')
const download = require('image-downloader');
const path = require('path')

function downloadImage(url, filepath) {
    return download.image({
       url,
       dest: filepath 
    });
}

class Epic {
    constructor(path) {
        this.lib = 'epic'
        this.path = path
        this.data = []
        this.needUpdate = false
    }

    isUpdated(apps) {
            const app_path = process.env.APP_PATH + 'epicapps.json'
            let localApps = fs.readFileSync(app_path)
            console.log(localApps)
            console.log(JSON.stringify(apps))
            if (JSON.stringify(apps) == localApps) return true;
            this.needUpdate = true
            return false; 
        }

    async #getEpicGamesImage(gameName) {
        const query = {
            query: `query searchStoreQuery($keywords: String!) {
                Catalog {
                    searchStore(keywords: $keywords) {
                        elements {
                            title
                            keyImages {
                                type
                                url
                            }
                        }
                    }
                }
            }`,
            variables: { keywords: gameName }
        };
    
        const response = await fetch("https://store.epicgames.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(query)
        });
    
        const json = await response.json();
        const game = json.data.Catalog.searchStore.elements[0];
    
        if (!game) {
            console.log(`Jogo não encontrado: ${gameName}`);
            return;
        }
    
        // Obtendo a imagem da capa
        const imageUrl = game.keyImages.find(img => img.type === "OfferImageWide")?.url
        return imageUrl
    }
    

    async #getEpicGames() {
        let files = fs.readdirSync(this.path, {withFileTypes: true})
        files = files.filter((val) => val.name.endsWith('.item'))
        if (this.isUpdated(files)) return;
        fs.writeFileSync(process.env.APP_PATH + 'epicapps.json', JSON.stringify(files))
        for (let idx = 0; idx < files.length; idx++) {
            const app = JSON.parse(fs.readFileSync(path.join(this.path, files[idx].name)))
            const appName = app["AppName"]
            console.log(appName)
            const name = app["DisplayName"]
            const img = await this.#getEpicGamesImage(name)
            const img_path = path.join(process.env.APP_PATH, 'assets/images/', appName + '.jpg')
            await downloadImage(img, img_path)
            this.data.push({
                name: name,
                image: img_path,
                script: this.getEpicGameUrl(appName)
            })
        }
    }

    async fetchGames() {
        await this.#getEpicGames()
    }
    

    getEpicGameUrl(appName) {
        return `com.epicgames.launcher://apps/${appName}?action=launch&silent=true`;
    }
}

module.exports = {Epic}