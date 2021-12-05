<h1 align="center">
  <img  title="An Mindustry Logic Emulator" src="https://i.ibb.co/HpL19Jk/2021-12-03-22-57-52.gif" width="750"> <br />
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
- Processors can run at any speed, even faster than in game use `core.getProcessor(*id*).setSpeed(*speed*)`

### FAQ
- Hover over "+" button to create new processors, displays, etc....
- Click on processors to open it in the editor
- Click on memory bank to open it in memory view
- Right click on any device to delete it
- Click on the line number to add a breakpoint
- Create processor with the same id as existing to set the speed without console

### Suported instructions
- `print` - full support
- `printflush` - full suport
- `draw` - only `color`, `rect`,`clear`,`line`
- `drawflush` - partial support
- `set` - full support
- `jump` - full support
- `end` - full support
- `op` - partial support
- `write` - full support
- `read` - full support
- `controll` - partial support
- `sensor` - partial support

### Showcase
![](https://i.ibb.co/bsW2LKR/2021-12-03-23-13-49.gif)
![](https://i.ibb.co/HT5QKp0/2021-12-03-23-11-29.gif)
