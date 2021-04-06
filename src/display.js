class Display{
    constructor(size,id,displayElement){
        this.displaysize = size==80?80:176
        this.id = id
        this.displayElement = displayElement
        this.ctx = displayElement.children[2].getContext('2d')
    }
    displayBuff = (buffer) =>{
      this.ctx.putImageData(new ImageData(buffer.buffer,buffer.size,buffer.size),0,0)
    }
}