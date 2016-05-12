import {extend, withDefault} from 'engineUtil';
import {HexGrid} from 'core/HexGrid';

export let mapUtils = {
    
};

export function Map(params) {
    let map = {
        grid: HexGrid()
    };
    
    return extend(map, mapUtils);
}

export default Map;