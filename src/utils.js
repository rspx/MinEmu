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
const addProcessor = () => {
    const id = parseInt(prompt('Processor id'))
    if(Number.isNaN(id)) return 
    core.createProcessor('',id)
}
const addDisplay = () => {
    const id = parseInt(prompt('Screen id'))
    const size = parseInt(prompt('Screen size'))
    if(Number.isNaN(id) || Number.isNaN(size)) return
    core.createDisplay(id, size)
}
const addBank = () =>{
    const id = parseInt(prompt('Memory bank id'))
    if(Number.isNaN(id)) return 
    core.createMemBank(id)
}
const addCell = () =>{
    const id = parseInt(prompt('Memory cell id'))
    if(Number.isNaN(id)) return 
    core.createMemCell(id)
}
const addSwitch = () =>{
    const id = parseInt(prompt('Switch id'))
    if(Number.isNaN(id)) return 
    core.createSwitch(id)
}