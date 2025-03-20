function vh(percent) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (percent * h) / 100;
  }

function vw(percent) {
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (percent * w) / 100;
  }

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
            let offset = -(this.currentIndex - 1) * (itemWidth - (vw(3.5)))
            this.cardCarousel.style.transform = `translateX(${offset}px)`
        }
    }

    setCardIdxMouse(card) {
        this.cardIndex = [...this.gameCard].indexOf(card)
        this.currentIndex = this.cardIndex + 1
        const itemWidth = this.gameCard[0].offsetWidth
        let offset = -(this.currentIndex - 1) * (itemWidth - (vw(3.5)))
        this.cardCarousel.style.transform = `translateX(${offset}px)`
        this.gameCard[this.cardIndex].focus()
    }
}

module.exports = { CardAnimationController }