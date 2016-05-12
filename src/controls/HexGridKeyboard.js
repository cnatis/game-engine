/* global THREE */
import {extend, isNone} from 'engineUtil';
import Keyboard from './Keyboard';

function walkHandler(event) {
    function movePlayerInDirection(direction) {
        // let targetCell = this.map.getCellAt(this.player.position);
        // let neighbors = this.map.getNeighbors(targetCell);
        // let finalCell = neighbors[direction];
        // if(!isNone(finalCell)) {
        //     this.player.position.copy(this.map.cellToPixel(finalCell));
        //     this.player.position.y = 5;
        //     this.game.camera.position.set(0 + this.player.position.x, 150 + this.player.position.y, 150 + this.player.position.z);
        //     this.game.camera.lookAt(this.player.position);
        // }
    }
    
    switch (event.which) {
        case 81:
            // q
            movePlayerInDirection.call(this, 4);
            break;
        case 87:
            // w
            this.player.mesh.translateZ(-10);
            movePlayerInDirection.call(this, 5);
            break;
        case 69:
            // e
            movePlayerInDirection.call(this, 0);
            break;
        case 65:
            // a
            movePlayerInDirection.call(this, 3);
            this.player.mesh.translateX(-10);
            break;
        case 83:
            // s
            this.player.mesh.translateZ(10);
            movePlayerInDirection.call(this, 2);
            break;
        case 68:
            // d
            this.player.mesh.translateX(10);
            movePlayerInDirection.call(this, 1);
            break;
    }
    //this.game.camera.lookAt(this.player.position);
}

function cameraRotationHandler(event) {
    function rotateCameraInDirection(direction) {
        let rotateAngle = direction === 'left' ? 0.05 : -0.05;
        var rotation_matrix = new THREE.Matrix4().makeRotationY(rotateAngle);
        this.player.mesh.matrix.multiply(rotation_matrix);
        this.player.mesh.rotation.setFromRotationMatrix(this.player.mesh.matrix);
    }
    switch (event.which) {
        case 37:
            // left arrow
            rotateCameraInDirection.call(this, 'left');
            break;
        case 38:
            // up arrow
            //rotateCameraInDirection.call(this, 'y');
            break;
        case 39:
            // right arrow
            rotateCameraInDirection.call(this, 'right');
            break;
        case 40:
            // down arrow
            //rotateCameraInDirection.call(this, 3);
            break;
    }
}

export default function HexGridKeyboard(game) {
    if(isNone(game)) {
        throw new Error('HexGridKeyboard requires a game object');
    }
    
    let hexGridKeyboard = Keyboard(game);
    
    // Walking handlers
    hexGridKeyboard.addHandler(81, walkHandler);
    hexGridKeyboard.addHandler(87, walkHandler);
    hexGridKeyboard.addHandler(69, walkHandler);
    hexGridKeyboard.addHandler(65, walkHandler);
    hexGridKeyboard.addHandler(83, walkHandler);
    hexGridKeyboard.addHandler(68, walkHandler);
    // Camera handlers
    hexGridKeyboard.addHandler(37, cameraRotationHandler);
    hexGridKeyboard.addHandler(39, cameraRotationHandler);
    
    return hexGridKeyboard;
}