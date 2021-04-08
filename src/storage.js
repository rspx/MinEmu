class storage {
    constructor (id,btn,type,size){
        this.btn = btn
        this.id = id
        this.type = type
        this.size = size
        this.values = []
    }
    updateDebug = () =>{
        if (editor.storageSelected == this.id && editor.storageType == this.type){
            editor.displayStorageVariables()
        }
    }
    write = (adress,value) =>{
        if (adress>this.size){
            return false
        }
        if (typeof(value) !== "number"){
            if (value){
                this.values[adress] = 1
                this.updateDebug()
                return true
            }
            this.values[adress] = 0
            this.updateDebug()
            return true
        }
        this.values[adress] = value
        this.updateDebug()
        return true
    }
    read = (adress) =>{
        if (this.values[adress]){
            return this.values[adress]
        }else{
            return 0
        }
    }
    toString = () =>{
        return "memory-bank"
    }
}
class memcell extends storage {
    constructor(id,btn){
        super(id,btn,"Cell",64)
    }
}
class membank extends storage {
    constructor(id,btn){
        super(id,btn,"Bank",512)
    }
}