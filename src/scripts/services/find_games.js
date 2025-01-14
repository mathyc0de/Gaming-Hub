const fs = require('fs')
const { Steam } = require('./launchers/steam')
const { Uplay } = require('./launchers/uplay');
const { Origin } = require('./launchers/eagames');
const { Epic } = require('./launchers/epic');

class GameData {
    constructor() {
        this.steam = new Steam()
        this.epic = new Epic()
        this.uplay = new Uplay()
        this.eaGames = new Origin()
    
    }

    async #getSteamData() {
        await this.steam.fetchGames()
    }


    async writeData() {
        console.log(fs.existsSync(join(process.env.APP_PATH, 'game_data.json')))
        console.log(process.env.APP_PATH)
        const game_data = process.env.APP_PATH + 'game_data.json'
        let copy = fs.readFileSync(game_data)
        copy = JSON.parse(copy)
        await this.#getSteamData()
        const libs = 
        [
            this.steam
            // this.epic, 
            // this.uplay,
            // this.eaGames
        ]
        libs.forEach(element => {
            if (element.needUpdate) {
                copy[element.lib] = element.data
            }
        });
        const json = JSON.stringify(copy)
        fs.writeFileSync(game_data, json, 'utf8')
    }
}




module.exports = {GameData}