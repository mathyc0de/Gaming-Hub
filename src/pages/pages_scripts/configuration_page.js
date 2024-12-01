const fs = require('fs')
const { join } = require('path')


let path
switch (process.platform) {
    case 'linux':
        path = '/home/'
        break;
    case 'win32':
        path = 'C:/'
        break;
}
const parent = document.querySelector('.folders')

const updateFolders = function (path) {
    parent.innerHTML = ''
    const folders = fs.readdirSync(path)
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