/* global THREE */
// HexGrid object factory
import {extend, withDefault, isNone} from 'engineUtil';
import {SQRT3, TWO_THIRDS, PI, DEG_TO_RAD, TAU} from 'core/constants';
import {HexCell} from 'core/HexCell';
import {Tile} from 'core/Tile';

export let hexGridUtils = {
    // grid cell (Hex in cube coordinate space) to position in pixels/world
	cellToPixel: function(cell) {
		this._vec3.x = cell.q * cell.width() * 0.75;
		this._vec3.y = cell.h;
		this._vec3.z = -((cell.s - cell.r) * cell.height() * 0.5);
		return this._vec3;
	},

	pixelToCell: function(pos) {
		// convert a position in world space ("pixels") to cell coordinates
		var q = pos.x * (TWO_THIRDS / this.cellSize);
		var r = ((-pos.x / 3) + (SQRT3/3) * pos.z) / this.cellSize;
		this._cell.set(q, r, -q-r);
		return this._cubeRound(this._cell);
	},

	getCellAt: function(pos) {
		// get the hexCell (if any) at the passed world position
		var q = pos.x * (TWO_THIRDS / this.cellSize);
		var r = ((-pos.x / 3) + (SQRT3/3) * pos.z) / this.cellSize;
		this._cell.set(q, r, -q-r);
		this._cubeRound(this._cell);
		return this.cells[this._cell.hash()];
	},

	getNeighbors: function(cell, diagonal, filter) {
		// always returns an array
		var i, n, l = this._directions.length;
		this._list.length = 0;
		for (i = 0; i < l; i++) {
			this._cell.copy(cell);
			this._cell.add(this._directions[i]);
			n = this.cells[this._cell.hash()];
			if (!n || (filter && !filter(cell, n))) {
				this._list.push(null);
				continue;
			}
			this._list.push(n);
		}
		if (diagonal) {
			for (i = 0; i < l; i++) {
				this._cell.copy(cell);
				this._cell.add(this._diagonals[i]);
				n = this.hexCells[this.hexCellToHash(this._cel)];
				if (!n || (filter && !filter(cell, n))) {
					continue;
				}
				this._list.push(n);
			}
		}
		return this._list;
	},

	distance: function(hexCellA, hexCellB) {
		var d = Math.max(Math.abs(hexCellA.q - hexCellB.q), Math.abs(hexCellA.r - hexCellB.r), Math.abs(hexCellA.s - hexCellB.s));
		d += hexCellB.h - hexCellA.h; // include vertical height
		return d;
	},

	clearPath: function() {
		var i, c;
		for (i in this.hexCells) {
			c = this.hexCells[i];
			c._calcCost = 0;
			c._priority = 0;
			c._parent = null;
			c._visited = false;
		}
	},

	traverse: function(cb) {
		var i;
		for (i in this.hexCells) {
			cb(this.hexCells[i]);
		}
	},

	// create a flat, hexagon-shaped grid
	generate: function(params) {
		if(isNone(params)) {
			params = {};
		}
		this.size = withDefault(params.size, this.size);
		let x, y, z;
		for (x = -this.size; x < this.size + 1; x++) {
			for (y = -this.size; y < this.size + 1; y++) {
				z = -x-y;
				if (Math.abs(x) <= this.size && Math.abs(y) <= this.size && Math.abs(z) <= this.size) {
					// Create a hexCell for the position in the grid
					let c = HexCell({
						q: x, 
						r: y, 
						s: z,
						hashDelimeter: this.hashDelimeter,
						size: this.cellSize
					});
					let t = Tile({
						cell: c,
						material: params.material
					});
					this.add(c);
				}
			}
		}
	},

	add: function(cell) {
		var cellHash = cell.hash();
		if (this.cells[cellHash]) {
			console.warn('A cell already exists there');
			return;
		}
		this.cells[cellHash] = cell;

		return cell;
	},

	remove: function(cell) {
		var cellHash = cell.hash();
		var referencedCell = this.cells[cellHash];
		if (!isNone(referencedCell)) {
			referencedCell.destroy();
			delete this.cells[cellHash];
		}
	},

	destroy: function() {
		this.hexCells = null;
		this.numhexCells = 0;
		this.hexCellShape = null;
		this.hexCellGeo.dispose();
		this.hexCellGeo = null;
		this.hexCellShapeGeo.dispose();
		this.hexCellShapeGeo = null;
		this._list = null;
		this._vec3 = null;
		this._conversionVec = null;
		this._geoCache = null;
		this._matCache = null;
	},

	/*  ________________________________________________________________________
		Hexagon-specific conversion math
		Mostly commented out because they're inlined whenever possible to increase performance.
		They're still here for reference.
	 */

	_createVertex: function(i) {
		var angle = (TAU / 6) * i;
		return new THREE.Vector3((this.cellSize * Math.cos(angle)), (this.cellSize * Math.sin(angle)), 0);
	},

	/*_pixelToAxial: function(pos) {
		var q, r; // = x, y
		q = pos.x * ((2/3) / this.hexCellSize);
		r = ((-pos.x / 3) + (vg.SQRT3/3) * pos.y) / this.hexCellSize;
		this._cel.set(q, r, -q-r);
		return this._cubeRound(this._cel);
	},*/

	/*_axialToCube: function(h) {
		return {
			q: h.q,
			r: h.r,
			s: -h.q - h.r
		};
	},*/

	/*_cubeToAxial: function(hexCell) {
		return hexCell; // yep
	},*/

	/*_axialToPixel: function(hexCell) {
		var x, y; // = q, r
		x = hexCell.q * this._hexCellWidth * 0.75;
		y = (hexCell.s - hexCell.r) * this._hexCellLength * 0.5;
		return {x: x, y: -y};
	},*/

	/*_hexToPixel: function(h) {
		var x, y; // = q, r
		x = this.hexCellSize * 1.5 * h.x;
		y = this.hexCellSize * vg.SQRT3 * (h.y + (h.x * 0.5));
		return {x: x, y: y};
	},*/

	/*_axialRound: function(h) {
		return this._cubeRound(this.axialToCube(h));
	},*/

	_cubeRound: function(h) {
		var rx = Math.round(h.q);
		var ry = Math.round(h.r);
		var rz = Math.round(h.s);

		var xDiff = Math.abs(rx - h.q);
		var yDiff = Math.abs(ry - h.r);
		var zDiff = Math.abs(rz - h.s);

		if (xDiff > yDiff && xDiff > zDiff) {
			rx = -ry-rz;
		}
		else if (yDiff > zDiff) {
			ry = -rx-rz;
		}
		else {
			rz = -rx-ry;
		}

		return this._cell.set(rx, ry, rz);
	},

	/*_cubeDistance: function(a, b) {
		return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
	}*/
};

