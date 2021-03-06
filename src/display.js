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
  setPixel = (x,y) =>{
    this.ctx.fillStyle = this.ctx.strokeStyle
    this.ctx.fillRect( x, y, 1, 1 );
    this.ctx.stroke()
  }
  plotLine = (x0, y0, x1, y1)=>
  {
     var dx =  Math.abs(x1-x0), sx = x0<x1 ? 1 : -1;
     var dy = -Math.abs(y1-y0), sy = y0<y1 ? 1 : -1;
     var err = dx+dy, e2;

     for (;;){
        this.setPixel(x0,y0);
        if (x0 == x1 && y0 == y1) break;
        e2 = 2*err;
        if (e2 >= dy) { err += dy; x0 += sx; }
        if (e2 <= dx) { err += dx; y0 += sy; }
     }
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
            this.ctx.strokeStyle = color.toRgba()
            this.ctx.fillStyle = color.toRgba()
            this.ctx.fillRect(0,0,this.displaysize,this.displaysize)
            this.ctx.closePath()
            break
          case "rect":
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.color.toRgba()
            this.ctx.fillStyle = this.color.toRgba()
            this.ctx.fillRect(command[1], command[2], command[3], command[4]);
            this.ctx.closePath();
            break
          case "line":
            this.ctx.beginPath()
            this.ctx.strokeStyle = this.color.toRgba()
            this.plotLine(command[1],command[2],command[3],command[4])
            // this.ctx.moveTo(command[1],command[2])
            // this.ctx.lineTo(command[3],command[4])
            this.ctx.stroke()
            this.ctx.closePath()
            break
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