Game Engine Notes

This is a game engine I am working on for my personal use. The code is unlicensed and as such cannot be redistributed, modified, etc... without prior written approval from the author. The code in it's current state is quite messy and is more of a hacked together playground for me to try out various 3D libraries. In the future the code will be cleaned up and organized so that the game engine can actually be used. Feel free to browse the code and learn anything you can. I will likely be releasing the code under the MIT or other open source license once I have something ready.


Design notes and ramblings below

Map
The map has a hex grid that it will use for storing/retrieving cells.
Cells are a position in the hex grid and will have a reference to a Tile.
Tiles hold the information required to draw the graphic as well as any other
game information we may choose to store.

HexGrid should only have methods for generating a basic grid, as well as adding,
removing, retrieving cells.

Hexagon should have methods for hexagon specific calculations like size, corners,
etc...

Map will do game related calculations for movement etc... HexGrid should be as much
pure math as possible.