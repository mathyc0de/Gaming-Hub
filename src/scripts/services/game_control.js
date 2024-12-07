const { Gamepad } = require('../shared/gamepad')

class CardAnimationController {
    constructor(gameCard, navTools) {
        this.gamepads = []
        this.ticks = 0
        this.cardCarousel = document.getElementById('games')
        this.gameCard = gameCard
        this.navToolsChildren = Array.from(navTools.children)
        this.setCardsFocus()
        this.currentIndex = 1 
        this.gamepadLoop = this.gamepadLoop.bind(this); // Bind the animate method to the correct context
        requestAnimationFrame(this.gamepadLoop)

        window.addEventListener("gamepadconnected", (evt) => this.addGamepad(evt));
        window.addEventListener('gamepaddisconnected', (evt) => this.removeGamepad(evt))

        document.addEventListener("keydown", (keyPressed) => {
            switch (keyPressed.key) {
                case "ArrowRight":
                    this.FixSecondCard('right')
                    this.tabKeySimulation(keyPressed.key)
                    break;
                case "ArrowLeft":
                    this.FixSecondCard()
                    this.sTabKeySimulation(keyPressed.key)
                    break;
                case "ArrowUp":
                    if (this.cardsFocused) this.setNavBarFocus(keyPressed.key)
                    break
                case "ArrowDown":
                    if (this.navbarFocused) this.setCardsFocus(keyPressed.key)
                    break
            }
        })
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

    gamepadLoop() {
        this.ticks += 1
        let gamepads = navigator.getGamepads();
        if (this.gamepads.length > 0 && this.ticks % 17 == 0) {
            this.gamepads.forEach((gamepad, idx) => {
                gamepad.update(gamepads[idx])
                gamepad.buttonPressed(gamepad.buttons[0])
                switch (gamepad.getAxis()) {
                    case null:
                        break
                    case 'right':
                        this.sTabKeySimulation('ArrowRight')
                        break
                    case 'left':
                        this.sTabKeySimulation("ArrowLeft")
                        break
                    case 'down':
                        if (this.navbarFocused) this.setCardsFocus('ArrowDown')
                        break
                    case 'up':
                        if (this.cardsFocused) this.setNavBarFocus('ArrowUp')
                        break
                }
            })    
        }
        requestAnimationFrame(this.gamepadLoop);
    }
    

    // The following couple of functions will set the first card or nav-bar item as focused, aswell defining tabindex to 0 and the other's items to -1.
    // So the user can use the arrow keys to navigate (or any other input method, such as the gamepad).
    // Going back and forward on the cards will happen by emulating the TAB and SHIT TAB keys.

    setCardsFocus() {
        this.navbarFocused = 0
        this.cardsFocused = 1

        this.gameCard.forEach((card, index) => {
            card.tabIndex = index + 1
        });

        this.navToolsChildren.forEach((child, index) => {
            child.tabIndex = -1
        });

        this.gameCard[0].focus()

    }

    setNavBarFocus() {
        this.navbarFocused = 1
        this.cardsFocused = 0

        this.navToolsChildren.forEach((child, index) => {
            child.tabIndex = index + 1
        });
        this.gameCard.forEach(card => {
            card.tabIndex = -1
        });

        this.navToolsChildren[0].focus()
    }

    tabKeySimulation() {
        const focusedElement = document.activeElement
    
        const tabbableElements = Array.from(document.querySelectorAll('[tabindex], a, button, input, textarea, select, [contenteditable="true"]'))
            .filter(el => el.tabIndex !== -1 && !el.disabled && el.offsetParent !== null)
    
        const currentIndex = tabbableElements.indexOf(focusedElement)
    
        if (currentIndex !== -1 && currentIndex < tabbableElements.length - 1) {
            tabbableElements[currentIndex + 1]?.focus()
        }
    }
    
    sTabKeySimulation(keyPressed) {
        const tabbableElements = Array.from(document.querySelectorAll(`
            a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
        `)).filter(el => el.tabIndex !== -1 && !el.disabled && el.offsetParent !== null)
    
        const focusedElement = document.activeElement
        const currentIndex = tabbableElements.indexOf(focusedElement)
    
        if (keyPressed === 'ArrowRight' && currentIndex !== -1 && currentIndex < tabbableElements.length - 1) {
            tabbableElements[currentIndex + 1]?.focus()
        } else if (keyPressed === 'ArrowLeft' && currentIndex > 0) {
            tabbableElements[currentIndex - 1]?.focus()
        }
    }
    


    FixSecondCard(right) {
        if (this.cardsFocused){
            if (right){
                // Goes to the next card if it is not the last one.
                this.currentIndex = (this.currentIndex + 1 > this.gameCard.length) ? this.currentIndex : this.currentIndex + 1
            }
            else{ // is left...
                // Goes to the previous card if it is not the first one.
                this.currentIndex = (this.currentIndex - 1 === 0) ? this.currentIndex : this.currentIndex - 1
            }

            // Calculate the position to center the selected item in the second slot
            const itemWidth = this.gameCard[0].offsetWidth
            let offset = -(this.currentIndex - 1) * (itemWidth + 20)

            // Update the menu container's position
            this.cardCarousel.style.transform = `translateX(${offset}px)`
        }

    }
}

module.exports = { CardAnimationController }