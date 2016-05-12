/* global THREE */
import {isNone, extend} from 'engineUtil';

export let utils = {
    
};

export function Actor(params) {
    if(isNone(params)) {
        params = {};
    }
    
    let actor = {};
    
    return extend(actor, utils);
}

export default Actor;