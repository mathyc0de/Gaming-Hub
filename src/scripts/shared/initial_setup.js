const { mkdirSync, writeFileSync, readFileSync, existsSync } = require("fs");
const {execSync} = require('child_process')
const path = require("path");


// const VDF = require('vdf-parser');


// function getSteamLibs(steam_path) {
//     const text = readFileSync(path.join(env['ProgramFiles(x86)'], '/Steam/steamapps/', 'libraryfolders.vdf'))
//     const parsed = VDF.parse(text.toString('utf-8'))
//     const libraryfolders = parsed.libraryfolders
//     const libs = []
//     for (let lib in libraryfolders) {
//         libs.push(path.normalize(libraryfolders[lib].path))
//     }
//     return libs
// }


function getLibs(obj) {
    try {
            const steam_path = execSync('reg query "HKEY_CURRENT_USER\\Software\\Valve\\Steam" /v SteamPath')
                    .toString()
                    .split('REG_SZ')[1]
                    .trim();
                obj['steam'] = steam_path;
            } catch (error) {
                console.error("Error finding Steam path in registry:", error);
            }
    if (existsSync('C:\\ProgramData\\Epic\\EpicGamesLauncher\\Data\\Manifests')) {
        obj['epic'] = 'C:/ProgramData/Epic/EpicGamesLauncher/Data/Manifests/'
    }
}


function linuxSetup() {
    // mkdirSync("")
}

function windowsSetup() {
    const ghub_path = path.join(process.env.LOCALAPPDATA, '/gaming_hub/')
    const lib = {}
    getLibs(lib)
    mkdirSync(path.join(ghub_path, 'assets/images'), {recursive: true})
    writeFileSync(ghub_path + 'config.json', JSON.stringify(lib))
    writeFileSync(ghub_path + 'steamapps.json', '[]')
    writeFileSync(ghub_path + 'epicapps.json', '[]')
    writeFileSync('.env', `APP_PATH=${ghub_path}`)
    writeFileSync(path.join(ghub_path, 'game_data.json'), '{}')
}

function setupPath(platform) {
    switch (platform) {
        case 'linux':
            linuxSetup()
            break
        case 'win32':
            windowsSetup()
            break;
    }
}

function refreshLibs() {
    const localLibs = JSON.parse(readFileSync(process.env.APP_PATH + 'config.json'))
    const libs = ['steam', 'epic', 'uplay', 'ea']
    libs.forEach((lib) => {
        if (!localLibs[`${lib}`]) {
            getLibs(lib, localLibs)
        }
    })
    writeFileSync(process.env.APP_PATH + 'config.json', JSON.stringify(localLibs))

}


module.exports = {setupPath}