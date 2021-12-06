class storage {
    constructor (id,type,size){
        this.id = id
        this.type = type
        this.size = size
        this.btn = this.createBtn()
        this.values = []
        core.devices.push(this)
    }
    updateDebug = () =>{
        editor.storageSelected == this.id && editor.storageType == this.type && (
            editor.displayStorageVariables()
        )
    }
    createBtn = () =>{
        const container = document.createElement("div")
        container.className = "device"
        const label = document.createElement("label")
        label.className = "device-name"
        label.innerText = "Memory "+this.type+this.id
        const img = document.createElement("img")
        img.src = this.type == "cell"?"resources/memory-cell.png":"resources/memory-bank.png"
        container.appendChild(label)
        container.appendChild(img)
        document.getElementById("devices").appendChild(container)
        container.addEventListener("click", (e) => {
           editor.selectAltDevice(this)
        })
        container.addEventListener("contextmenu",(e)=>{
           //To be improved!
           e.preventDefault()
           if (!confirm(`Are you sure you want to delete Memory ${this.type} ${this.id} ?`)){
               return
           }
           core.removeDevice(this.type,this.id)
        })
        return container
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
class cell extends storage {
    constructor(id){
        super(id,"cell",64)
    }
}
class bank extends storage {
    constructor(id){
        super(id,"bank",512)
    }
}