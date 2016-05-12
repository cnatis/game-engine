import {extend, isNone} from 'engineUtil';

export let utils = {
    addHandler(eventType, handler) {
        let map = this.handlerMap[eventType];
        if(isNone(map)) {
            this.handlerMap[eventType] = map = [];
        }
        
        map.push(handler);
        return this;
    },
    removeHandler(eventType, handler) {
        let map = this.handlerMap[eventType];
        if(isNone(map)) {
            this.handlerMap[eventType] = map = [];
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

export default function Mouse(game) {
    if(isNone(game)) {
        throw new Error('Mouse requires a game object');
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
                        console.warn('Failed to run mouse handler', handler, e);
                    }
                }
            }
        }
    };
    
    // Add reference to game object
    mouseHandler.game = game;
    
    // Convenience references
    mouseHandler.map = game.map;
    mouseHandler.player = game.player;
    mouseHandler.camera = game.camera;
    
    mouseHandler.handlerMap = {};
    mouseHandler = extend(mouseHandler, utils);
    
    window.addEventListener('mousemove', mouseHandler.bind(mouseHandler));
    window.addEventListener('mousedown', mouseHandler.bind(mouseHandler));
    window.addEventListener('mouseup', mouseHandler.bind(mouseHandler));
    window.addEventListener('touchstart', mouseHandler.bind(mouseHandler));
    window.addEventListener('touchmove', mouseHandler.bind(mouseHandler));
    window.addEventListener('touchend', mouseHandler.bind(mouseHandler));
    
    return mouseHandler;
}