class Constants {
    static parse = (name,processor) =>{
        name = name.replace("@","")
        if (name in this){
            return this[name](processor)
        }
        return null
    } 
    static ipt = (processor) =>{
        return Math.round(1000/processor.speed)/60
    }
    static counter = (processor) =>{
        return processor.curInstrucion
    }
    static time = () =>{
        return new Date().getTime()
    }
    static this = (processor) =>{
        return processor
    }
}