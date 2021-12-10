class fs{
    static loaded = false
    static load = () =>{
        if (!localStorage.getItem("settings") || !localStorage.getItem("devices")) {
            this.save()
            this.loaded = true
            core.startThread()
            return
        }
        let settings = JSON.parse(localStorage.getItem("settings"))
        let devices = JSON.parse(localStorage.getItem("devices"))
        if (settings.bls){
            core.noBorder = true
        }
        devices.forEach(device => {
            switch (device.type){
                case "processor":
                    let p = new Processor("",device.id)
                    p.instructions = device.instructions
                    p.speed = device.speed?device.speed:1000/120
                    p.running = device.running
                    p.breakpoints = device.breakpoints?device.breakpoints:[]
                    if (device.id == settings.mainDevice){
                        editor.selectMainDevice(p)
                    }
                    break
                case "display":
                    new Display(device.size,device.id)
                    break
                case "bank":
                    new bank(device.id)
                    break
                case "cell":
                    new cell(device.id)
                    break
                case "switch":
                    new Switch(device.id)
                    break
                case "message":
                    new Message(device.id)
                    break
                case "virtual":
                    let d = new virtualDevice(device.id,[],device.name,device.image,)
                    d.properties = device.properties
                    break
                default:
                    console.warn("Trying to load unknown device ",device)
                    break
            }
            if (device.type == settings.altDeviceName && device.id == settings.altDevice){
                editor.selectAltDevice(core.getDevice(device.type,device.id))
            }
        });
        core.startThread()
        this.loaded = true
    }
    static save = () =>{
        if (!this.loaded){
            return
        }
        let settings = {
            "altDevice":editor.altDevice.id,
            "altDeviceName":editor.altDevice.constructor.name,
            "mainDevice":editor.mainDevice.id,
            "bls":core.noBorder
        }
        let devices = []
        core.devices.forEach(device=>{
            switch (device.constructor.name.toLowerCase()){
                case "processor":
                    devices.push({
                        "type":"processor",
                        "id":device.id,
                        "instructions":device.instructions,
                        "speed":device.speed,
                        "running":device.running,
                        "breakpoints":device.breakpoints?device.breakpoints:[]
                    })
                    break
                case "display":
                    devices.push({
                        "type":"display",
                        "id":device.id,
                        "size":device.displaysize,
                    })
                    break
                case "switch":
                    devices.push({
                        "type":"switch",
                        "id":device.id
                    })
                    break
                case "bank":
                    devices.push({
                        "type":"bank",
                        "id":device.id
                    })
                    break
                case "cell":
                    devices.push({
                        "type":"cell",
                        "id":device.id
                    })
                    break
                case "message":
                    devices.push({
                        "type":"message",
                        "id":device.id
                    })
                    break
                default:
                    devices.push({
                        "type":"virtual",
                        "name":device.name,
                        "image":device.image,
                        "id":device.id,
                        "properties":device.properties,
                    })
            }
        })
        localStorage.setItem("settings",JSON.stringify(settings))
        localStorage.setItem("devices",JSON.stringify(devices))
    }
}