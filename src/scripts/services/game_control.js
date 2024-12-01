class CardAnimationController {
    constructor(gameCard, navTools) {
        this.cardCarousel = document.getElementById('games')
        this.gameCard = gameCard
        this.navToolsChildren = Array.from(navTools.children)
        this.setCardsFocus()
        this.currentIndex = 1

        document.addEventListener("keydown", (keyPressed) => {
            switch (keyPressed.key) {
                case "ArrowRight":
                    // Menu scrolling shenanigans
                    this.currentIndex = (this.currentIndex + 1) % this.gameCard.length
                    this.updateMenu()
                    this.tabKeySimulation(keyPressed.key)
                    break;
                case "ArrowLeft":
                    // Menu scrolling shenanigans
                    this.currentIndex = (this.currentIndex - 1 + this.gameCard.length) % this.gameCard.length
                    this.updateMenu()
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


    // The following couple of functions will set the first card or nav-bar item as focused, aswell defining tabindex to 0 and the other's items to -1.
    // So the user can use the arrow keys to navigate (or any other input method, such as the gamepad).
    // Going back and forward on the cards will happen by emulating the TAB and SHIT TAB keys.

    setCardsFocus(){
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

    setNavBarFocus(){
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

    tabKeySimulation(){
        const focusedElement = document.activeElement

        const tabbableElements = Array.from(document.querySelectorAll('[tabindex], a, button, input, textarea, select, [contenteditable="true"]'))
            .filter(el => el.tabIndex !== -1 && !el.disabled && el.offsetParent !== null)
        const currentIndex = tabbableElements.indexOf(focusedElement)
        const nextIndex = (currentIndex + 1) % tabbableElements.length
        tabbableElements[nextIndex]?.focus()
    }

    sTabKeySimulation(keyPressed){
        // I only know what it does, not how.
        const tabbableElements = Array.from(document.querySelectorAll(`
            a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
        `)).filter(el => el.tabIndex !== -1 && !el.disabled && el.offsetParent !== null)
        const focusedElement = document.activeElement
        const currentIndex = tabbableElements.indexOf(focusedElement)
        const nextIndex = keyPressed === 'ArrowRight'
            ? (currentIndex + 1) % tabbableElements.length
            : (currentIndex - 1 + tabbableElements.length) % tabbableElements.length
        tabbableElements[nextIndex]?.focus()
    }


    updateMenu() {
        // Calculate the position to center the selected item in the second slot
        const itemWidth = this.gameCard[0].offsetWidth
        const offset = -(this.currentIndex - 1) * (itemWidth + 20)
        
        // Update the menu container's position
        this.cardCarousel.style.transform = `translateX(${offset}px)`

        // Set the focused item
        this.gameCard.forEach((item, index) => {
            item.classList.toggle('focused', index === this.currentIndex)
        })
    }
}

module.exports = {CardAnimationController}