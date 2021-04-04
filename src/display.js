createCanvas = (size,id) =>{
    container = document.createElement("div")
    container.className = "display-container"
    label = document.createElement("label")
    label.className = "device-name"
    label.innerText = "display"+id
    canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size
    container.appendChild(label)
    container.appendChild(document.createElement("br"))
    container.appendChild(canvas)
    document.getElementById("devices-container").appendChild(container)
    return canvas.getContext("2d")
}
class Display{
    #ctx
    constructor(size,id){
        this.displaysize = size==80?80:176
        this.id = id
        this.#ctx = createCanvas(this.displaysize,id)
        window.ctx = this.#ctx
    }
    displayBuff = (buffer) =>{
      this.#ctx.putImageData(new ImageData(buffer.buffer,buffer.size,buffer.size),0,0)
    }
}