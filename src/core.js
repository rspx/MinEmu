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
    const processos_len = processors.length
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
    static processors = []
    static devices = []
    static threadRunning = false
    static suportedDevices = ["display","processor","cell","bank","switch","message"]
    static stopThread = () =>{
        this.threadRunning = false
    }
    static startThread = () =>{
        setZeroTimeout(runFunction)
        this.threadRunning = true
    }
    static getDevice = (name,id) =>{
        if (typeof(id) != "number"){
            for (let i = 0; i < this.suportedDevices.length; i++) {
                if (name.replace(this.suportedDevices[i],"") !== name){
                    id = name.replace(this.suportedDevices[i],"")
                    name = name.substr(0,name.length-id.length)
                }
            }
        }
        let output = null;
        this.devices.some(device => {
            if (device.constructor.name.toLowerCase() == "virtualDevice" || device.name == name && device.id == id){
                output = device;
                return true;
            }
            if (device.constructor.name.toLowerCase() == name && device.id == id){
                output = device;
                return true;
            }
        });
        return output
    }
    static #removeProcessor = (id) =>{
        this.processors = this.processors.filter(proc=>{
            if (proc.id == id){
                return false
            }
            return true
        })
    }
    static removeDevice = (name,id) => {
        this.devices = this.devices.filter(device=>{
            if (device.constructor.name.toLowerCase() == "virtualDevice" || device.name == name && device.id == id){
                editor.onBeforDeviceRemoved(device)
                device.btn.remove()
                return false
            }
            if (device.constructor.name.toLowerCase() == name && device.id == id){
                if(device.constructor.name.toLowerCase() == "processor"){
                    this.#removeProcessor(device.id)
                }
                editor.onBeforDeviceRemoved(device)
                device.btn.remove()
                return false
            }
            return true
        })
    }
}
