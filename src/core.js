createProcessorBtn = (id) =>{
    container = document.createElement("div")
    container.className = "processor"
    label = document.createElement("label")
    label.className = "device-name"
    label.innerText = "processor"+id
    img = document.createElement("img")
    img.src = "resources/logic-processor.png"
    container.appendChild(label)
    container.appendChild(img)
    document.getElementById("processors").appendChild(container)
    container.addEventListener("click",(e)=>{
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
createCanvas = (size,id) =>{
    container = document.createElement("div")
    container.className = "display"
    label = document.createElement("label")
    label.className = "device-name"
    label.innerText = "display"+id
    canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    container.appendChild(label)
    container.appendChild(canvas)
    document.getElementById("devices").appendChild(container)
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
runFunction = () =>{
    core.processors.forEach(processor => {
        if (processor.running) processor.tick()
    });
    core.thread_id = setTimeout(runFunction,core.tick_speed)
}
class core {
    static defualtDisplaySize = 176
    static displays = []
    static processors = []
    static thread_id = setTimeout(runFunction,1)
    static suportedDevices = ["display"]
    static tick_speed = 4
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
    static createDisplay = (id,size) =>{
        size = size==80?size:core.defualtDisplaySize
        if (this.getDisplay(id)) {
            logger.warn("Trying to create display with taken id") 
            return
        }
        let displayElement = createCanvas(size,id)
        this.displays.push(new Display(size,id,displayElement))
    }
    static stopThread = () =>{
        clearTimeout(this.thread_id)
    }
    static startThread = () =>{
        this.thread_id = setTimeout(runFunction,1)
    }
    static createProcessor = (instructions,id, speed) =>{
        if (this.getProcessor(id)) {
            logger.warn("Trying to create processor with taken id updating instructions instead") 
            this.getProcessor(id).instructions = instructions.split("\n")
            return
        }
        let btn = createProcessorBtn(id)
        this.processors.push(new Processor(instructions.split("\n"),id,btn,speed))
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
    static removeDisplay = (id) =>{
        core.displays = core.displays.filter(display=>{
            if (display.id == id){
                display.displayElement.remove()
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
    static getDevice = (name) =>{
        for (let i = 0; i < this.suportedDevices.length; i++) {
            if (name.replace(this.suportedDevices[i],"") !== name){
                let deviceId = name.replace(this.suportedDevices[i],"")
                let deviceName = name.substr(0,name.length-deviceId.length)
                switch (deviceName){
                    case "display":
                        return this.getDisplay(parseInt(deviceId,10))
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
