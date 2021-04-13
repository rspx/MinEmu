class fs{
    static loaded = false
    static load = () =>{
        if (!localStorage.getItem("settings") || !localStorage.getItem("devices")) {
            this.save()
            this.loaded = true
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
                    core.createProcessor("",device.id)
                    core.getProcessor(device.id).instructions = device.instructions
                    core.getProcessor(device.id).speed = device.speed
                    core.getProcessor(device.id).running = device.running
                    core.getProcessor(device.id).breakpoints = device.breakpoints?device.breakpoints:[]
                    break
                case "display":
                    core.createDisplay(device.id,device.size)
                    break
                case "bank":
                    core.createMemBank(device.id)
                    break
                case "cell":
                    core.createMemCell(device.id)
                    break
                case "switch":
                    core.createSwitch(device.id)
                    break
                default:
                    console.warn("Trying to load unknown device ",device)
                    break
            }
        });
        editor.selectStorage(settings.storcoageSelected,settings.storageType) 
        editor.selectProcessor(settings.curProcessor)
        core.tick_speed = settings.tick_speed
        this.loaded = true
    }
    static save = () =>{
        if (!this.loaded){
            return
        }
        let settings = {
            "tick_speed":core.tick_speed,
            "storageSelected":editor.storageSelected,
            "storageType":editor.storageType,
            "curProcessor":editor.curProcessor,
            "bls":core.noBorder
        }
        let devices = []
        core.processors.forEach(processor=>{
            devices.push({
                "type":"processor",
                "id":processor.id,
                "instructions":processor.instructions,
                "speed":processor.speed,
                "running":processor.running,
                "breakpoints":processor.breakpoints?processor.breakpoints:[]
            })
        })
        core.displays.forEach(display=>{
            devices.push({
                "type":"display",
                "id":display.id,
                "size":display.displaysize,
            })
        })
        core.membanks.forEach(bank=>{
            devices.push({
                "type":"bank",
                "id":bank.id
            })
        })
        core.memcells.forEach(cell=>{
            devices.push({
                "type":"cell",
                "id":cell.id
            })
        })
        core.switches.forEach(Switch=>{
            devices.push({
                "type":"switch",
                "id":Switch.id
            })
        })
        localStorage.setItem("settings",JSON.stringify(settings))
        localStorage.setItem("devices",JSON.stringify(devices))
    }
}