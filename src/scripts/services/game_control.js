class CardAnimationController {
    constructor(gameCard) {
        this.gameCard = gameCard
        this.currentIndex = 0
        this.initState()
        document.addEventListener("keydown", (keyPressed) => {
            if (keyPressed.key === "ArrowRight") {
                this.currentIndex = (this.currentIndex + 1) % gameCard.length
                console.log(gameCard[this.currentIndex])
                console.log(this.currentIndex)
                this.update()
            } else if (keyPressed.key === "ArrowLeft") {
                this.currentIndex = (this.currentIndex - 1 + gameCard.length) % gameCard.length
                this.update()
            }
        })
    }


    initState() {
        this.gameCard[0].style.transition = "0.3s"
        this.gameCard[0].style.transform = "scale(1.3)"
        this.gameCard[0].style.boxShadow = "5px 0px 30px 0 #ffffff"
        this.gameCard[0].style.cursor = "pointer"
        this.gameCard[0].style.margin = "0 50px"

    }


    update() {
        this.gameCard.forEach((card) => {
            card.style.transform = "scale(1)"
            card.style.boxShadow = "none"
            card.style.cursor = "pointer"
            card.style.margin = "0"
        })
        const currentCard = this.gameCard[this.currentIndex]
        currentCard.style.transition = "0.3s"
        currentCard.style.transform = "scale(1.3)"
        currentCard.style.boxShadow = "5px 0px 30px 0 #ffffff"
        currentCard.style.cursor = "pointer"
        currentCard.style.margin = "0 50px"
    }
}

module.exports = {CardAnimationController}