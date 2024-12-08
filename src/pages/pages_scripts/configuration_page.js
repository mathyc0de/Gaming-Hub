const { Gamepad } = require('../scripts/shared/gamepad')


console.log(window.location.pathname)
const form = document.querySelector(".config-form")

document.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    console.log(input.value);
})

