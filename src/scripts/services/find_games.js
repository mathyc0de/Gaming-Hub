const fs = require('fs')
const { Steam } = require('./launchers/steam')
const { Uplay } = require('./launchers/uplay');
const { Origin } = require('./launchers/eagames');
const { Epic } = require('./launchers/epic');
const path = require('path');

class GameData {
    constructor() {
        this.libs = JSON.parse(fs.readFileSync(path.join(process.env.APP_PATH, 'config.json')))
        this.steam = new Steam(this.libs.steam)
        this.epic = new Epic(this.libs.epic)
        this.uplay = new Uplay(this.libs.uplay)
        this.eaGames = new Origin(this.libs.origin)
        this.launchers = [
            this.steam,
            this.epic,
            this.uplay,
            this.eaGames
        ]
    
    }

    async #getData() {
        for (let idx = 0; idx < this.launchers.length; idx++) {
            if (this.launchers[idx].path) {
                await this.launchers[idx].fetchGames()
            }
        }
    }


    async writeData() {
        const game_data = process.env.APP_PATH + 'game_data.json'
        let copy = JSON.parse(fs.readFileSync(game_data))
        await this.#getData()
        const libs = 
        [
            this.steam,
            this.epic, 
            this.uplay,
            this.eaGames
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