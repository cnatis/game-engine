/* global THREE Goblin */
// Game object factory
import {withDefault, extend, isNone} from 'engineUtil';
import {DEG_TO_RAD} from 'core/constants';
import HexGrid from 'core/HexGrid';
import Player from 'core/Player';
import Keyboard from 'controls/Keyboard';
import Mouse from 'controls/Mouse';

export let gameUtils = {
	init(domElement) {
		// domElement is the element we will be attaching our game to
		if(this.initialized) {
			// We have already initialized, lets destroy our old context before we create a new one
			this.destroy();
		}
		
		this.parentElement = domElement;
		// Create the renderer and append its dom element to our parent
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(domElement.offsetHeight, domElement.offsetHeight);
		this.domElement = domElement;
		domElement.appendChild(this.renderer.domElement);
		// Create our scene
		this.scene = new THREE.Scene();
		// Create our camera
		this.camera = new THREE.PerspectiveCamera(
		    50,         // Field of view
		    domElement.offsetHeight / domElement.offsetHeight,  // Aspect ratio
		    1,        // Near
		    5000       // Far
		);
		this.camera.up.set( 0, 1, 0 );
		this.camera.position.set(0, 10, 10);
		
		// Create the physics world 
		this.world = new Goblin.World(new Goblin.BasicBroadphase(), new Goblin.NarrowPhase(), new Goblin.IterativeSolver());
		this.body_to_mesh_map = {};
		// Start adding our map tiles to the scene
		Object.keys(this.map.cells).forEach(function(hash) {
		    let cell = this.map.cells[hash];
		    let cellPosition = this.map.cellToPixel(cell);
		    // Add tile mesh to scene
		    this.scene.add(cell.tile.mesh);
		    // Set it to its pixel position
		    cell.tile.position.copy(cellPosition);
		    // Set y to 0
		    // Y = UP 
		    // TODO This will change when we start introducing height
		    cell.tile.position.y = 0;
		    // Add tile rigid body to world
		}.bind(this));
		
		// Add our player to the scene
		this.scene.add(this.player.mesh);
		// Add our player rigid body to world
		this.world.addRigidBody(this.player.rigidBody);
		this.body_to_mesh_map[this.player.rigidBody.id] = this.player.mesh;
		
		// Position our player on the center tile
		let targetCell = this.map.cells['0-0-0'];
		if(!isNone(targetCell)) {
			this.player.position.copy(this.map.cellToPixel(targetCell));
			// TODO Calculate our y value some how
			this.player.position.y = 5;
		}
		
		this.player.rigidBody.x = this.player.position.x;
	    this.player.rigidBody.y = this.player.position.y;
	    this.player.rigidBody.z = this.player.position.z;
		this.player.mesh.add(this.camera);
		
		// Initialize keyboard and mouse utils
		this.keyboard = Keyboard(this);
		this.mouse = Mouse(this);
		
		// Add event listeners for resize events 
		window.addEventListener('resize', this.resizeCanvas.bind(this));
		this._eventListeners['resize'] = [this.resizeCanvas];
		// Auto size the canvas
		this.resizeCanvas();
		
		this.initialized = true;
	},
	simulatePhysics(timeStep) {
		// run physics simulation
	    this.world.step(timeStep / 1000);
	
	    // update mesh positions / rotations
	    for ( var i = 0; i < this.world.rigid_bodies.length; i++ ) {
	        var body = this.world.rigid_bodies[i],
	            mesh = this.body_to_mesh_map[body.id];
			
			if(!isNone(mesh)) {
		        // update position
		        mesh.position.x = body.position.x;
		        mesh.position.y = body.position.y;
		        mesh.position.z = body.position.z;
			}
	        // update rotation
	        // mesh.quaternion._x = body.rotation.x;
	        // mesh.quaternion._y = body.rotation.y;
	        // mesh.quaternion._z = body.rotation.z;
	        // mesh.quaternion._w = body.rotation.w;
	    }
	    
	    this.camera.position.x = this.player.position.x;
	    this.camera.position.y = this.player.position.y + 10;
	    this.camera.position.z = this.player.position.z + 10;
	},
	render(step) {
		if(isNone(this.physicsInterval)) {
			let physicsStep = 1000 / 60;
			this.physicsInterval = setInterval(this.simulatePhysics.bind(this, physicsStep), physicsStep);
		}
		
		if(!isNone(this.renderer) && !isNone(this.scene) && !isNone(this.camera)) {
		    // render
		    this.camera.lookAt(this.player.position);
			this.renderer.render(this.scene, this.camera);
		}
		requestAnimationFrame(this.render.bind(this));
	},
	addRigidBody(body, mesh) {
		this.body_to_mesh_map[body.id] = mesh;
		this.world.addRigidBody(body);
	},
	resizeCanvas(width, height) {
		// Check if we have been passed numbers for width and height
		// If we have then just set the canvas size to those values
		// Otherwise this is a callback for a resize event so we will
		// get the width and height from our parent element
		if(typeof(width) !== 'number' || typeof(height) !== 'number') {
			// Event handler for resize event
			if(!isNone(this.parentElement)) {
				width = this.parentElement.offsetWidth;
				height = this.parentElement.offsetHeight;
				console.log(width, height);
			}
		}
		if(!isNone(width) && !isNone(height) && !isNone(this.renderer) && !isNone(this.camera)) {
			this.renderer.setSize(width, height);
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();	
		}
	},
	destroy() {
		// Clean up event listeners
		if(!isNone(this._eventListeners)) {
			for(let eventType in this._eventListeners) {
				let eventHandlers = this._eventListeners[eventType];
				if(!isNone(eventHandlers) && eventHandlers instanceof Array && eventHandlers.length > 0) {
					for(let i = 0; i < eventHandlers.length; i++) {
						window.removeEventListener(eventType, eventHandlers[i]);
					}
				}
			}
		}
		
		// Clean up physics interval
		if(!isNone(this.physicsInterval)) {
			clearInterval(this.physicsInterval);
		}
		
		this.initialized = false;
	}
};

export function Game(params) {
    if(isNone(params)) {
		params = {};
	}
        
    let game = {
    	map: withDefault(params.map, HexGrid({
    		cellSize: 1
    	})),
    	settings: withDefault(params.settings, {}),
    	player: withDefault(params.player, Player()),
    	_eventListeners: {}
    };
    
    game = extend(game, gameUtils);
    
    // Map generation
    if(params.generateMap) {
		game.map.generate({
		    size: 4
		});    	
    }
    
    // DOM setup
    if(params.domElement || params.domSelector) {
    	let el = params.domElement;
    	if(isNone(el)) {
    		el = document.querySelector(params.domSelector);
    	}
    	game.init(el);
    }
    
    return game;
};

export default Game;