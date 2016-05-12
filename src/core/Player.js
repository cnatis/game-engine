/* global THREE Goblin */
import {isNone, extend, withDefault} from 'engineUtil';

export let utils = {
    
};

export function Player(params) {
    if(isNone(params)) {
        params = {};
    }
    
    let player = {
        geometry: withDefault(params.geometry, new THREE.BoxGeometry(1, 1, 1)),
        material: withDefault(params.material, new THREE.MeshBasicMaterial({color: 0xFF0000}))
    };

    player.mesh = new THREE.Mesh(player.geometry, player.material);
    
    var box_shape = new Goblin.BoxShape( 1, 1, 1), // dimensions are half width, half height, and half depth, or a box 1x1x1
        mass = 5,
        dynamic_box = new Goblin.RigidBody( box_shape, mass );
        
    player.rigidBody = dynamic_box;
    
    // Reference the mesh position and rotation for ease of use
    player.position = player.mesh.position;
    player.rotation = player.mesh.rotation;
    
    return extend(player, utils);
}

export default Player;