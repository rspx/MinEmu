class editor{
    static mainDevice = false
    static altDevice = false
    static editmode = false
    static prevInstruction = false
    static onBeforDeviceRemoved = (device) =>{
        if (this.mainDevice.constructor.name == device.constructor.name && this.mainDevice.id == device.id){
            if (this.mainDevice.id == device.id){
                this.selectMainDevice(device)
            }
        }
        if (this.altDevice.constructor.name == "virtualDevice" && this.altDevice.name == device.name && this.altDevice.id == device.id){
            this.selectAltDevice(device)
            this.altDevice = false
            return
        }
        if (this.altDevice.constructor.name == device.constructor.name && this.altDevice.id == device.id){
            this.selectAltDevice(device)
            this.altDevice = false
        }
    }
    static selectMainDevice(device){
        if (!device){
            this.mainDevice = false
            return
        }
        if (this.mainDevice){
            this.unhighlightMainDevice()
        }
        if (this.mainDevice.id == device.id){
            this.unhighlightMainDevice()
            this.mainDevice = false
            this.displayCode()
            this.displayVariables()
            return
        }
        if (this.altDevice.constructor.name == "virtualDevice"){
            this.selectAltDevice(this.altDevice)
        }
        this.mainDevice = device
        this.highlightMainDevice()
        this.updateBtns()
        this.displayCode()
        this.displayCurInstruction(device.curInstrucion)
        this.displayVariables()
    }
    static selectAltDevice = (device) =>{
        if (device.constructor.name == "virtualDevice"){
            if (this.mainDevice){
                this.selectMainDevice(this.mainDevice)
                this.mainDevice = false
            }
            if (this.altDevice.id == device.id && this.altDevice.name == device.name){
                this.unhighlightAltDevice()
                document.getElementById("debug").innerHTML = ""
                document.getElementById("code").innerHTML = ""
                this.altDevice = false
                return
            }
            if (this.altDevice){
                this.selectAltDevice(this.altDevice)
                this.altDevice = false
            }
            this.altDevice = device
            this.highlightAltDevice()
            document.getElementById("debug").innerHTML = ""
            this.displayProperties()
        }else{
            document.getElementById("debug").innerHTML = ""
            if (this.altDevice){
                this.unhighlightAltDevice()
            }
            if (this.altDevice.constructor.name == "virtualDevice"){
                document.getElementById("code").innerHTML = ""
            }
            if (this.altDevice.id == device.id && device.constructor.name == this.altDevice.constructor.name || !device){
                this.altDevice = false
                if (this.mainDevice){
                    this.displayVariables()
                }
                return
            }
            this.altDevice = device
            this.highlightAltDevice()
            this.displayAltDevice()
        }
    }
    static highlightMainDevice = ()=>{
        this.mainDevice.btn.classList.add("selected")
    }
    static unhighlightMainDevice = (id)=>{
        document.getElementById("play-pause").src = "resources/play.svg"
        this.mainDevice.btn.classList.remove("selected")
    }
    static highlightAltDevice = () =>{
        this.altDevice.btn.classList.add("selected2")
    }
    static unhighlightAltDevice = () =>{
        this.altDevice.btn.classList.remove("selected2")
    }
    static updateBtns = () =>{
        if (this.mainDevice === false) return
        document.getElementById("play-pause").src = this.mainDevice.running?"resources/pause.svg":"resources/play.svg"
    }
    static toggleMainDevice = () =>{
        if (this.mainDevice == false) return
        if (this.mainDevice.onBreakPoint()){
            this.mainDevice.skipBreakPoint = true
        }
        let state = !this.mainDevice.running
        this.mainDevice.running = state
        this.updateBtns()
    }
    static toggleBreakPoint = (linenum) =>{
        return this.mainDevice.toggleBreakPoint(linenum)
    }
    static createLine = (index,text,brekapoint) =>{
        let container = document.createElement("div")
        container.className = "code-line"
        let linenumber = document.createElement("label")
        linenumber.className = "line-number"
        linenumber.innerText = index
        linenumber.addEventListener("click",()=>{
            linenumber.classList[this.toggleBreakPoint(index-1)?"add":"remove"]("breakpoint")
        })
        if (brekapoint){
            linenumber.classList.add("breakpoint")
        }
        let instruction = document.createElement("label")
        instruction.className = "instruction"
        instruction.innerText = text
        container.appendChild(linenumber)
        container.appendChild(instruction)
        document.getElementById("code").appendChild(container)
    }
    static displayCode = () =>{
        document.getElementById("code").innerHTML = ""
        if (!this.mainDevice) return
        for (let i = 0; i <  this.mainDevice.instructions.length; i++) {
            this.createLine(i+1,this.mainDevice.instructions[i],this.mainDevice.breakpoints[i])
        }
    }
    static stepInstruction = () =>{
        if (this.mainDevice.onBreakPoint()){
            this.mainDevice.skipBreakPoint = true
        }
        this.mainDevice.tick()
    }
    static createVariable = (name,value) =>{
        const variable = document.createElement("label")
        variable.className = "variable-text"
        variable.innerHTML = `${name}:${value}`
        document.getElementById("debug").appendChild(variable)
    }
    static displayVariables = () =>{
        if (this.altDevice) return
        document.getElementById("debug").innerHTML = ""
        if (!this.mainDevice) return
        let variables = this.mainDevice.variables
        let variables_name = Object.keys(variables)
        let variables_len = variables_name.length
        for (let i = 0; i < variables_len; i++) {
            this.createVariable(variables_name[i],variables[variables_name[i]])
        }
    }
    static displayAltDevice = () =>{
        document.getElementById("debug").innerHTML = ""
        this.altDevice.values.forEach((value,index)=>{
            this.createVariable(index,value)
        })
    }
    static toggleEditMode = () =>{
        if (this.curProcessor === false) return
        if (this.editmode) {
            let instructions = document.getElementById("code-input").value.split("\n")
            this.mainDevice.instructions = instructions.filter((val)=>{
                if (val == "") return false
                return true
            })
            this.mainDevice.curInstrucion = 0
            document.getElementById("code-input").remove()
            this.displayCode()
            this.editmode = false
            return
        }
        this.editmode = true
        document.getElementById("code").innerHTML = ""
        let input = document.createElement("textarea")
        input.className = "code-input"
        input.id = "code-input"
        this.mainDevice.instructions.forEach(instruction => {
            input.value += instruction+"\n"
        });
        input.addEventListener("keydown",(e)=>{
            if (e.key !== "Escape") return
            this.toggleEditMode()
        })
        document.getElementById("code").appendChild(input)
        document.querySelector("#code-input").focus()
    }
    static displayCurInstruction = (index) =>{
        const instructions = document.getElementById("code").children
        if (instructions.length == 0 || instructions.length <= index) return
        this.prevInstruction && (
            this.prevInstruction.classList.remove("highlighten")
        )
        instructions[index].classList.add("highlighten")
        this.prevInstruction = instructions[index]
    }
    static changePropertie = (name,value) =>{

    }
    static createPropertie = (name,value) =>{
        let container = document.createElement("div")
        container.className = "propertie-line"
        let propname = document.createElement("label")
        propname.className = "propertie-name"
        propname.innerText = name

        let textarea = document.createElement("textarea")
        textarea.className = "properie-textarea"
        textarea.innerText = value
        textarea.onkeydown = (e) => {
            if (e.keyCode == 13) { e.preventDefault(); }
        };
        textarea.oninput = (e) =>{
            let device = core.getDevice(this.virtualDeviceName,this.virtualDeviceSelected)
            if (!device.propertyExists(name)){
                return
            }
            let val = textarea.value
            for (let i = 0; i < device.properties.length; i++) {
                if (device.properties[i].name !== name) continue 
                if (val[val.length-1] == '"' && val[0] == '"'){
                    device.properties[i].value = val.slice(1).slice(0,-1)
                    return
                }
                device.properties[i].value = parseInt(val)
            }
        }
        container.appendChild(propname)
        container.appendChild(textarea)
        document.getElementById("code").appendChild(container)
    }
    static displayProperties = () =>{
        document.getElementById("code").innerHTML = ""
        if (!this.altDevice) return
        this.altDevice.properties.forEach(propertie => {
            this.createPropertie(propertie.name,propertie.value,false)
        });
    }
}