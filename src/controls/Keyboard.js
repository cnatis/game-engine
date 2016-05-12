import {extend, isNone} from 'engineUtil';

export let utils = {
    addHandler(char, handler) {
        let map = this.charHandlerMap[char];
        if(isNone(map)) {
            this.charHandlerMap[char] = map = [];
        }
        
        map.push(handler);
        return this;
    },
    removeHandler(char, handler) {
        let map = this.charHandlerMap[char];
        if(isNone(map)) {
            this.charHandlerMap[char] = map = [];
        } else {
            var handlerIndex = map.indexOf(handler);
            if(handlerIndex > -1) {
                map.splice(handlerIndex, 1);
            }
        }
        return this;
    },
    destroy() {
        
    }
};

export default function Keyboard(game) {
    if(isNone(game)) {
        throw new Error('Keyboard requires a game object');
    }
    
    let keydownHandler = function(e) {
        let map = this.charHandlerMap[e.which];
        if(!isNone(map) && map instanceof Array) {
            for(let i = 0; i < map.length; i++) {
                let handler = map[i];
                if(handler instanceof Function) {
                    try {
                        handler.call(this, e);
                    } catch(e) {
                        console.warn('Failed to run keyboard handler', handler, e);
                    }
                }
            }
        } 
        
    };
    
    // Add reference to game object
    keydownHandler.game = game;
    
    // Convenience references
    keydownHandler.map = game.map;
    keydownHandler.player = game.player;
    keydownHandler.camera = game.camera;
    
    // Hash map key = charcode, value = array of handlers
    keydownHandler.charHandlerMap = {};
    
    keydownHandler = extend(keydownHandler, utils);
    window.addEventListener('keydown', keydownHandler.bind(keydownHandler));
    
    return keydownHandler;
}