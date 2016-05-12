/*global THREE Goblin gameEngine*/
require('file?name=goblinphysics.js!../node_modules/goblinphysics/build/goblin.min.js');
require('file?name=gameEngine.js!../../build/gameEngine.browser.js');

var grassTexture = require('file!./images/grass-texture-2.jpg');
gameEngine = gameEngine.default;


// GAME CODE START

var game = gameEngine.core.Game({
    domSelector: '#game-container'
});
window.game = game;



var textureLoader = new THREE.TextureLoader();

textureLoader.load(grassTexture, function(texture) {
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 0.08, 0.08 );
    var material = new THREE.MeshBasicMaterial({
        map: texture,
        //overdraw: 0.5
    });
    
    game.map.generate({
        material: material,
        size: 20
    });

    game.player.position.y = 10;
    
    var floorShape = new Goblin.CompoundShape();
    
	Object.keys(game.map.cells).forEach(function(hash) {
	    let cell = game.map.cells[hash];
	    let cellPosition = game.map.cellToPixel(cell);
	    // Add tile mesh to scene
	    game.scene.add(cell.tile.mesh);
	    // Set it to its pixel position
	    cell.tile.position.copy(cellPosition);
	    // Set y to 0
	    // Y = UP 
	    // TODO This will change when we start introducing height
	    cell.tile.position.y = 0;
	    // Add tile to floor shape
	    //floorShape.addChildShape(cell.tile.planeShape, cell.tile.position, cell.tile.rotation);
	    cell.tile.rigidBody = new Goblin.RigidBody(cell.tile.planeShape, Infinity);
	    cell.tile.rigidBody.position = cell.tile.position;
	    game.world.addRigidBody(cell.tile.rigidBody);
	});
	
	// Add floor rigid body to world
	//game.world.addRigidBody(new Goblin.RigidBody(floorShape, Infinity));
    
     // Walking handlers
    game.keyboard.addHandler(81, walkHandler);
    game.keyboard.addHandler(87, walkHandler);
    game.keyboard.addHandler(69, walkHandler);
    game.keyboard.addHandler(65, walkHandler);
    game.keyboard.addHandler(83, walkHandler);
    game.keyboard.addHandler(68, walkHandler);
    // Camera handlers
    // game.keyboard.addHandler(37, cameraRotationHandler);
    // game.keyboard.addHandler(39, cameraRotationHandler);
    
    game.camera.lookAt(game.player.position);
    game.render();
});


function walkHandler(event) {
    switch (event.which) {
        case 81:
            // q
            break;
        case 87:
            // w
            this.player.mesh.translateZ(-1);
            break;
        case 69:
            // e
            break;
        case 65:
            // a
            this.player.mesh.translateX(-1);
            break;
        case 83:
            // s
            this.player.mesh.translateZ(1);
            break;
        case 68:
            // d
            this.player.mesh.translateX(1);
            break;
    }
    
    this.player.rigidBody.position = this.player.mesh.position;
    // this.player.rigidBody.position.y = this.player.mesh.position.y;
    // this.player.rigidBody.position.z = this.player.mesh.position.z;
    //this.game.camera.lookAt(this.player.position);
}

// function cameraRotationHandler(event) {
//     function rotateCameraInDirection(direction) {
//         let rotateAngle = direction === 'left' ? 0.05 : -0.05;
//         var rotation_matrix = new THREE.Matrix4().makeRotationY(rotateAngle);
//         this.player.mesh.matrix.multiply(rotation_matrix);
//         this.player.mesh.rotation.setFromRotationMatrix(this.player.mesh.matrix);
//     }
//     switch (event.which) {
//         case 37:
//             // left arrow
//             rotateCameraInDirection.call(this, 'left');
//             break;
//         case 38:
//             // up arrow
//             //rotateCameraInDirection.call(this, 'y');
//             break;
//         case 39:
//             // right arrow
//             rotateCameraInDirection.call(this, 'right');
//             break;
//         case 40:
//             // down arrow
//             //rotateCameraInDirection.call(this, 3);
//             break;
//     }
// }