const fs = require('fs')
const { GameData } = require('../services/find_games');
const {CardAnimationController} = require('../services/game_control')
const { ipcRenderer } = require('electron');

let gameData = new GameData()



function loadGames() {
  var data = fs.readFileSync('./game_data.json')
  data = JSON.parse(data)
  for (let idx = 0; idx < data.length; idx++) {
    const parent = document.querySelector('.games')
    const card = document.createElement('div')
    card.className = 'card'
    card.id = data[idx].name
    card.addEventListener('click', () => {
      console.log('stardew clicked');
      ipcRenderer.send('load-local-url', data[idx].script)
      // Add your logic here
  });
    const img = document.createElement('img')
    img.src = data[idx].image
    const title = document.createElement('h1')
    title.textContent = 'Start'
    card.appendChild(img)
    card.appendChild(title)
    parent.appendChild(card)
  }
}
window.addEventListener('DOMContentLoaded', async () => {
  gameData.writeData().then((val) => {gameData = null})
  loadGames()
  const animationController = new CardAnimationController(document.querySelectorAll('.card'))
  });