<h1 align="center">
  <img  title="An Mindustry Logic Emulator" src="https://i.ibb.co/Jd2ggdC/PKSQzOr.jpg" width="750"> <br />
  An Mindustry Logic Emulator
</h1>
<h4 align="center">
  <a href="https://logic.mindustryschematics.com/">https://logic.mindustryschematics.com/</a>
</h4>

# Min emu
Min emu is open source [Mindustry](https://github.com/Anuken/Mindustry) logic emulator. At it's current state it can only be used for very simple programs without any inpus. 

### Features
- Support of display
- Support of memory bank and cells
- Support of switches
- Breakpoints
- Progress saving
- Built in editor
- Debug info
- Execution control

### FAQ
- Hover over "+" button to create new processors, displays, etc....
- Click on processors to open it in the editor
- Click on memory bank to open it in memory view
- Right click on any device to delete it
- Click on the line number to add a breakpoint

### Suported instructions
- `print` - full support
- `printflush` - full suport(printing to console)
- `draw` - only `color`, `rect`,`clear`
- `drawflush` - partial support (bugs may occur when using more than 1 processor on a display)
- `set` - full support
- `jump` - full support
- `end` - full support
- `op` - partial support
- `write` - full support
- `read` - full support
- `controll` - partial support(beta)
- `sensor` - partial support(beta)

### Showcase
![](https://i.ibb.co/2MDySpg/2021-04-07-22-35-10.gif)
![](https://i.ibb.co/WWrR52g/2021-04-07-22-32-06.gif)
