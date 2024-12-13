function changeStmPath() {
    document.querySelector('.effectiveArea').innerHTML = ''
}







const actions = {
    stmpath: changeStmPath,
    color: console.log
}

const configs = document.querySelectorAll('.config')
configs.forEach((element) => element.addEventListener('click', (ev) => {
    actions[element.id].call(this)
}))
