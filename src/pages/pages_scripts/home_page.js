const fs = require('fs')
const { GameData } = require('../scripts/services/find_games');
const {CardAnimationController} = require('../scripts/services/game_control')
const { join } = require('path')
const { Page } = require('../scripts/shared/page_controller')

let gameData = new GameData()


class HomePage extends Page {
    constructor() {
        super()
    }
}

new HomePage()

function loadGames() {
  var data = fs.readFileSync(join(process.env.APP_PATH, 'game_data.json'))
  data = JSON.parse(data)
  const libs = [
    'steam'
    // 'epic',
    // 'eagames',
    // 'uplay'
  ]
  libs.forEach(function (lib, _) {
    for (let idx = 0; idx < data[lib].length; idx++) {
      const parent = document.querySelector('.games')
      const card = document.createElement('div')
      card.className = 'card'
      card.id = data[lib][idx].name
      card.addEventListener('click', () => {
        console.log('stardew clicked');
        ipcRenderer.send('load-local-url', data[lib][idx].script)
        // Add your logic here
    });
    const img = document.createElement('img')
    img.src = data[lib][idx].image
    // const title = document.createElement('h1')
    // title.textContent = 'Start'
    card.appendChild(img)
    // card.appendChild(title)
    parent.appendChild(card)

    card.addEventListener('focus', () => {
      if (!card.querySelector('h1')) {  // Prevent adding title multiple times
        const title = document.createElement('h1')
        title.textContent = 'Start'
        card.appendChild(title)
        title.addEventListener('animationend', () => {
          card.style.boxShadow = '5px 0px 30px 0 #ffffff';
        });
      }
    })

    card.addEventListener('blur', () => {
      const title = card.querySelector('h1')
      if (title) {
        card.removeChild(title)
        card.style.boxShadow = ''
      }
    })
    }
  });
}

gameData.writeData().then((value) => {
    loadGames()
    const animationController = new CardAnimationController(document.querySelectorAll('.card'), document.getElementById("nav-tools"))})