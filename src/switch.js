class Switch extends device {
    constructor (id,btn){
        super(id)
        this.btn = btn
        this.toggle_sound = new Audio("resources/switch_toggle.ogg")
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