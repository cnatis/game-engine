/* global THREE Goblin */
// Tile object factory
import {withDefault, extend, isNone} from 'engineUtil';
import Map from 'core/Map';
import {DEG_TO_RAD} from 'core/constants';

export let tileUtils = {
    select: function() {
		if (this.material.emissive) {
			this.material.emissive.setHex(this.highlight);
		}
		this.selected = true;
		return this;
	},

	deselect: function() {
		if (this._emissive !== null && this.material.emissive) {
			this.material.emissive.setHex(this._emissive);
		}
		this.selected = false;
		return this;
	},

	toggle: function() {
		if (this.selected) {
			this.deselect();
		}
		else {
			this.select();
		}
		return this;
	},

	dispose: function() {
		if (this.hexCell && this.hexCell.tile) this.hexCell.tile = null;
		this.hexCell = null;
		this.position = null;
		this.rotation = null;
		if (this.mesh.parent) this.mesh.parent.remove(this.mesh);
		this.mesh.userData.structure = null;
		this.mesh = null;
		this.material = null;
		this.userData = null;
		this.entity = null;
		this.geometry = null;
		this._emissive = null;
	}
};

export function Tile(params) {
    // Required parameters
    if(isNone(params.cell)) {
		throw new Error('Missing Tile configuration');
	}
        
    let tile = {
        cell: withDefault(params.cell, null),
        material: withDefault(params.material, null)
    };
    
    // Check if we have a hexCell; if we do, destroy the old
    // reference and replace with this tile
    if(!isNone(tile.cell) && !isNone(tile.cell.tile)) {
        // Destroy old tile reference
        tile.cell.destroy();
    }
    // Replace tile reference in the hexCell with this tile
    tile.cell.tile = tile;
    
    // Default material
    if(isNone(tile.material)) {
        tile.material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    }
    
    // Create mesh from geometry and material
    tile.mesh = new THREE.Mesh(tile.cell.geometry, tile.material);
    
    // Create RigidBody for physics calculations
    tile.planeShape = new Goblin.PlaneShape( 1, (tile.cell.width() / 2), (tile.cell.height() / 2) );

    // Reference the mesh position and rotation for ease of use
    tile.position = tile.mesh.position;
    tile.rotation = tile.mesh.rotation;
    
    // rotate the tile to face "up" (the threejs coordinate space is Y+)
	tile.rotation.x = -90 * DEG_TO_RAD;
	let scale = withDefault(params.scale, 1);
	tile.mesh.scale.set(scale, scale, 1);

	if (tile.material.emissive) {
		tile._emissive = tile.material.emissive.getHex();
	} else {
		tile._emissive = null;
	}
    
    return extend(tile, tileUtils);
};

export default Tile;