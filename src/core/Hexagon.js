/* global THREE */
import {extend, withDefault, fromEnum, isNone} from 'engineUtil';
import HexCell from 'core/HexCell';

export let hexagonUtils = {};

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

export function corner(center, size, i, offsetAngle) {
    let angle_deg = 60 * i + (offsetAngle || 0);
    let angle_rad = Math.PI / 180 * angle_deg;
    return new THREE.Vector2(center.x + size * Math.cos(angle_rad),
                            center.y + size * Math.sin(angle_rad))
}

let hexShape, hexGeo, hexShapeGeo;

export function Hexagon(params) {
    if(isNone(params)) {
        params = {};
    }
    
    let hexagon = {
        size: withDefault(params.size, 1),
        hexType: withDefault(fromEnum(params.hexType, HEX_TYPES), HEX_TYPES.POINTY),
        hexCell: withDefault(params.hexCell, HexCell())
    };

    // Calculate center from position
    hexagon.center = hexagon.hexCell.center;
    
    // Calculate coordinates for the corners of the hexagon
    hexagon.corners = [];
    let offsetAngle = (hexagon.hexType === HEX_TYPES.FLAT ? 0 : 30);
    for(let i = 0; i < 6; i++) {
        hexagon.corners.push(corner(hexagon.center, hexagon.size, i, offsetAngle));
    }
    
    // Calculate neighbor matrix
    let x = hexagon.hexCell.q;
    let y = hexagon.hexCell.r;
    let z = hexagon.hexCell.s;
    hexagon.neighbors = [
        new THREE.Vector3(x + 1, y - 1,  z + 0), new THREE.Vector3(x + 1, y + 0, z - 1), new THREE.Vector3(x + 0, y + 1, z - 1),
        new THREE.Vector3(x - 1, y + 1, z + 0), new THREE.Vector3(x - 1, y + 0, z + 1), new THREE.Vector3(x + 0, y - 1, z + 1)
    ];
    
    // Create geometry if we dont have one cached
    if(isNone(hexShapeGeo)) {
        hexShape = new THREE.Shape();
    	hexShape.moveTo(hexagon.corners[0].x, hexagon.corners[0].y);
    	for (let i = 1; i < 6; i++) {
    		hexShape.lineTo(hexagon.corners[i].x, hexagon.corners[i].y);
    	}
    	hexShape.lineTo(hexagon.corners[0].x, hexagon.corners[0].y);
    
    	hexGeo = new THREE.Geometry();
    	hexGeo.vertices = hexagon.corners;
    	hexGeo.verticesNeedUpdate = true;
    
    	hexShapeGeo = new THREE.ShapeGeometry(hexShape); 
    }
    
    // Add reference to the geometry on the hexagon
    hexagon.geometry = hexShapeGeo;
    
    // Extend the hexagon metaobject with utility methods
    hexagon = extend(hexagon, hexagonUtils);
    if(hexagon.hexType === HEX_TYPES.FLAT) {
        hexagon = extend(hexagon, flatHexagonUtils);
    } else if(hexagon.hexType === HEX_TYPES.POINTY) {
        hexagon = extend(hexagon, pointyHexagonUtils);
    }
    
    return hexagon;
};

export default Hexagon;