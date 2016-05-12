import {extend, withDefault, fromEnum, isNone} from 'engineUtil';
import CubePoint from 'core/CubePoint';
import Point from 'core/Point';

export let hexagonUtils = {
    distanceTo(hex) {
        let a = this.position;
        let b = hex.position;
        return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
    },
    lineTo(hex) {
        let N = this.distanceTo(hex);
        let results = [];
        let step = 1.0 / Math.max(N, 1);
        for(let i = 0; i <= N; i++) {
            results.push(hexRound(hexLerp(this, hex, step * i)));
        }
        return results;
    },
    hexsInRange(range) {
        let results = [];
        let center = this.position;
        // Positive offsets
        for(let dx = 1; dx <= range; dx++) {
            for(let dy = 1; dy <= range; dy++) {
                let dz = -dx- dy;
                results.push(center.addCubePoint(CubePoint(dx, dy, dz)));
            }
        }
        // Negative offsets
        for(let dx = -1; dx >= -range; dx--) {
            for(let dy = -1; dy >= -range; dy--) {
                let dz = -dx- dy;
                results.push(center.addCubePoint(CubePoint(dx, dy, dz)));
            }
        }
        return results;
    },
    inRange(hex, range) {
        let hexsInRange = this.hexsInRange(range);
        return hexsInRange.reduce(function(result, current) {
            if(!result) {
                return current.equals(hex.position);
            }
            return result;
        }, false);
    },
    hash() {
        return this.position.hash();
    },
    toPixelPosition() {
        let x = this.position.x * this.width() * 0.75;
		let y = 1;
		let z = -((this.position.z - this.position.y) * this.length() * 0.5);
		return CubePoint(x, y, z);
    },
    length() {
        return (Math.sqrt(3) * 0.5) * this.width();
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

export function corner(center, size, i, offsetAngle) {
    let angle_deg = 60 * i + (offsetAngle || 0);
    let angle_rad = Math.PI / 180 * angle_deg;
    return Point(center.x + size * Math.cos(angle_rad),
                 center.y + size * Math.sin(angle_rad))
}

export function hexLerp(hexA, hexB, t) {
    let a = hexA.position;
    let b = hexB.position;
    return CubePoint(a.x + (b.x - a.x) * t,
                     a.y + (b.y - a.y) * t,
                     a.z + (b.z - a.z) * t);
}

export function hexRound(hex) {
    let x = Math.round(hex.x);
    let y = Math.round(hex.y);
    let z = Math.round(hex.z);
    let x_diff = Math.abs(x - hex.x);
    let y_diff = Math.abs(y - hex.y);
    let z_diff = Math.abs(z - hex.z);
    if (x_diff > y_diff && x_diff > z_diff) {
        x = -y - z;
    } else if (y_diff > z_diff) {
        y = -x - z;
    } else {
        z = -x - y;
    }
    return CubePoint(x, y, z);
}

export function Hexagon(params) {
    if(isNone(params)) {
        params = {};
    }
    
    let hexagon = {
        size: withDefault(params.size, 1),
        hexType: withDefault(fromEnum(params.hexType, HEX_TYPES), HEX_TYPES.POINTY),
        position: withDefault(params.position, CubePoint())
    };
    
    // Calculate center from position
    hexagon.center = hexagon.position.convertToPoint();
    
    // Calculate coordinates for the corners of the hexagon
    hexagon.corners = [];
    let offsetAngle = (hexagon.hexType === HEX_TYPES.FLAT ? 0 : 30);
    for(let i = 0; i < 6; i++) {
        hexagon.corners.push(corner(hexagon.center, hexagon.size, i, offsetAngle));
    }
    
    // Calculate neighbor matrix
    var x = hexagon.position.x;
    var y = hexagon.position.y;
    var z = hexagon.position.z;
    hexagon.neighbors = [
        CubePoint(x + 1, y - 1,  z + 0), CubePoint(x + 1, y + 0, z - 1), CubePoint(x + 0, y + 1, z - 1),
        CubePoint(x - 1, y + 1, z + 0), CubePoint(x - 1, y + 0, z + 1), CubePoint(x + 0, y - 1, z + 1)
    ];
    
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