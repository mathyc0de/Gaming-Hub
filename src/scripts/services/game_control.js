const { buttons, Actions, gamepadController } =  require('../shared/gamepad')
const { scrollElements } = require('../shared/element_selector')


class CardAnimationController {
    constructor(gameCard, navTools) {
        this.cardIndex = 0
        this.cardCarousel = document.getElementById('games')
        this.gameCard = gameCard
        this.navToolsChildren = Array.from(navTools.children)
        this.setCardsFocus()
        this.currentIndex = 1
        this.gamepadLoop = this.gamepadLoop.bind(this)
        requestAnimationFrame(this.gamepadLoop)
        document.addEventListener("keydown", (keyPressed) => this.handleKeyboard(keyPressed))
    }

    updateCardIndex(side) {
        switch (side) {
            case 'right':
                if (this.currentIndex < this.gameCard.length && this.cardsFocused) this.cardIndex ++
                break
            case 'left':
                if (this.cardIndex > 0 && this.cardsFocused) this.cardIndex --
                break
        } 
    }

    handleKeyboard(keyPressed) {
        switch (keyPressed.key) {
            case "ArrowRight":
                scrollElements('right')
                this.updateCardIndex('right')
                this.lockSecondCard(true)
                break;
            case "ArrowLeft":
                scrollElements('left')
                this.updateCardIndex('left')
                this.lockSecondCard(false)
                break;
            case "ArrowUp":
                if (this.cardsFocused) this.setNavBarFocus(keyPressed.key)
                break
            case "ArrowDown":
                if (this.navbarFocused) this.setCardsFocus(keyPressed.key)
                break
        }
    }

    handleMovement(movement) {
        switch (movement) {
            case 'right':
                scrollElements(movement)
                this.updateCardIndex(movement)
                this.lockSecondCard(true)
                break
            case 'left':
                scrollElements(movement)
                this.updateCardIndex(movement)
                this.lockSecondCard(false)
                break
            case 'down':
                if (this.navbarFocused) this.setCardsFocus('ArrowDown')
                break
            case 'up':
                if (this.cardsFocused) this.setNavBarFocus('ArrowUp')
                break
        }
    }

    
    
    gamepadLoop() {
        if (gamepadController.updateLoop()) { 
            const gamepad = gamepadController.getGamepad(1)
            gamepad.onPressed(buttons.A, Actions.accept)
            gamepad.onPressed(buttons.GUIDE, Actions.goHome)
            gamepad.onAxis(this.handleMovement.bind(this))
            //bind pega o contexto (this) para poder utilizar as funções definidas nesse escopo
        }
        requestAnimationFrame(this.gamepadLoop);
    }

    setCardsFocus() {
        this.navbarFocused = 0
        this.cardsFocused = 1

        this.gameCard.forEach((card, index) => {
            card.tabIndex = index + 1
        });

        this.navToolsChildren.forEach((child, index) => {
            child.tabIndex = -1
        });
        this.gameCard[this.cardIndex].focus()

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
    


    lockSecondCard(isRight) {
        if (this.cardsFocused){
            if (isRight){
                this.currentIndex = (this.currentIndex + 1 > this.gameCard.length) ? this.currentIndex : this.currentIndex + 1
            }
            else{
                this.currentIndex = (this.currentIndex - 1 === 0) ? this.currentIndex : this.currentIndex - 1
            }
            const itemWidth = this.gameCard[0].offsetWidth
            let offset = -(this.currentIndex - 1) * (itemWidth + 20)
            this.cardCarousel.style.transform = `translateX(${offset}px)`
        }

    }
}

module.exports = { CardAnimationController, gamepadController}