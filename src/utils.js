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
    new Processor([],id,1000/speed)
}
const addDisplay = () => {
    const id = parseInt(prompt('Screen id'))
    const size = parseInt(prompt('Screen size'))
    if(Number.isNaN(id) || Number.isNaN(size)) return
    new Display(size,id)
}
const addBank = () =>{
    const id = parseInt(prompt('Memory bank id'))
    if(Number.isNaN(id)) return 
    new bank(id)
}
const addCell = () =>{
    const id = parseInt(prompt('Memory cell id'))
    if(Number.isNaN(id)) return 
    new cell(id)
}
const addSwitch = () =>{
    const id = parseInt(prompt('Switch id'))
    if(Number.isNaN(id)) return 
    new Switch(id)
}
const addMessage = () =>{
    const id = parseInt(prompt('Message id'))
    if(Number.isNaN(id)) return 
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