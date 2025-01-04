const { ipcRenderer } = require("electron")

const buttons = {
  A: 'A', B: 'B', X: 'X', Y: 'Y', LB: 'LB', RB: 'RB', LT: 'LT', 
  RT: 'RT', SELECT: 'SELECT', START: 'START', AXE0: 'AXE0', AXE1: 'AXE1', 
  ARROWUP: 'ARROWUP', ARROWDOWN: 'ARROWDOWN', ARROWLEFT: 'ARROWLEFT', 
  ARROWRIGHT: 'ARROWRIGHT', GUIDE: 'GUIDE'
}

const axisThreshold = 0.65

// const buttons = {
//   A: 0, B: 1, X: 2, Y: 3, LB: 4,RB: 5, LT: 6, 
//   RT: 7, SELECT: 8, START: 9, AXE0: 10, AXE1: 11, 
//   ARROWUP: 12, ARROWDOWN: 13, ARROWLEFT: 14, ARROWRIGHT: 15, GUIDE: 16
// }

const inverse_buttons = {
  0: 'A', 1: 'B', 2: 'X', 3: 'Y', 4: 'LB', 5: 'RB', 6: 'LT', 
  7: 'RT', 8: 'SELECT', 9: 'START', 10: 'AXE0', 11: 'AXE1', 
  12: 'ARROWUP', 13: 'ARROWDOWN', 14: 'ARROWLEFT', 15: 'ARROWRIGHT', 16: 'GUIDE'
}


class Actions {


  static goHome() {
      const tag = document.createElement('a')
      tag.href = "./home_page.html"
      tag.click()
  }
  
  static goBack() {
    ipcRenderer.send('back')
  }
  
  static accept() {
      document.activeElement.click()
  }
  
}


class Gamepad {
  constructor(gamepad) {
    this.info = gamepad
    this.axesStatus = []
    this.pressed = []
    this.ticks = 0
  }

  useTime(interval) {
    if (this.ticks % interval == 0) return true
    return false
  }

  update(info) {
    this.ticks ++

    this.axesStatus = []

    this.pressed = []

    const gamepad = this.info = info || {};

    if (gamepad.buttons) {
      for (let button = 0; button < gamepad.buttons.length; button++) {
        if (gamepad.buttons[button].pressed) {
          this.pressed.push(inverse_buttons[button])
        }
      }
    }

    if (gamepad.axes) {
      for (let axis = 0; axis < gamepad.axes.length; axis++) {
        this.axesStatus.push(gamepad.axes[axis].toFixed(2));
      }
    }
  }

  getAxis() {
    let movement = null
    if (!this.useTime(17)) return;
    if (this.axesStatus[0] >= axisThreshold) {
      movement = 'right'
    } else if (this.axesStatus[0] <= - axisThreshold) {
      movement = 'left'
    }
    
    if (this.axesStatus[1] >= axisThreshold) {
      movement = 'down'
    } else if (this.axesStatus[1] <= - axisThreshold) {
      movement = 'up'
    }
    return movement
  }

  onPressed(button, func, args) {
    if (!this.pressed.find(element => element == button)) return;
    func.call(this, args)
  }

  onAxis(func, withArgs = true) {
    const movement = this.getAxis()
    if (!movement) return;
    if (withArgs) func.call(this, movement)
    else func()
  }

}

class GamepadController {
  constructor() {
    console.log("jkashsfka")
    this.gamepads = []
    window.addEventListener("gamepadconnected", (evt) => this.addGamepad(evt));
    window.addEventListener('gamepaddisconnected', (evt) => this.removeGamepad(evt))
  }

  addGamepad(evt) {
    console.log("Bashdsil ")
    let gamepad = new Gamepad(evt.gamepad)
    this.gamepads.push(gamepad)
    console.log(this.gamepads)
  }

  removeGamepad(evt) {
    this.gamepads.map((gamepad) => {
        if (gamepad.id == evt.id) {
            this.gamepads.pop(gamepad)
            return
        }
    })
  }

  updateLoop() {
    let gamepads = navigator.getGamepads();
    if (this.gamepads.length > 0) {
      this.gamepads.forEach((gamepad, idx) => {
        gamepad.update(gamepads[idx])
      })
      return true
    }
    return false
  }
  
  getGamepad(index = 0) {
    if (this.gamepads.length <= index ) return
    return this.gamepads[index]
  }

  getAllGamepads() {
    return this.gamepads
  }

}

module.exports = { buttons, Actions, GamepadController }