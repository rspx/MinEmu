class Switch extends device {
    constructor (id){
        super(id)
        this.btn = this.createBtn()
        this.toggle_sound = new Audio("resources/switch_toggle.ogg")
    }
    createBtn = () =>{
        const container = document.createElement("div")
        container.className = "device"
        const label = document.createElement("label")
        label.className = "device-name"
        label.innerText = "switch"+this.id
        const img = document.createElement("img")
        img.src = "resources/switch.png"
        img.className = "Switch"
        const img2 = document.createElement("img")
        img2.src = "resources/switch-on.png"
        img2.className = "switch-btn"
        container.appendChild(label)
        container.appendChild(img)
        container.appendChild(img2)
        document.getElementById("devices").appendChild(container)
        container.addEventListener("click", (e) => {
            this.toggle()
         })
         container.addEventListener("contextmenu",(e)=>{
            //To be improved!
            e.preventDefault()
            if (!confirm(`Are you sure you want to delete switch${this.id} ?`)){
                return
            }
            core.removeDevice("switch",this.id)
         })
        return container
    }
    onEnabled = () =>{
        this.btn.children[2].classList.remove("hidden")
    }
    onDisable = () =>{
        this.btn.children[2].classList.add("hidden")
    }
    toggle = () =>{
        let sound = this.toggle_sound.cloneNode(true)
        const enabled = this.getProperty("@enabled")
        this.setProperty("@enabled",enabled==1?0:1)
        sound.play();
        sound.remove();
    }
    toString = () =>{
        return "switch"
    }
}