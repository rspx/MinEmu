class storage {
    constructor (id,btn,size){
        this.btn = btn
        this.id = id
        this.size = size
        this.values = []
    }
    write = (adress,value) =>{
        if (adress>this.size){
            return false
        }
        if (typeof(value) !== "number"){
            if (value){
                this.values[adress] = 1
                return true
            }
            this.values[adress] = 0
            return true
        }
        this.values[adress] = value
        return true
    }
    read = (adress) =>{
        if (this.values[adress]){
            return this.values[adress]
        }else{
            return null
        }
    }
    toString = () =>{
        return "memory-bank"
    }
}
class memcell extends storage {
    constructor(id,btn){
        super(id,btn,64)
    }
}
class membank extends storage {
    constructor(id,btn){
        super(id,btn,512)
    }
}