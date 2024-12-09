const buttons = {
  A: 0, B: 1, X: 2, Y: 3, LB: 4,RB: 5, LT: 6, 
  RT: 7, SELECT: 8, START: 9, AXE0: 10, AXE1: 11, 
  ARROWUP: 12, ARROWDOWN: 13, ARROWLEFT: 14, ARROWRIGHT: 15, GUIDE: 16
}

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
        this.hold = {
          'axis0': 0,
          'axis1': 0,
        }
    }

    update(info) {
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
      

buttonPressed(button, hold) {
  let newPress = false;

  // Loop through pressed buttons
  for (let i = 0; i < this.buttonsStatus.length; i++) {
    // If we found the button we're looking for
    if (this.buttonsStatus[i] === button) {
      // Set the boolean variable to true
      console.log('si')
      newPress = true;

      // If we want to check the single press
      if (!hold) {
        // Loop through the cached states from the previous frame
        for (let j = 0; j < this.buttonsCache.length; j++) {
          // If the button was already pressed, ignore new press
          newPress = (this.buttonsCache[j] !== button);
        }
      }
    }
  }
  return newPress;
}

// Holding(button) {
//   switch (this.hold[button]) {
//     case 0:
//       console.log("s")
//       this.hold[button] ++
//       return true
//     case 1:
//       console.log("n")
//       this.hold[button] = 0
//       return false
//   }
// }

getAxis() {
  const threshold = 0.65;
  let movement = null
  if (this.axesStatus[0] >= threshold) {
    movement = 'right'
  } else if (this.axesStatus[0] <= - threshold) {
    movement = 'left'
  }
  
  // vertical movement
  if (this.axesStatus[1] >= threshold) {
    movement = 'down'
  } else if (this.axesStatus[1] <= - threshold) {
    movement = 'up'
  }
  return movement
}

onPressed(button, func, args) {
  if (this.pressed.findIndex(button) == -1) return;
  if (args) {
    func.apply(this, args)
  }
  else {
    func()
  }
}
    
}

class GamepadController {
  constructor() {
    this.ticks = 0
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

  useTime(interval) {
    if (this.ticks % interval == 0) return true
    return false
}

  updateLoop() {
    this.ticks += 1
    let gamepads = navigator.getGamepads();
    if (this.gamepads.length > 0 && this.useTime(17)) {
        // this.gamepads.forEach((gamepad, idx) => {
        //     gamepad.update(gamepads[idx])
        //     gamepad.onPressed().forEach((btn) => {
        //         switch (btn) {
        //             case buttons.A:
        //                 console.log(this.currentIndex - 1)
        //                 console.log(this.gameCard[this.currentIndex - 1])
        //                 // this.gameCard[this.currentIndex - 1].click()
        //                 break
        //         }
        //     })
        this.gamepads.forEach((gamepad, idx) => {
          gamepad.update(gamepads[idx])
        })
    }

  }
  
  getGamepad(index = 0) {
    if (this.gamepads.length <= index ) return null
    return this.gamepads[index]
  }

  getAllGamepads() {
    return this.gamepads
  }

}

module.exports = { Actions, GamepadController } 