Game Engine Notes

This is a game engine I am working on for my personal use. The code is unlicensed and as such cannot be redistributed, modified, etc... without prior written approval from the author. The code in it's current state is quite messy and is more of a hacked together playground for me to try out various 3D libraries. In the future the code will be cleaned up and organized so that the game engine can actually be used. Feel free to browse the code and learn anything you can. I will likely be releasing the code under the MIT or other open source license once I have something ready.


Design notes and ramblings below

Map
Has a grid used to store data for the map.

Grid
Data structure and utilities for reading/writing to the grid that represents the map

Tile
Contains code for interaction and display of a map tile

Cell
A position in the grid that represents the map

Actor
Generic container for entities and other game objects. Should expose api to do basic movements/interactions