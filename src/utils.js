const getRandInt = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
window.addEventListener('beforeunload', (e) => {
    fs.save()
  });
class Color {
    constructor(r,g,b,a){
        this.r = r
        this.g = g
        this.b = b
        this.a = a?a:255
    }
    toRgba = () =>{
        return `rgba(${this.r},${this.g},${this.b},${this.a/255})`
    }
}
const addProcessor = () => {
    const id = parseInt(prompt('Processor id (number)'))
    if(Number.isNaN(id)){
        alert("Invalid id")
        return
    }
    if (core.getDevice("processor",id)){
        alert("This processor already exists")
        return
    }
    const speed = parseInt(prompt('Processor speed(instruction pre second)'))
    if(Number.isNaN(speed)){
        alert("Invalid processor speed")
        return
    }
    new Processor([],id,1000/speed)
}
const addDisplay = () => {
    const id = parseInt(prompt('Screen id (number)'))
    if(Number.isNaN(id)){
        alert("Invalid id")
        return
    }
    if (core.getDevice("display",id)){
        alert("This dispaly already exists")
        return
    }
    const size = parseInt(prompt('Screen size (80/176)'))
    if(Number.isNaN(size)){
        alert("Invalid dispaly size")
        return
    }
    new Display(size,id)
}
const addBank = () =>{
    const id = parseInt(prompt('Memory bank id (number)'))
    if(Number.isNaN(id)){
        alert("Invalid id")
        return
    }
    if (core.getDevice("bank",id)){
        alert("This memory bank already exists")
        return
    }
    new bank(id)
}
const addCell = () =>{
    const id = parseInt(prompt('Memory cell id (number)'))
    if(Number.isNaN(id)){
        alert("Invalid id")
        return
    }
    if (core.getDevice("cell",id)){
        alert("This memory cell already exists")
        return
    }
    new cell(id)
}
const addSwitch = () =>{
    const id = parseInt(prompt('Switch id (number)'))
    if(Number.isNaN(id)){
        alert("Invalid id")
        return
    }
    if (core.getDevice("switch",id)){
        alert("This switch already exists")
        return
    }
    new Switch(id)
}
const addMessage = () =>{
    const id = parseInt(prompt('Message id (number)'))
    if(Number.isNaN(id)){
        alert("Invalid id")
        return
    }
    if (core.getDevice("message",id)){
        alert("This message already exists")
        return
    }
    new Message(id)
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