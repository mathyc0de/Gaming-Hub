const { scrollElements } = require('../scripts/shared/element_selector')
const { buttons,  Actions } = require('../scripts/shared/gamepad')
const { gamepadController } = require('../scripts/services/game_control')

function gamepadLoop() {
    if (gamepadController.updateLoop()) { 
        const gamepad = gamepadController.getGamepad(1)
        gamepad.onPressed(buttons.A, Actions.accept)
        gamepad.onPressed(buttons.GUIDE, Actions.goHome)
        gamepad.onPressed(buttons.B, Actions.goBack)
        gamepad.onAxis(scrollElements)
        //bind pega o contexto (this) para poder utilizar as funções definidas nesse escopo
    }
    requestAnimationFrame(this.gamepadLoop);
}

function changeStmPath() {
    document.querySelector('.effectiveArea').innerHTML = ''
}







const actions = {
    stmpath: changeStmPath,
    color: console.log
}

const configs = document.querySelectorAll('.config')
configs.forEach((element, idx) => {
    element.tabIndex = idx
    element.addEventListener('click', (ev) => {
    actions[element.id].call(this)
    })
})

configs[0].focus()
requestAnimationFrame(gamepadLoop)