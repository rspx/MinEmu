const createProcessorBtn = (id) =>{
    const container = document.createElement("div")
    container.className = "device"
    const label = document.createElement("label")
    label.className = "device-name"
    label.innerText = "Processor"+id
    const img = document.createElement("img")
    img.src = "resources/logic-processor.png"
    container.appendChild(label)
    container.appendChild(img)
    document.getElementById("devices").appendChild(container)
    container.addEventListener("click", (e) => {
        editor.selectProcessor(id)
    })
    container.addEventListener("contextmenu",(e)=>{
        //To be improved!
        e.preventDefault()
        if (!confirm(`Are you sure you want to delete processor ${id} ?`)){
            return
        }
        core.removeProcessor(id)
    })
    return container
}
const createStorageBtn = (type,id) =>{
    const container = document.createElement("div")
    container.className = "device"
    const label = document.createElement("label")
    label.className = "device-name"
    label.innerText = "Memory "+type+id
    const img = document.createElement("img")
    img.src = type == "Cell"?"resources/memory-cell.png":"resources/memory-bank.png"
    container.appendChild(label)
    container.appendChild(img)
    document.getElementById("devices").appendChild(container)
    container.addEventListener("click", (e) => {
       editor.selectStorage(id,type)
    })
    container.addEventListener("contextmenu",(e)=>{
       //To be improved!
       e.preventDefault()
       if (!confirm(`Are you sure you want to delete Memory ${type} ${id} ?`)){
           return
       }
       core["removeMem"+type](id)
    })
    return container
}
const createSwitchBtn = (id) =>{
    const container = document.createElement("div")
    container.className = "device"
    const label = document.createElement("label")
    label.className = "device-name"
    label.innerText = "switch"+id
    const img = document.createElement("img")
    img.src = "resources/switch.png"
    img.className = "Switch"
    const img2 = document.createElement("img")
    img2.src = "resources/switch-on.png"
    img2.className = "switch-btn"
    container.appendChild(label)
    container.appendChild(img)
    container.appendChild(img2)
    document.getElementById("devices").appendChild(container)
    container.addEventListener("click", (e) => {
        core.getSwitch(id).toggle()
     })
     container.addEventListener("contextmenu",(e)=>{
        //To be improved!
        e.preventDefault()
        if (!confirm(`Are you sure you want to delete switch${id} ?`)){
            return
        }
        core.removeSwitch(id)
     })
    return container
}
const createCanvas = (size,id) =>{
    const container = document.createElement("div")
    container.className = "display"
    const label = document.createElement("label")
    label.className = "device-name"
    label.innerText = "Display"+id
    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    if (!core.noBorder){
        canvas.classList.add("border")
    }
    container.appendChild(label)
    container.appendChild(canvas)
    document.getElementById("displays").appendChild(container)
    container.addEventListener("contextmenu",(e)=>{
        //To be improved!
        e.preventDefault()
        if (!confirm(`Are you sure you want to delete display ${id} ?`)){
            return
        }
        core.removeDisplay(id)
    })
    return container
}

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
        let displayElement = createCanvas(size,id)
        this.displays.push(new Display(size,id,displayElement))
        return this.getDisplay(id)
    }
    static createProcessor = (instructions,id, speed) =>{
        if (this.getProcessor(id)) {
            logger.warn("Trying to create processor with taken id updating speed instead") 
            this.getProcessor(id).setSpeed(speed)
            return this.getProcessor(id)
        }
        let btn = createProcessorBtn(id)
        this.processors.push(new Processor(instructions.split("\n"),id,btn,1000/speed))
        return this.getProcessor(id)
    }
    static createMemCell = (id) =>{
        if (this.getMemCell(id)) {
            logger.warn("Trying to create memcell with taken id") 
            return this.getMemCell(id)
        }
        let btn = createStorageBtn("Cell",id)
        this.memcells.push(new memcell(id,btn))
        return this.getMemCell(id)
    }
    static createMemBank = (id) =>{
        if (this.getMemBank(id)) {
            logger.warn("Trying to create membank with taken id") 
            return this.getMemBank(id)
        }
        let btn = createStorageBtn("Bank",id)
        this.membanks.push(new membank(id,btn))
        return this.getMemBank(id)
    }
    static createSwitch = (id) =>{
        if (this.getSwitch(id)) {
            logger.warn("Trying to create switch with taken id") 
            return this.getSwitch(id)
        }
        let btn = createSwitchBtn(id)
        this.switches.push(new Switch(id,btn))
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
                        logger.log("Trying to get unknown device")
                        return false
                }
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
