class virtualDevice extends device {
    constructor (id,properites,name,image){
        super(id,properites)
        this.name = name
        this.image = image
        this.btn = this.createBtn(name,image,id)
        for (let i = 0; i < core.suportedDevices.length; i++) {
            if (core.suportedDevices[i] == name){
                return
            }
        }
        core.suportedDevices.push(name)
    }
    createBtn = (name,image,id) =>{
        const container = document.createElement("div")
        container.className = "device"

        const label = document.createElement("label")
        label.className = "device-name"
        label.innerText = name+id
        const img = document.createElement("img")
        img.src = image
        container.appendChild(label)
        container.appendChild(img)
        
        document.getElementById("devices").appendChild(container)
        container.addEventListener("click", (e) => {
           editor.selectVirtualDevice(this.id,this.name)
        })
        container.addEventListener("contextmenu",(e)=>{
            //To be improved!
            e.preventDefault()
            if (!confirm(`Are you sure you want to delete ${name} ${id} ?`)){
                return
            }
            core.removeDevice(this.name,this.id)
        })
        return container
    }
    //TEMP stuff can't find cross icon from the game)
    onDisable = () => {
        this.btn.children[0].innerText += "(disabled)"
    }
    onEnabled = () => {
        this.btn.children[0].innerText = this.name+this.id
    }
    toString = () =>{
        return this.name
    }
}