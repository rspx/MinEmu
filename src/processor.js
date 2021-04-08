class Processor extends device {
    constructor(instructions,id,btn, speed){
        super(id)
        this.variables = {}
        this.id = id
        this.running = false
        this.instructions = instructions
        this.speed = speed
        this.curInstrucion = 0
        this.btn = btn
        this.color = new Color(0,0,0,255)
        this.drawbuffer = core.createDrawBuffer(core.defualtDisplaySize)
        this.printBuffer = null
    }
    executeInstruction = (instruction,parameters) =>{
        if (instruction == ""){return}
        if (editor.curProcessor == this.id) {
            editor.displayCurInstruction(this.curInstrucion)
            editor.displayVariables()
        }
        if (!(instruction in InstructionHandler)) {
            logger.warn(`Unknown instruction:"${instruction}"`)
            return
        }
        InstructionHandler[instruction](parameters,this)
    }
    tick = () =>{
        if (typeof(this.instructions) == "undefined") return false
        if (!this.getProperty("@enabled")) return false
        if (typeof(this.instructions[this.curInstrucion]) == "undefined") this.curInstrucion = 0
        let instruction = this.instructions[this.curInstrucion].split(" ")
        this.executeInstruction(instruction.shift(),instruction)
        this.curInstrucion++
        return true
    }
    //TEMP stuff can't find cross icon from the game)
    onDisable = () => {
        this.btn.children[0].innerText += "(disabled)"
    }
    onEnabled = () => {
        this.btn.children[0].innerText = "processor"+this.id
    }
}