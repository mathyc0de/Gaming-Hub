const { GamepadController } = require('../../../src/scripts/shared/gamepad')
const gamepadController = new GamepadController()

class Page {
    constructor() {
        this.gamepadController = gamepadController
        this.stack = []
        this.effectiveArea = document.querySelector('.effectiveArea')
        this.gamepadLoop = this.gamepadLoop.bind(this)
        document.addEventListener("keydown", (keyPressed) => this.handleKeyboard(keyPressed))
        requestAnimationFrame(this.gamepadLoop)
    }

    gamepadLoop() {
        throw new Error('You have to implement the method gamepadLoop!');
    }

    handleKeyboard() {
        throw new Error('You have to implement the method handleKeyboard!');
    }

    store() {
        this.stack.push(this.effectiveArea)
        this.effectiveArea.innerHTML = ''
    }

    _goBack() {
        const index = this.stack.pop()
        if (index) {
            this.effectiveArea.append(index)
        }
        else {
            ipcRenderer.send('back')
        }
    }
}

module.exports = {Page}