class Processor extends device {
    constructor(instructions,id, speed){
        super(id)
        this.variables = {}
        this.id = id
        this.running = false
        this.instructions = instructions
        this.speed = speed
        this.curInstrucion = 0
        this.last_tick = performance.now()
        this.color = new Color(0,0,0,255)
        this.drawbuffer = core.createDrawBuffer(core.defualtDisplaySize)
        this.printBuffer = null
        this.breakpoints = []
        this.hitbreakpoint = false
        this.btn = this.createBtn()
    }
    createBtn = () =>{
        const container = document.createElement("div")
        container.className = "device"
        const label = document.createElement("label")
        label.className = "device-name"
        label.innerText = "Processor"+this.id
        const img = document.createElement("img")
        img.src = "resources/logic-processor.png"
        container.appendChild(label)
        container.appendChild(img)
        document.getElementById("devices").appendChild(container)
        container.addEventListener("click", (e) => {
            editor.selectProcessor(this.id)
        })
        container.addEventListener("contextmenu",(e)=>{
            //To be improved!
            e.preventDefault()
            if (!confirm(`Are you sure you want to delete processor ${this.id} ?`)){
                return
            }
            core.removeProcessor(this.id)
        })
        return container
    }
    
    executeInstruction = (instruction,parameters) =>{
        if (instruction == ""){return}
        editor.curProcessor == this.id && !editor.editmode &&(
            editor.displayCurInstruction(this.curInstrucion)
        )
            
        
        if (!(instruction in InstructionHandler)) {
            logger.warn(`Unknown instruction:"${instruction}"`)
            return
        }
        InstructionHandler[instruction](parameters,this)
    }
    setSpeed = (speed) => {
        //Converting to tick per ms
        this.speed = 1000/speed
    }
    tick = () =>{
        if (typeof(this.instructions) == "undefined" || !this.getProperty("@enabled")) return false
        if (this.breakpoints[this.curInstrucion] && !this.skipBreakPoint) {
            this.running = false
            return
        }
        typeof(this.instructions[this.curInstrucion]) == "undefined" && (
            this.curInstrucion = 0
        )
        let instruction = this.instructions[this.curInstrucion].split(" ")
        this.executeInstruction(instruction.shift(),instruction)
        this.curInstrucion++
        this.skipBreakPoint = false
        return true
    }
    onBreakPoint = () =>{
        return (this.breakpoints[this.curInstrucion])
    }
    toggleBreakPoint = (linenum) =>{
        this.breakpoints[linenum] = !this.breakpoints[linenum]
        return this.breakpoints[linenum]
    }
    //TEMP stuff can't find cross icon from the game)
    onDisable = () => {
        this.btn.children[0].innerText += "(disabled)"
    }
    onEnabled = () => {
        this.btn.children[0].innerText = "processor"+this.id
    }
    toString = () =>{
        return "logic-processor"
    }
}