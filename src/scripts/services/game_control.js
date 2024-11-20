const gameCard = document.querySelectorAll(".card")
let currentIndex = 0

document.addEventListener("DOMContentLoaded", () => {
    gameCard[0].style.transition = "0.3s"
    gameCard[0].style.transform = "scale(1.3)"
    gameCard[0].style.boxShadow = "5px 0px 30px 0 #ffffff"
    gameCard[0].style.cursor = "pointer"
})

document.addEventListener("keydown", (keyPressed) => {
    if (keyPressed.key === "ArrowRight") {
        currentIndex = (currentIndex + 1) % gameCard.length
        console.log(gameCard[currentIndex])
        console.log(currentIndex)
        gameControl()
    } else if (keyPressed.key === "ArrowLeft") {
        currentIndex = (currentIndex - 1 + gameCard.length) % gameCard.length
        gameControl(currentIndex)
    }
})

const gameControl = () => {
    gameCard.forEach((card) => {
        card.style.transform = "scale(1)"
        card.style.boxShadow = "none"
        card.style.cursor = "pointer"
    })
    const currentCard = gameCard[currentIndex]
    currentCard.style.transition = "0.3s"
    currentCard.style.transform = "scale(1.3)"
    currentCard.style.boxShadow = "5px 0px 30px 0 #ffffff"
    currentCard.style.cursor = "pointer"
}
