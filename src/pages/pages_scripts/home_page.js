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
      addEventListener('wheel', (event) => {
        this.preventLostFocus()
        if (event.deltaY > 0) {
          scrollElements('right')
          this.cardController.updateCardIndex('right')
          this.cardController.lockSecondCard(true)
        }
        else {
          scrollElements('left')
          this.cardController.updateCardIndex('left')
          this.cardController.lockSecondCard(false)
        }
      })
      addEventListener('mousemove', () => {
        document.body.style.cursor = 'default'
      })
    }

    preventLostFocus() {
      if (document.activeElement.className != 'card' && document.activeElement.tagName != 'a') this.cardController.setCardsFocus()
    }
    

    runningGame(game, card) {
      let open = false
      card.querySelector('h1').textContent = 'Loading'
      let intervalID = setInterval(() => {
        const running = ipcRenderer.sendSync('check-game-running', game.script)
        if (running && !open) {

          card.addEventListener('focus', () => {
            if (!card.querySelector('h1')) {  // Prevent adding title multiple times
              const title = document.createElement('h1')
              title.textContent = 'Stop'
              card.appendChild(title)
              title.addEventListener('animationend', () => {
                card.style.boxShadow = '5px 0px 30px 0 #ffffff';
              });
            }
            else {
              card.querySelector('h1').textContent = 'Stop'
            }
          })

          card.addEventListener('click', () => {
            ipcRenderer.send('close-steam-game', game.script)
          }
        )

          open = true

        }
        if (!running && open) {
          card.addEventListener('focus', () => {
            if (!card.querySelector('h1')) {  // Prevent adding title multiple times
              const title = document.createElement('h1')
              title.textContent = 'Start'
              card.appendChild(title)
              title.addEventListener('animationend', () => {
                card.style.boxShadow = '5px 0px 30px 0 #ffffff';
              });
            }
            else {
              card.querySelector('h1').textContent = 'Start'
            }
          })
          card.addEventListener('click', () => {
            ipcRenderer.send('load-steam-game', game.script)
            this.runningGame(game, card)
          })
          clearInterval(intervalID)
        }
      }, 1000)
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
    for (const [lib, value] of Object.entries(data)) {
      for (const game of Object.values(data[lib])) {
        const parent = document.querySelector('.games')
        const card = document.createElement('div')
        card.className = 'card'
        card.id = game.name
        card.addEventListener('click', () => {
          ipcRenderer.send(lib == 'steam'? 'load-steam-game': 'load-local-url', game.script)
          this.runningGame(game, card)
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

      // card.addEventListener('mouseenter', () => {
      //   this.cardController.setCardIdxMouse(card)
      // })
  
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
    document.body.style.cursor = 'none'
    this.preventLostFocus()
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
    document.body.style.cursor = 'none'
    this.preventLostFocus()
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