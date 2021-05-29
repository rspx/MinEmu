class editor{
    static curProcessor = false
    static storageSelected = false
    static storageType = false
    static virtualDeviceSelected = false
    static virtualDeviceName = false
    static editmode = false
    static prevInstruction = document.body
    static selectProcessor = (id) =>{
        if (this.curProcessor){
            this.unhighlightProcessor(this.curProcessor)
        }
        if (this.virtualDeviceSelected){
            this.virtualDeviceSelected = false
            this.virtualDeviceName = false
        }
        if (id == this.curProcessor || !id){
            this.curProcessor = false
            document.getElementById("code").innerHTML = ""
            document.getElementById("debug").innerHTML = ""
            return
        }
        this.curProcessor = id
        this.highlightProcessor(id)
        this.updateBtns()
        this.displayCode()
        this.displayCurInstruction(core.getProcessor(this.curProcessor).curInstrucion)
        this.displayVariables()
    }
    static selectStorage = (id,type) =>{
        document.getElementById("debug").innerHTML = ""
        if (this.storageSelected !== false){
            core["getMem"+this.storageType](this.storageSelected).btn.classList.remove("selected2")
        }
        if (id == this.storageSelected && type == this.storageType || !id){
            this.storageType = false
            this.storageSelected = false
            if (this.curProcessor){
                this.displayVariables()
            }
            return
        }
        core["getMem"+type](id).btn.classList.add("selected2")
        this.storageSelected = id
        this.storageType = type
        this.displayStorageVariables()
    }
    static selectVirtualDevice = (id,name) =>{
        if (this.storageSelected){
            this.storageSelected = false
            this.storageType = false
        }
        if (this.curProcessor){
            this.curProcessor = false
        }
        this.virtualDeviceSelected = id
        this.virtualDeviceName = name
        document.getElementById("debug").innerHTML = ""
        this.displayProperties()
    }
    static highlightProcessor = (id)=>{
        core.getProcessor(id).btn.classList.add("selected")
    }
    static unhighlightProcessor = (id)=>{
        core.getProcessor(id).btn.classList.remove("selected")
    }
    static updateBtns = () =>{
        if (this.curProcessor === false) return
        document.getElementById("play-pause").src = core.getProcessor(this.curProcessor).running?"resources/pause.svg":"resources/play.svg"
    }
    static toggleProcessor = () =>{
        if (this.curProcessor === false) return
        if (core.getProcessor(this.curProcessor).onBreakPoint()){
            core.getProcessor(this.curProcessor).skipBreakPoint = true
        }
        let state = !core.getProcessor(this.curProcessor).running
        core.getProcessor(this.curProcessor).running = state
        this.updateBtns()
    }
    static toggleBreakPoint = (linenum) =>{
        return core.getProcessor(this.curProcessor).toggleBreakPoint(linenum)
    }
    static createLine = (index,text,brekapoint) =>{
        let container = document.createElement("div")
        container.className = "code-line"
        let linenumber = document.createElement("label")
        linenumber.className = "line-number"
        linenumber.innerText = index
        linenumber.addEventListener("click",()=>{
            linenumber.classList[this.toggleBreakPoint(index)?"add":"remove"]("breakpoint")
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
        for (let i = 0; i <  core.getProcessor(this.curProcessor).instructions.length; i++) {
            this.createLine(i,core.getProcessor(this.curProcessor).instructions[i],core.getProcessor(this.curProcessor).breakpoints[i])
        }
    }
    static stepInstruction = () =>{
        if (core.getProcessor(this.curProcessor).onBreakPoint()){
            core.getProcessor(this.curProcessor).skipBreakPoint = true
        }
        core.getProcessor(this.curProcessor).tick()
    }
    static createVariable = (name,value) =>{
        const variable = document.createElement("label")
        variable.className = "variable-text"
        variable.innerHTML = `${name}:${value}`
        document.getElementById("debug").appendChild(variable)
    }
    static displayVariables = () =>{
        if (this.storageSelected || this.editmode){
            return
        }

        let variables = core.getProcessor(this.curProcessor).variables
        let variables_name = Object.keys(variables)
        let variables_len = variables_name.length
        document.getElementById("debug").innerHTML = ""
        for (let i = 0; i < variables_len; i++) {
            this.createVariable(variables_name[i],variables[variables_name[i]])
        }
    }
    static displayStorageVariables = () =>{
        document.getElementById("debug").innerHTML = ""
        core["getMem"+this.storageType](this.storageSelected).values.forEach((value,index)=>{
            this.createVariable(index,value)
        })
    }
    static toggleEditMode = () =>{
        if (this.curProcessor === false) return
        if (this.editmode) {
            let instructions = document.getElementById("code-input").value.split("\n")
            core.getProcessor(this.curProcessor).instructions = instructions.filter((val)=>{
                if (val == "") return false
                return true
            })
            core.getProcessor(this.curProcessor).curInstrucion = 0
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
        core.getProcessor(this.curProcessor).instructions.forEach(instruction => {
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
            let device = core.getVirtualDevice(this.virtualDeviceName,this.virtualDeviceSelected)
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
        let device = core.getVirtualDevice(this.virtualDeviceName,this.virtualDeviceSelected)
        if (!device) return
        device.properties.forEach(propertie => {
            this.createPropertie(propertie.name,propertie.value,false)
        });
    }
}