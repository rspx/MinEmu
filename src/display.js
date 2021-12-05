class Display{
    constructor(size,id){
        this.displaysize = size==80?80:176
        this.id = id
        this.btn = this.createCanvas()
        this.ctx = this.btn.children[1].getContext('2d')
        this.color = new Color(255,255,255,255)
        this.commands = []
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
  executeCommands = () =>{
    for (let i=0;i<this.commands.length;i++){
      let command = this.commands[i]
      switch(command[0]){
        case "color":
          this.color = new Color(command[1],command[2],command[3],command[4])
          break
        case "clear":
          let color = new Color(command[1],command[2],command[3],command[4])
          this.ctx.beginPath()
          this.ctx.strokeStyle = color.toRgb()
          this.ctx.fillStyle = color.toRgb()
          this.ctx.fillRect(0,0,this.displaysize,this.displaysize)
          this.ctx.closePath()
        case "rect":
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.color.toRgb()
          this.ctx.fillStyle = this.color.toRgb()
          this.ctx.fillRect(command[1], command[2], command[3], command[4]);
          this.ctx.closePath();
          break
        case "line":
          this.ctx.beginPath()
          this.ctx.strokeStyle = this.color.toRgb()
          this.ctx.moveTo(command[1],command[2])
          this.ctx.lineTo(command[3],command[4])
          this.ctx.stroke()
          this.ctx.closePath()
        default:
          logger.warn("Unknown command "+ command[0])
      }
    }
    this.commands = []
  }
  displayBuff = (buffer) =>{
    this.ctx.putImageData(new ImageData(buffer.buffer,buffer.size,buffer.size),0,0)
  }
  toString = () =>{
    return this.size==80?"logic-display":"large-logic-display"
  }
}