const buttons = {
  A: 'A', B: 'B', X: 'X', Y: 'Y', LB: 'LB', RB: 'RB', LT: 'LT', 
  RT: 'RT', SELECT: 'SELECT', START: 'START', AXE0: 'AXE0', AXE1: 'AXE1', 
  ARROWUP: 'ARROWUP', ARROWDOWN: 'ARROWDOWN', ARROWLEFT: 'ARROWLEFT', 
  ARROWRIGHT: 'ARROWRIGHT', GUIDE: 'GUIDE'
}

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
      document.querySelector('#home').click()
  }
  
  static goBack() {
  
  }
  
  static accept() {
      document.activeElement.click()
  }
  
  }


class Gamepad {
    constructor(gamepad) {
        this.info = gamepad
        this.turbo = false
        this.buttons = gamepad.buttons
        this.buttonsCache = []
        this.buttonsStatus =  []
        this.axesStatus = []
        this.pressed = []
        this.ticks = 0
        this.hold = {
          'axis0': 0,
          'axis1': 0,
        }
    }

    useTime(interval) {
      if (this.ticks % interval == 0) return true
      return false
  }

    update(info) {
      this.ticks += 1
        // Clear the buttons cache
        this.buttonsCache = [];

      
        // Move the buttons status from the previous frame to the cache
        for (let k = 0; k < this.buttonsStatus.length; k++) {
          this.buttonsCache[k] = this.buttonsStatus[k];
        }
      
        // Clear the buttons status
        this.buttonsStatus = [];
        this.pressed = []
      
        // Get the gamepad object
        const c = this.info = info || {};
        // Loop through buttons and push the pressed ones to the array
        const pressed = [];
        if (c.buttons) {
          for (let b = 0; b < c.buttons.length; b++) {
            if (c.buttons[b].pressed) {
              this.pressed.push(inverse_buttons[b])
              pressed.push(this.buttons[b]);
            }
          }
        }
      
        // Loop through axes and push their values to the array
        const axes = [];
        if (c.axes) {
          for (let a = 0; a < c.axes.length; a++) {
            axes.push(c.axes[a].toFixed(2));
          }
        }
      
        // Assign received values
        this.axesStatus = axes;
        this.buttonsStatus = pressed;
        return pressed;
      }

getAxis() {
  const threshold = 0.65;
  let movement = null
  if (!this.useTime(17)) return;
  if (this.axesStatus[0] >= threshold) {
    movement = 'right'
  } else if (this.axesStatus[0] <= - threshold) {
    movement = 'left'
  }
  
  if (this.axesStatus[1] >= threshold) {
    movement = 'down'
  } else if (this.axesStatus[1] <= - threshold) {
    movement = 'up'
  }
  return movement
}

onPressed(button, func, args) {
  if (!this.pressed.find(element => element == button)) return;
  if (args) {
    func.call(this, args)
  }
  else {
    func()
  }
}

onAxis(func, withArgs = true, extraArgs = null) {
  const movement = this.getAxis()
  if (!movement) return;
  if (withArgs) {
    func.call(this, movement, extraArgs)
  }
  else {
    func()
  }
}
    
}

class GamepadController {
  constructor() {
    this.gamepads = []
    window.addEventListener("gamepadconnected", (evt) => this.addGamepad(evt));
    window.addEventListener('gamepaddisconnected', (evt) => this.removeGamepad(evt))
  }

  addGamepad(evt) {  
    let gamepad = new Gamepad(evt.gamepad)
    this.gamepads.push(gamepad)
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
    if (this.gamepads.length <= index ) return null
    return this.gamepads[index]
  }

  getAllGamepads() {
    return this.gamepads
  }

}

module.exports = { buttons, Actions, GamepadController } 