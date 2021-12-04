// Timing stuff
// var funcCount = 0
// tickCounter = () =>{
//     //Tick sum from all processors
//     p = `Got ${funcCount} ticks per seccond`
//     funcCount = 0
//     setTimeout(tickCounter,1000)
// }
// setTimeout(tickCounter,1000)
const runFunction = () =>{
    if (!core.threadRunning){
        return
    }
    const processors = core.processors
    const processos_len = core.processors.length
    for (let i = 0; i < processos_len; i++) {
        const processor =  processors[i]
        processor.running && performance.now() - processor.last_tick >= processor.speed && (
            setZeroTimeout(processor.tick),
            processor.last_tick = performance.now()
        )
    }
    setZeroTimeout(runFunction)
}
class core {
    static defualtDisplaySize = 176
    static displays = []
    static processors = []
    static switches = []
    static memcells = []
    static membanks = []
    static virtualDevices = []
    static threadRunning = false
    static suportedDevices = ["display","processor","cell","bank","switch"]
    static createDrawBuffer = (size,color) =>{
        const arr = new Uint8ClampedArray(size*size*4);
        color = color?color:new Color(89,89,102)
        for (let i = 0; i < arr.length; i += 4) {
          arr[i + 0] = color.r; 
          arr[i + 1] = color.g; 
          arr[i + 2] = color.b; 
          arr[i + 3] = color.a; 
        }
        return {"buffer":arr,"size":size}
    }
    static displayExists = (id) =>{
        for (let i = 0; i < this.displays.length; i++) {
            if (this.displays[i].id == id) return false
        }
        return true
    }
    static stopThread = () =>{
        this.threadRunning = false
    }
    static startThread = () =>{setZeroTimeout(runFunction)
        this.threadRunning = true
    }
    static createDisplay = (id,size) =>{
        size = size==80?size:core.defualtDisplaySize
        if (this.getDisplay(id)) {
            logger.warn("Trying to create display with taken id") 
            return this.getDisplay(id)
        }
        this.displays.push(new Display(size,id))
        return this.getDisplay(id)
    }
    static createVirtualDevice(id,name,image,properites){
        properites = properites?properites:[]
        this.virtualDevices.push(new virtualDevice(id,properites,name,image))
    }
    static createProcessor = (instructions,id, speed) =>{
        if (this.getProcessor(id)) {
            logger.warn("Trying to create processor with taken id updating speed instead") 
            this.getProcessor(id).setSpeed(speed)
            return this.getProcessor(id)
        }
        this.processors.push(new Processor(instructions.split("\n"),id,1000/speed))
        return this.getProcessor(id)
    }
    static createMemCell = (id) =>{
        if (this.getMemCell(id)) {
            logger.warn("Trying to create memcell with taken id") 
            return this.getMemCell(id)
        }
        this.memcells.push(new memcell(id))
        return this.getMemCell(id)
    }
    static createMemBank = (id) =>{
        if (this.getMemBank(id)) {
            logger.warn("Trying to create membank with taken id") 
            return this.getMemBank(id)
        }
        this.membanks.push(new membank(id))
        return this.getMemBank(id)
    }
    static createSwitch = (id) =>{
        if (this.getSwitch(id)) {
            logger.warn("Trying to create switch with taken id") 
            return this.getSwitch(id)
        }
        this.switches.push(new Switch(id))
        return this.getSwitch(id)
    }
    static removeDisplay = (id) =>{
        core.displays = core.displays.filter(display=>{
            if (display.id == id){
                display.displayElement.remove()
                return false
            }
            return true
        })
    }
    static removeProcessor = (id) =>{
        core.processors = core.processors.filter(processor=>{
            if (processor.id == id){
                if (editor.curProcessor == id){
                    editor.selectProcessor(false)
                }
                processor.btn.remove()
                return false
            }
            return true
        })
    }
    static removeVirtualDevice = (id,name) =>{
        core.virtualDevices = core.virtualDevices.filter(virtualDevice=>{
            if (virtualDevice.id == id && virtualDevice.name == name){
                console.log(virtualDevice)
                if (editor.virtualDeviceSelected == id && editor.virtualDeviceName == name){
                    editor.selectProcessor(false)
                }
                virtualDevice.btn.remove()
                return false
            }
            return true
        })
    }
    static removeMemCell = (id) =>{
        core.memcells = core.memcells.filter(cell=>{
            if (cell.id == id){
                cell.btn.remove()
                return false
            }
            return true
        })
    }
    static removeMemBank = (id) =>{
        core.membanks = core.membanks.filter(bank=>{
            if (bank.id == id){
                bank.btn.remove()
                return false
            }
            return true
        })
    }
    static removeSwitch = (id) =>{
        core.switches = core.switches.filter(Switch=>{
            if (Switch.id == id){
                Switch.btn.remove()
                return false
            }
            return true
        })
    }
    static getDisplay = (id) =>{
        for (let i = 0; i < this.displays.length; i++) {
            if (this.displays[i].id == id) return this.displays[i]
        }
        return false
    }
    static getProcessor = (id) =>{
        for (let i = 0; i < this.processors.length; i++) {
            if (this.processors[i].id == id) return this.processors[i]
        }
        return false
    }
    static getMemCell = (id) =>{
        for (let i = 0; i < this.memcells.length; i++) {
            if (this.memcells[i].id == id) return this.memcells[i]
        }
        return false
    }
    static getMemBank = (id) =>{
        for (let i = 0; i < this.membanks.length; i++) {
            if (this.membanks[i].id == id) return this.membanks[i]
        }
        return false
    }
    static getSwitch = (id) =>{
        for (let i = 0; i < this.switches.length; i++) {
            if (this.switches[i].id == id) return this.switches[i]
        }
        return false
    }
    static getDevice = (name) =>{
        for (let i = 0; i < this.suportedDevices.length; i++) {
            if (name.replace(this.suportedDevices[i],"") !== name){
                let deviceId = name.replace(this.suportedDevices[i],"")
                let deviceName = name.substr(0,name.length-deviceId.length)
                switch (deviceName){
                    case "display":
                        return this.getDisplay(parseInt(deviceId,10))
                    case "processor":
                        return this.getProcessor(parseInt(deviceId,10))
                    case "cell":
                        return this.getMemCell(parseInt(deviceId,10))
                    case "bank":
                        return this.getMemBank(parseInt(deviceId,10))
                    case "switch":
                        return this.getSwitch(parseInt(deviceId,10))
                    default :
                        let device = this.getVirtualDevice(deviceName,deviceId)
                        if (device) return device
                        logger.log(`Trying to get unknown device "${deviceName}"`)
                        return false
                }
            }
        }
    }
    static getVirtualDevice(name,id){
        for (let i = 0; i < this.virtualDevices.length; i++) {
            if (this.virtualDevices[i].name == name && this.virtualDevices[i].id == id) {
                return device = core.virtualDevices[i]
            } 
        }
    }
    static runProcessor = (id) => {
        for (let i = 0; i < core.processors.length; i++) {
            if (core.processors[i].id == id) {
                core.processors[i].running = true
            }
        }
    }
    static stopProcessor = (id) => {
        for (let i = 0; i < core.processors.length; i++) {
            if (core.processors[i].id == id) {
                core.processors[i].running = false
            }
        }
    }
}
