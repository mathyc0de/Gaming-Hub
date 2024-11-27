const form = document.querySelector(".config-form")

console.log(form);

document.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = form.querySelector("input");
    console.log(input.value);
})