class Message extends device {
    constructor (id){
        super(id,[
            {
                "name":"text",
                "value":null,
                "readOnly":false
            }
        ])
        this.toggle_sound = new Audio("resources/switch_toggle.ogg")
        this.btn = this.createBtn()
    }
    createBtn = () =>{
        const container = document.createElement("div")
        container.className = "device"
        const label = document.createElement("label")
        label.className = "device-name"
        label.innerText = "Message"+this.id+"\n"+"NULL"
        const img = document.createElement("img")
        img.src = "resources/message.png"
        container.appendChild(label)
        container.appendChild(img)
        document.getElementById("devices").appendChild(container)
        container.addEventListener("contextmenu",(e)=>{
            //To be improved!
            e.preventDefault()
            if (!confirm(`Are you sure you want to delete message ${this.id} ?`)){
                return
            }
            core.removeDevice("message",this.id)
        })
        return container
    }
    toString = () =>{
        return "message"
    }
    onPropertieChanged = (name,value) =>{
        if (name == "text"){
            this.btn.children[0].innerText = "Message"+this.id+"\n"+value
        }
    }
}