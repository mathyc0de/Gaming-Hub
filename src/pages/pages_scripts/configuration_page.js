const { scrollElements } = require('../scripts/shared/element_selector')
const { buttons,  Actions } = require('../scripts/shared/gamepad')
const { Page } = require('../scripts/shared/page_controller')

class ConfigurationPage extends Page {
    constructor() {
        super()
        this.main = document.querySelectorAll('.config')
        this.main.forEach((element, idx) => {
            element.tabIndex = idx
            element.addEventListener('click', (ev) => {
                this.actions[element.id].call(this)
        })
        this.configs[0].focus()
        })
    }


    handleKeyboard(keyPressed) {
        switch (keyPressed.key) {
            case "ArrowUp":
                scrollElements('up')
                break;
            case "ArrowDown":
                scrollElements('down')
                break;
            case "q":
                this._goBack()
                break;
        }
    }


    gamepadLoop() {
        if (this.gamepadController.updateLoop()) { 
            const gamepad = this.gamepadController.getGamepad(1)
            gamepad.onPressed(buttons.A, Actions.accept)
            gamepad.onPressed(buttons.GUIDE, Actions.goHome)
            gamepad.onPressed(buttons.B, Actions.goBack)
            gamepad.onAxis(scrollElements)
            //bind pega o contexto (this) para poder utilizar as funções definidas nesse escopo
        }
        requestAnimationFrame(this.gamepadLoop);
    }

    
}

new ConfigurationPage()