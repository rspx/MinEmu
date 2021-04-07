const getLastCharacter = (text) =>{
    return text[text.length-1]
}
const parseArgument = (text,processor) =>{
    if (typeof(text) == "undefined")return null
    //Parse devices variable
    for (let i = 0; i < core.suportedDevices.length; i++) {
        if (text.includes(core.suportedDevices[i])){
            return core.getDevice(text)
        }
    }
    //Check if argument contains any characters
    if (parseFloat(text) == parseFloat(text).toString()){
        return parseFloat(text)
    }
    //Check if argument formated as a string
    if (text[text.length-1] == '"' && text[0] == '"'){
        return text.substring(1,text.length-1)
    }
    //Check for hex value
    if (text[0] == "0" && text[1] == "x"){
        let a = parseInt(text,16)
        if (text.toLowerCase() == "0x"+a.toString(16).toLowerCase()){
            return parseInt(text,16)
        }
    }
    //Check for boolean values
    if (text == "true") return 1
    if (text == "false") return 0
    
    if (typeof(processor.variables[text]) == "undefined"){
        return null
    }
    return processor.variables[text]
}
class InstructionHandler{
    static end = (args,processor) =>{
        processor.curInstrucion = -1
    }
    static set = (args,processor) =>{
        processor.variables[args[0]] = parseArgument(args[1],processor)
    }
    static drawflush = (args,processor) =>{
        if (!parseArgument(args[0],processor)){
            logger.warn("Trying to send draw buffer to non existant display")
            logger.warn(parseArgument(args[0],processor))
            logger.warn(args[0])
            return
        }
        //logger.log(`Flushing ${args[0]} at instruction ${processor.curInstrucion}`)
        parseArgument(args[0],processor).displayBuff(processor.drawbuffer)
        //processor.drawbuffer = core.createDrawBuffer(core.defualtDisplaySize)
    }
    static print = (args,processor) =>{
        processor.printBuffer = parseArgument(args[0],processor)
    }
    static printflush = (args,processor) =>{
        console.log(`${args[0]}:${processor.printBuffer}`)
        processor.printBuffer = null
    }
    static draw = (args,processor) => {
        switch(args[0]){
            case "color":
                processor.color = new Color(parseArgument(args[1],processor),parseArgument(args[2],processor),parseArgument(args[3],processor),parseArgument(args[4],processor))
                break
            case "rect":
                let x_start = parseArgument(args[1],processor)
                let x_end = x_start +parseArgument(args[3],processor)
                let y_start = parseArgument(args[2],processor)
                let y_end = parseArgument(args[2],processor)+ parseArgument(args[4],processor)
                for (let x = x_start; x < x_end; x++) {
                    for (let y = y_start; y <y_end; y++) {
                        try{
                            var pos = (y * processor.drawbuffer.size + x) * 4; // position in buffer based on x and y
                            processor.drawbuffer.buffer[pos  ] = processor.color.r           // some R value [0, 255]
                            processor.drawbuffer.buffer[pos+1] = processor.color.g;           // some G value
                            processor.drawbuffer.buffer[pos+2] = processor.color.b;           // some B value
                            processor.drawbuffer.buffer[pos+3] = processor.color.a;  
                        }catch (err){
                            logger.warn("Trying to draw outside of buffer"+err)
                        }
                    }
                }
                break
            case "line":
                //draw line xstart ystart xend yend 0 0
                break
            case "clear":
                processor.drawbuffer = core.createDrawBuffer(core.defualtDisplaySize,new Color(parseArgument(args[1],processor),parseArgument(args[2],processor),parseArgument(args[3],processor),parseArgument(args[4],processor)))
                break
            default:
                logger.warn(`Unknow parameter for draw ${args[0]}`)
                break
        }
    }
    static jump = (args,processor) =>{
        if (parseInt(args[0]) == -1) return
        switch (args[1]){
            case "equal":
                if (parseArgument(args[2],processor) == parseArgument(args[3],processor)){
                    processor.curInstrucion = parseInt(args[0])-1
                }
                break
            case "notEqual":
                if (parseArgument(args[2],processor) != parseArgument(args[3],processor)){
                    processor.curInstrucion = parseInt(args[0])-1
                }
                break
            case "lessThan":
                if (parseArgument(args[2],processor) < parseArgument(args[3],processor)){
                    processor.curInstrucion = parseInt(args[0])-1
                }
                break
            case "lessThanEq":
                if (parseArgument(args[2],processor) <= parseArgument(args[3],processor)){
                    processor.curInstrucion = parseInt(args[0])-1
                }
                break
            case "greaterThan":
                if (parseArgument(args[2],processor) > parseArgument(args[3],processor)){
                    processor.curInstrucion = parseInt(args[0])-1
                }
                break
            case "greaterThanEq":
                //jump 14 greaterThanEq y1 0
                if (parseArgument(args[2],processor) >= parseArgument(args[3],processor)){
                    processor.curInstrucion = parseInt(args[0])-1
                }
                break
            case "strictEqual":
                if (parseArgument(args[3],processor) === parseArgument(args[4],processor)){
                    processor.curInstrucion = parseInt(args[0])-1
                }
                break
            case "always":
                processor.curInstrucion = parseInt(args[0])-1
                break
            default:
                logger.warn("Unrecognized jump operator")
        }
    }
    static op = (args,processor) =>{
        switch (args[0]){
            case "add":
                //op add result virst_var second_var
                processor.variables[args[1]] = parseArgument(args[2],processor) + parseArgument(args[3],processor)
                break
            case "sub":
                //op sub result firstval secondval
                processor.variables[args[1]] = parseArgument(args[2],processor) - parseArgument(args[3],processor)
                break
            case "mul":
                //op mul result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) * parseArgument(args[3],processor)
                break
            case "div":
                //op div result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) / parseArgument(args[3],processor)
                break
            case "idiv":
                //op idiv result a b
                processor.variables[args[1]] = parseInt(parseArgument(args[2],processor) / parseArgument(args[3],processor))
                break
            case "mod":
                //op mod result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) % parseArgument(args[3],processor)
                break
            case "pow":
                //op pow result a b
                processor.variables[args[1]] = Math.pow(parseArgument(args[2],processor),parseArgument(args[3],processor))
                break
            case "equal":
                //op equal result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) == parseArgument(args[3],processor)?1:0
                break
            case "notEqual":
                //op notEqual result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) != parseArgument(args[3],processor)?1:0
                break
            case "land":
                //op land result a b
                processor.variables[args[1]] = ((parseArgument(args[2],processor) > 0) &&(parseArgument(args[3],processor) > 0))?1:0
                break
            case "lessThan":
                //op lessThan result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) < parseArgument(args[3],processor)?1:0
                break
            case "lessThanEq":
                //op lessThanEq result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) <= parseArgument(args[3],processor)?1:0
                break
            case "graterThan":
                //op greaterThan result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) > parseArgument(args[3],processor)?1:0
                break
            case "graterThanEq":
                //op greaterThanEq result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) >= parseArgument(args[3],processor)?1:0
                break
            case "strictEqual":
                //op strictEqual result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) === parseArgument(args[3],processor)?1:0
                break
            case "shl":
                //op shl result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) << parseArgument(args[3],processor)
                break
            case "shr":
                //op shr result a b
                processor.variables[args[1]] = parseArgument(args[2],processor) >> parseArgument(args[3],processor)
                break
            case "or":
                //op or result a b
                processor.variables[args[1]] = ((parseArgument(args[2],processor) > 0) || (parseArgument(args[3],processor) > 0))?1:0
                break
            case "and":
                //op and result a b
                processor.variables[args[1]] = ((parseArgument(args[2],processor) > 0) & (parseArgument(args[3],processor) > 0))?1:0
                break
            case "xor":
                //op xor result a b
                processor.variables[args[1]] = (parseArgument(args[2],processor) ^ parseArgument(args[3],processor))
                break
            case "not":
                //op not result a 
                processor.variables[args[1]] = ~parseArgument(args[2],processor)
                break
            case "max":
                //op max result a b
                processor.variables[args[1]] = Math.min(parseArgument(args[2],processor),parseArgument(args[3],processor))
                break
            case "min":
                //op min result a b
                processor.variables[args[1]] = Math.max(parseArgument(args[2],processor),parseArgument(args[3],processor))    
            case "rand":
                //op rand result max b
                processor.variables[args[1]] = getRandInt(0,parseArgument(args[2],processor))
                break
            default:
                logger.warn(`Unrecognized op operator "${args[0]}"`)
                break
        }
    }
}