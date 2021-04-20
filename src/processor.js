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
        this.last_tick = performance.now()
        this.color = new Color(0,0,0,255)
        this.drawbuffer = core.createDrawBuffer(core.defualtDisplaySize)
        this.printBuffer = null
        this.breakpoints = []
        this.hitbreakpoint = false
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