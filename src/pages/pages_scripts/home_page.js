const fs = require('fs')
const { GameData } = require('../scripts/services/find_games');
const {CardAnimationController} = require('../scripts/services/game_control')
const { join } = require('path')
const { Page } = require('../scripts/shared/page_controller')
const { buttons, Actions } =  require('../scripts/shared/gamepad')
const { scrollElements } = require('../scripts/shared/element_selector');



class HomePage extends Page {
    constructor() {
      super()
      this.loadGames()
      this.cardController = new CardAnimationController(document.querySelectorAll('.card'), document.getElementById("nav-tools"), this.gamepadController)
    }

    gamepadLoop() {
      if (this.gamepadController.updateLoop()) { 
          const gamepad = this.gamepadController.getActiveGamepad()
          gamepad.onPressed(buttons.A, Actions.accept)
          gamepad.onPressed(buttons.GUIDE, Actions.goHome)
          gamepad.onPressed(buttons.B, Actions.goBack)
          gamepad.onAxis(this.handleMovement.bind(this))
          //bind pega o contexto (this) para poder utilizar as funções definidas nesse escopo
      }
      requestAnimationFrame(this.gamepadLoop);
  }

  loadGames() {
    var data = fs.readFileSync(join(process.env.APP_PATH, 'game_data.json'))
    data = JSON.parse(data)
    for (const [key, value] of Object.entries(data)) {
      for (const game of Object.values(data[key])) {
        const parent = document.querySelector('.games')
        const card = document.createElement('div')
        card.className = 'card'
        card.id = game.name
        card.addEventListener('click', () => {
          ipcRenderer.send('load-local-url', game.script)
      });
      const img = document.createElement('img')
      img.src = game.image
      card.appendChild(img)
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
    }
  }
  
  handleKeyboard(keyPressed) {
    switch (keyPressed.key) {
        case "ArrowRight":
            scrollElements('right')
            this.cardController.updateCardIndex('right')
            this.cardController.lockSecondCard(true)
            break;
        case "ArrowLeft":
            scrollElements('left')
            this.cardController.updateCardIndex('left')
            this.cardController.lockSecondCard(false)
            break;
        case "ArrowUp":
            if (this.cardController.cardsFocused) this.cardController.setNavBarFocus(keyPressed.key)
            break
        case "ArrowDown":
            if (this.cardController.navbarFocused) this.cardController.setCardsFocus(keyPressed.key)
            break
    }
}

  handleMovement(movement) {
    switch (movement) {
        case 'right':
            scrollElements(movement)
            this.cardController.updateCardIndex(movement)
            this.cardController.lockSecondCard(true)
            break
        case 'left':
            scrollElements(movement)
            this.cardController.updateCardIndex(movement)
            this.cardController.lockSecondCard(false)
            break
        case 'down':
            if (this.cardController.navbarFocused) this.cardController.setCardsFocus('ArrowDown')
            break
        case 'up':
            if (this.cardController.cardsFocused) this.cardController.setNavBarFocus('ArrowUp')
            break
    }
}
}

const gameData = new GameData()
gameData.writeData().then((value) => {
  new HomePage()
  })