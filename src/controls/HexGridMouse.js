/* global THREE */
import {extend, isNone} from 'engineUtil';

export let utils = {
    addHandler(char, handler) {
        let map = this.charcodeHandlerMap[char];
        if(isNone(map)) {
            map = [];
        }
        
        map.push(handler);
        return this;
    },
    removeHandler(char, handler) {
        let map = this.charHandlerMap[char];
        if(isNone(map)) {
            map = [];
        }
        
        map.push(handler);
        return this;
    },
    destroy() {
        
    }
};

function tileSelector(event) {
    var width = this.domElement.offsetWidth;
    var height = this.domElement.offsetHeight;

    var mouse = new THREE.Vector2( ( event.clientX / width ) * 2 - 1,   //x
                                    -( event.clientY / height ) * 2 + 1 //y 
                                    );
    var raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.game.camera);
    var objects = Object.keys(this.game.map.cells).map(function(hash) {
        var cell = this.game.map.cells[hash];
        var mesh = cell.tile.mesh;
        mesh.material.color.b = 0;
        return mesh;
    }.bind(this));
    var intersects = raycaster.intersectObjects( objects, false);
    if(intersects[0]) {
        intersects[0].object.material.color.b = 1;
    }
}

export default function HexGridMouse(game) {
    if(isNone(game)) {
        throw new Error('HexGridMouse requires a game object');
    }
    
    let mouseHandler = function(e) {
        let map = this.handlerMap[e.type];
        if(!isNone(map) && map instanceof Array) {
            for(let i = 0; i < map.length; i++) {
                let handler = map[i];
                if(handler instanceof Function) {
                    try {
                        handler.call(this, e);
                    } catch(e) {
                        console.warn('Failed to run keydown handler', handler, e);
                    }
                }
            }
        } 
        
    };
    
    mouseHandler.game = game;
    mouseHandler.domElement = game.domElement;
    mouseHandler.handlerMap = {
        'mousedown': [tileSelector]
    };
    mouseHandler = extend(mouseHandler, utils);
    window.addEventListener('mousemove', mouseHandler.bind(mouseHandler));
    window.addEventListener('mousedown', mouseHandler.bind(mouseHandler));
    window.addEventListener('mouseup', mouseHandler.bind(mouseHandler));
    window.addEventListener('touchstart', mouseHandler.bind(mouseHandler));
    window.addEventListener('touchmove', mouseHandler.bind(mouseHandler));
    window.addEventListener('touchend', mouseHandler.bind(mouseHandler));
    
    return mouseHandler;
}