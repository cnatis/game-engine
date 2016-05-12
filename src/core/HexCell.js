/* global THREE */
// HexCell object factory
import {extend, isNone, fromEnum, withDefault} from 'engineUtil';
import {TAU} from 'core/constants';

export let hexCellUtils = {
    set(q, r, s) {
		this.q = q;
		this.r = r;
		this.s = s;
		return this;
	},

	copy(hexCell) {
		this.q = withDefault(hexCell.q, 0);
		this.r = withDefault(hexCell.r, 0);
		this.s = withDefault(hexCell.s, 0);
		this.h = withDefault(hexCell.h, 1);
		this.tile = withDefault(hexCell.tile, null);
		return this;
	},

	add(hexCell) {
		this.q += hexCell.q;
		this.r += hexCell.r;
		this.s += hexCell.s;
		return this;
	},

	equals(hexCell) {
		return this.q === hexCell.q && this.r === hexCell.r && this.s === hexCell.s;
	},
	
	hash() {
		return `${this.q}${this.hashDelimeter}${this.r}${this.hashDelimeter}${this.s}`;
	},
	
	destroy() {
		
	}
};

export let pointyHexagonUtils = {
    width: function() {
        return (Math.sqrt(3) / 2) * this.height();
    },
    height: function() {
        return this.size * 2;
    }
};

export let flatHexagonUtils = {
    height: function() {
        return (Math.sqrt(3) / 2) * this.width();
    },
    width: function() {
        return this.size * 2;
    }
};

export const HEX_TYPES = {
    POINTY: 'POINTY',
    FLAT: 'FLAT'
};

export function corner(i, size) {
    var angle = (TAU / 6) * i;
	return new THREE.Vector3((size * Math.cos(angle)), (size * Math.sin(angle)), 0);
    // let angle_deg = 60 * i + (offsetAngle || 0);
    // let angle_rad = Math.PI / 180 * angle_deg;
    // return new THREE.Vector2(center.x + size * Math.cos(angle_rad),
    //                         center.y + size * Math.sin(angle_rad))
}

let hexShape, hexGeo, hexShapeGeo, geo;

export function HexCell(params) {
	if(isNone(params)) {
        params = {};
    }
    
    let hexCell = {
        q: withDefault(params.q, 0),
        r: withDefault(params.r, 0),
        s: withDefault(params.s, 0),
        h: withDefault(params.h, 1),
        hashDelimeter: withDefault(params.hashDelimeter, '-'),
        tile: withDefault(params.tile, null),
        size: withDefault(params.size, 1),
        hexType: withDefault(fromEnum(params.hexType, HEX_TYPES), HEX_TYPES.FLAT),
    };
    
    // Calculate coordinates for the corners of the hexagon
    hexCell.corners = [];
    let offsetAngle = (hexCell.hexType === HEX_TYPES.FLAT ? 0 : 30);
    for(let i = 0; i < 6; i++) {
        hexCell.corners.push(corner(i, hexCell.size));
    }
    
    // Calculate neighbor matrix
    let x = hexCell.q;
    let y = hexCell.r;
    let z = hexCell.s;
    hexCell.neighbors = [
        new THREE.Vector3(x + 1, y - 1,  z + 0), new THREE.Vector3(x + 1, y + 0, z - 1), new THREE.Vector3(x + 0, y + 1, z - 1),
        new THREE.Vector3(x - 1, y + 1, z + 0), new THREE.Vector3(x - 1, y + 0, z + 1), new THREE.Vector3(x + 0, y - 1, z + 1)
    ];
    
    // Create geometry if we dont have one cached
    if(isNone(hexShapeGeo)) {
        hexShape = new THREE.Shape();
    	hexShape.moveTo(hexCell.corners[0].x, hexCell.corners[0].y);
    	for (let i = 1; i < 6; i++) {
    		hexShape.lineTo(hexCell.corners[i].x, hexCell.corners[i].y);
    	}
    	hexShape.lineTo(hexCell.corners[0].x, hexCell.corners[0].y);
    
    	hexGeo = new THREE.Geometry();
    	hexGeo.vertices = hexCell.corners;
    	hexGeo.verticesNeedUpdate = true;
    
    	hexShapeGeo = new THREE.ShapeGeometry(hexShape); 
    }
    
    
    
    // Add reference to the geometry on the hexagon
    hexCell.geometry = hexShapeGeo;
    
    // Extend hexCell metaobject with utils object
    hexCell = extend(hexCell, hexCellUtils);
    if(hexCell.hexType === HEX_TYPES.FLAT) {
        hexCell = extend(hexCell, flatHexagonUtils);
    } else if(hexCell.hexType === HEX_TYPES.POINTY) {
        hexCell = extend(hexCell, pointyHexagonUtils);
    }
	
	return hexCell;
};

export default HexCell;