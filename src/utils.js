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
    const speed = parseInt(prompt('Processor speed(instruction pre second)'))
    if(Number.isNaN(id)) return 
    if(Number.isNaN(speed)) return 
    core.createProcessor('',id,speed)
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
const loadSaveData = (data) =>{
    data = JSON.parse(atob(data))
    let settings = data.settings
    let devices = data.devices
    localStorage.setItem("settings",JSON.stringify(settings))
    localStorage.setItem("devices",JSON.stringify(devices))
    fs.save = () =>{}
    window.location = window.location
}
const exportSaveData = () =>{
    let data = {}
    data.settings = {
        "storageSelected":editor.storageSelected,
        "storageType":editor.storageType,
        "curProcessor":editor.curProcessor,
        "bls":core.noBorder
    }
    data.devices = []
    core.processors.forEach(processor=>{
        data.devices.push({
            "type":"processor",
            "id":processor.id,
            "instructions":processor.instructions,
            "speed":processor.speed,
            "running":processor.running,
            "breakpoints":processor.breakpoints?processor.breakpoints:[]
        })
    })
    core.displays.forEach(display=>{
        data.devices.push({
            "type":"display",
            "id":display.id,
            "size":display.displaysize,
        })
    })
    core.membanks.forEach(bank=>{
        data.devices.push({
            "type":"bank",
            "id":bank.id
        })
    })
    core.memcells.forEach(cell=>{
        data.devices.push({
            "type":"cell",
            "id":cell.id
        })
    })
    core.switches.forEach(Switch=>{
        data.devices.push({
            "type":"switch",
            "id":Switch.id
        })
    })
    console.log(btoa(JSON.stringify(data)))
}
(function() {
    const timeouts = [];
    const messageName = "zero-timeout-message";
    function setZeroTimeout(func) {
        timeouts.push(func);
        window.postMessage(messageName, "*");
    }
    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                const func = timeouts.shift();
                func();
            }
        }
    }
    window.addEventListener("message", handleMessage, true);
    window.setZeroTimeout = setZeroTimeout;
})();