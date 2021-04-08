class Switch extends device {
    constructor (id,btn){
        super(id)
        this.btn = btn
    }
    onEnabled = () =>{
        this.btn.children[2].classList.remove("hidden")
    }
    onDisable = () =>{
        this.btn.children[2].classList.add("hidden")
    }
    toggle = () =>{
        const enabled = this.getProperty("@enabled")
        this.setProperty("@enabled",enabled==1?0:1)
    }
    toString = () =>{
        return "switch"
    }
}