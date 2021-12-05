const getLastCharacter = (text) =>{
    return text[text.length-1]
}
const parseArgument = (text,processor) =>{
    if (typeof(text) == "undefined") return null
    //Parse constants 
    if (Constants.parse(text,processor)) {
        return Constants.parse(text,processor)
    }
    //Parse properies
    if (text[0] == "@"){
        return text
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
    //Parse devices variable
    for (let i = 0; i < core.suportedDevices.length; i++) {
        if (text.includes(core.suportedDevices[i])){
            if (!core.getDevice(text)){
                return null
            }
            return core.getDevice(text)
        }
    }
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
        editor.curProcessor == processor.id && !editor.editmode && editor.displayVariables()
    }
    static drawflush = (args,processor) =>{
        let display = parseArgument(args[0],processor)
        if (!display){
            logger.warn(`Trying to send draw commands to non existant display ${args[0]} @ processors${processor.id} instruction ${processor.curInstrucion}`)
            return
        }
        processor.drawCommands.forEach(cmd=>{
            display.commands.push(cmd)
        })
        display.executeCommands()
        processor.drawCommands = []
    }
    static print = (args,processor) =>{
        let arg = ""
        args.forEach(arg_ => {
            arg += arg_+" "
        });
        arg = arg.substring(0,arg.length-1)
        processor.printBuffer += parseArgument(arg,processor)
    }
    static printflush = (args,processor) =>{
        parseArgument(args[0],processor).setProperty("@text",processor.printBuffer)
        processor.printBuffer = "";
    }
    static write = (args,processor) =>{
        //write input cell1 adress
        try{
            parseArgument(args[1],processor).write(parseArgument(args[2],processor),parseArgument(args[0],processor))
        }catch{
            logger.warn(`Trying to write to unexisting memcell or membank @ processors${processor.id} instruction ${processor.curInstrucion}`)
        }
    }
    static read = (args,processor) =>{
        //read output cell1 adress
        try{
            processor.variables[args[0]] = parseArgument(args[1],processor).read(parseArgument(args[2],processor))
        }catch{
            logger.warn(`Trying to read to unexisting memcell or membank @ processors${processor.id} instruction ${processor.curInstrucion}`)
        }
    }
    static sensor = (args,processor) =>{
        //sensor result target property
        try{
            processor.variables[args[0]] = parseArgument(args[1],processor).getProperty(parseArgument(args[2],processor))
        }catch(err){
            logger.warn(`Trying to get ${args[2]} of unexisting ${args[1]} @ processors${processor.id} instruction ${processor.curInstrucion}`)
            processor.variables[args[0]] = null
        }
        editor.curProcessor == processor.id && !editor.editmode && editor.displayVariables()
    }
    static control = (args,processor) => {
        //control enabled target value 0 0 0
        switch (args[0]){
            case "enabled":
                try{
                    parseArgument(args[1],processor).setProperty("@enabled",parseArgument(args[2],processor))
                }catch{
                    logger.warn(`Trying to set ${args[2]} of unexisting ${args[1]} @ processors${processor.id} instruction ${processor.curInstrucion}`)
                }
                break
            default:
                logger.warn(`Trying to set unknown property ${args[0]} of ${args[1]} @ processors${processor.id} instruction ${processor.curInstrucion}`)
        }
    } 
    static draw = (args,processor) => {
        let cmd = [args[0]]
        for (let i=1;i<args.length;i++){
            cmd.push(parseArgument(args[i],processor))
        }
        processor.drawCommands.push(cmd)
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
                logger.warn(`Unrecognized jump operator @ processors${processor.id} instruction ${processor.curInstrucion}`)
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
                logger.warn(`Unrecognized op operator "${args[0]}" @ processors${processor.id} instruction ${processor.curInstrucion}`)
                break
        }
        editor.curProcessor == processor.id && !editor.editmode && editor.displayVariables()
    }
}