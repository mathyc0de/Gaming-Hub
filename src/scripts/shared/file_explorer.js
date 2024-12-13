const fs = require('fs')
const { join } = require('path')

const getWindowsDrives = function () {
    const drives = []
    for (let idx = 65; idx < 91; idx++) {
        const word = String.fromCharCode(idx)
        if (fs.existsSync(`${word}:/`)) drives.push(`${word}:/`)
    }
    return drives
}

let path
let drives

switch (process.platform) {
    case 'linux':
        path = '/home/'
        break;
    case 'win32':
        drives = getWindowsDrives()
        path = ''
        break;
}
const parent = document.querySelector('.folders')

const updateFolders = function (path) {
    let folders;
    parent.innerHTML = ''
    if (path == '') {
        folders = drives
    }
    else {
        folders = fs.readdirSync(path)
    }
    folders.forEach((value, idx) => {
        const folder = document.createElement('div')
        folder.className = 'folder'
        folder.id = idx

        folder.textContent = value
        
        folder.addEventListener('click', () => {
            const folder = value + '/'
            const newPath = join(path, folder)
            console.log(newPath)
            updateFolders(newPath)
        })
        parent.appendChild(folder)
    })
}

updateFolders(path)