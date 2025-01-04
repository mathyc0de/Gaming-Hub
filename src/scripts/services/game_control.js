class CardAnimationController {
    constructor(gameCard, navTools, gamepadController) {
        this.cardIndex = 0
        this.gamepadController = gamepadController
        this.cardCarousel = document.getElementById('games')
        this.gameCard = gameCard
        this.navToolsChildren = Array.from(navTools.children)
        this.setCardsFocus()
        this.currentIndex = 1
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

module.exports = { CardAnimationController }