Game Engine Notes

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