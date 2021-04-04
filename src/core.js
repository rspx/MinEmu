createProcessorBtn = (id) =>{
    container = document.createElement("div")
    container.className = "processor-container"
    label = document.createElement("label")
    label.className = "device-name"
    label.innerText = "processor"+id
    img = document.createElement("img")
    img.src = "resources/logic-processor.png"
    container.appendChild(label)
    container.appendChild(document.createElement("br"))
    container.appendChild(img)
    document.getElementById("processors-container").appendChild(container)
    container.addEventListener("click",(e)=>{
        editor.selectProcessor(id)
    })
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
        if (this.getDisplay(id)) {
            logger.warn("Trying to create display with taken id") 
            return
        }
        this.displays.push(new Display(size,id))
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
        createProcessorBtn(id)
        this.processors.push(new Processor(instructions.split("\n"),id,speed))
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
