function tabKeySimulation() {
    const focusedElement = document.activeElement

    const tabbableElements = Array.from(document.querySelectorAll('[tabindex], a, button, input, textarea, select, [contenteditable="true"]'))
    .filter(element => element.tabIndex !== -1 && !element.disabled && element.offsetParent !== null)

    const currentIndex = tabbableElements.indexOf(focusedElement)

    if (currentIndex !== -1 && currentIndex < tabbableElements.length - 1) {
        tabbableElements[currentIndex + 1]?.focus()
    }
}

function sTabKeySimulation() {
    const tabbableElements = Array.from(document.querySelectorAll(`
        a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
    `)).filter(el => el.tabIndex !== -1 && !el.disabled && el.offsetParent !== null)

    const focusedElement = document.activeElement
    const currentIndex = tabbableElements.indexOf(focusedElement)

    if (currentIndex > 0) {
        tabbableElements[currentIndex - 1]?.focus()
    }
}

function scrollElements(move) {
    if (move == 'right') {
        tabKeySimulation()
        return
    }
    sTabKeySimulation()
}

module.exports = {scrollElements}