export function HexGrid(params) {
	if(isNone(params)) {
		params = {};
	}
    let hexGrid = {
    	cellSize: withDefault(params.cellSize, 10),
    	cells: {},
    	hashDelimeter: withDefault(params.hashDelimeter, '-')
    };
    
    // pre-computed permutations
	hexGrid._directions = [
		HexCell({
			q: +1, 
			r: -1, 
			s: 0,
			size: hexGrid.cellSize
		}), 
		HexCell({
			q: +1, 
			r: 0, 
			s: -1,
			size: hexGrid.cellSize
		}), 
		HexCell({
			q: 0, 
			r: +1, 
			s: -1,
			size: hexGrid.cellSize
		}),				
		HexCell({
			q: -1, 
			r: +1, 
			s: 0,
			size: hexGrid.cellSize
		}), 
		HexCell({
			q: -1, 
			r: 0, 
			s: +1,
			size: hexGrid.cellSize
		}),
		HexCell({
			q: 0, 
			r: -1, 
			s: +1,
			size: hexGrid.cellSize
		})
	];
	// this._diagonals = [HexCell(+2, -1, -1), HexCell(+1, +1, -2), HexCell(-1, +2, -1),
	// 				   HexCell(-2, +1, +1), HexCell(-1, -1, +2), HexCell(+1, -2, +1)];
    
	// cached objects
	hexGrid._list = [];
	hexGrid._vec3 = new THREE.Vector3();
	hexGrid._cell = HexCell({
		q: 0, 
		r: 0, 
		s: 0,
		hashDelimeter: hexGrid.hashDelimeter,
		size: hexGrid.cellSize
	});
	hexGrid._conversionVec = new THREE.Vector3();
	hexGrid._geoCache = [];
	hexGrid._matCache = [];
    
    return extend(hexGrid, hexGridUtils);
};

export default HexGrid;