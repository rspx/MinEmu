const getRandInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
window.addEventListener('beforeunload', (e) => {
    fs.save()
  });
class Color {
    constructor(r,g,b,a){
        a = a?a:255
        return {"r":r,"g":g,"b":b,"a":a}
    }
}
function addProcessor() {
    const id = parseInt(prompt('Processor id'))
    if(Number.isNaN(id)) return 
    core.createProcessor('',parseInt(prompt('Processor id')))
}
function addDisplay() {
    const id = parseInt(prompt('Screen id'))
    const size = parseInt(prompt('Screen size'))
    if(Number.isNaN(id) || Number.isNaN(size)) return
    core.createDisplay(id, size)
}