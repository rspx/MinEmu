class Display{
    constructor(size,id){
        this.displaysize = size==80?80:176
        this.id = id
        this.btn = this.createCanvas()
        this.ctx = this.btn.children[1].getContext('2d')
        core.devices.push(this)
    }
    createCanvas = () =>{
      const container = document.createElement("div")
      container.className = "display"
      const label = document.createElement("label")
      label.className = "device-name"
      label.innerText = "Display"+this.id
      const canvas = document.createElement("canvas")
      canvas.width = this.displaysize
      canvas.height = this.displaysize
      if (!core.noBorder){
          canvas.classList.add("border")
      }
      container.appendChild(label)
      container.appendChild(canvas)
      document.getElementById("displays").appendChild(container)
      container.addEventListener("contextmenu",(e)=>{
          //To be improved!
          e.preventDefault()
          if (!confirm(`Are you sure you want to delete display ${this.id} ?`)){
              return
          }
          core.removeDevice("display",this.id)
      })
      return container
  }
    displayBuff = (buffer) =>{
      this.ctx.putImageData(new ImageData(buffer.buffer,buffer.size,buffer.size),0,0)
    }
    toString = () =>{
      return this.size==80?"logic-display":"large-logic-display"
    }
}