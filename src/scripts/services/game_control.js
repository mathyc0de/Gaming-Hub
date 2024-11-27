class CardAnimationController {
    constructor(gameCard, navTools) {
        this.gameCard = gameCard
        this.navToolsChildren = Array.from(navTools.children)
        this.setCardsFocus()

        document.addEventListener("keydown", (keyPressed) => {
            if (keyPressed.key === "ArrowRight") {
                this.tabKeySimulation()
            }
            else if (keyPressed.key === "ArrowLeft") {
                this.sTabKeySimulation()
            } 
            else if ((keyPressed.key === "ArrowUp") && (this.cardsFocused)){
                this.setNavBarFocus()
            }
            else if ((keyPressed.key === "ArrowDown") && (this.navbarFocused)){
                this.setCardsFocus()
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

    sTabKeySimulation(){
        // I only know what it does, not how.
        const tabbableElements = Array.from(document.querySelectorAll(`
            a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
        `)).filter(el => el.tabIndex !== -1 && !el.disabled && el.offsetParent !== null)
        const focusedElement = document.activeElement
        const currentIndex = tabbableElements.indexOf(focusedElement)
        const nextIndex = event.key === 'ArrowRight'
            ? (currentIndex + 1) % tabbableElements.length
            : (currentIndex - 1 + tabbableElements.length) % tabbableElements.length
        tabbableElements[nextIndex]?.focus()
    }
}

module.exports = {CardAnimationController}