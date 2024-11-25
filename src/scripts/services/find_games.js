const fs = require('fs')
const { Steam } = require('./launchers/steam')
const download = require('image-downloader');
const path = require('path');
const { Uplay } = require('./launchers/uplay');
const { Origin } = require('./launchers/eagames');
const { Epic } = require('./launchers/epic');


const launch = {
    STEAM: "steam://rungameid/",
    EPIC: "com.epicgames.launcher://apps/",
    UPLAY: "uplay://launch/",
    ORIGIN: "origin://launchgame/",
    STANDALONE: "STANDALONE"
}

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
            console.log(element.needUpdate)
            if (element.needUpdate) {
                copy[element.lib] = element.data
            }
        });
        const json = JSON.stringify(copy)
        fs.writeFileSync(game_data, json, 'utf8')
    }
}




module.exports = {GameData}