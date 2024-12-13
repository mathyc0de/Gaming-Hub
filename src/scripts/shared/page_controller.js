const { gamepadController } = require('./src/scripts/services/game_control')


class Page {
    constructor() {
        this.gamepadController = gamepadController
        this.stack = []
        this.effectiveArea = document.querySelector('.effectiveArea')
        this.gamepadLoop = this.gamepadLoop.bind(this)
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

    goBack() {
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