const { mkdirSync, writeFileSync, readFileSync } = require("fs");
const path = require("path");
const VDF = require('vdf-parser');


function getSteamLibs(env) {
    const text = readFileSync(path.join(env['ProgramFiles(x86)'], '/Steam/steamapps/', 'libraryfolders.vdf'))
    const parsed = VDF.parse(text.toString('utf-8'))
    const libraryfolders = parsed.libraryfolders
    const libs = []
    for (let lib in libraryfolders) {
        libs.push(path.normalize(libraryfolders[lib].path))
    }
    return libs
}

function linuxSetup(env) {
    // mkdirSync("")
}

function windowsSetup(env) {
    getSteamLibs(env)
    const ghub_path = path.join(env.LOCALAPPDATA, '/gaming_hub/')
    mkdirSync(path.join(ghub_path, 'assets/images'), {recursive: true})
    writeFileSync(ghub_path + 'config.json', JSON.stringify({
        steam: {
            libraries: getSteamLibs(env)
        }
    }))
    writeFileSync(ghub_path + 'steamapps.json', '[]')
    writeFileSync('.env', `APP_PATH=${ghub_path}`)
    writeFileSync(path.join(ghub_path, 'game_data.json'), '{}')
}

function setupPath(platform, env) {
    switch (platform) {
        case 'linux':
            linuxSetup(env)
            break
        case 'win32':
            windowsSetup(env)
            break;
    }
}

module.exports = {setupPath, getSteamLibs}