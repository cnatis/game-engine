// Tile object factory
import {withDefault, extend} from 'engineUtil';
import Hexagon from 'core/Hexagon';
import Map from 'core/Map';

export function Tile(params) {
    let tileUtils = {
        inView(tile) {
            var hexsInLineToTarget = this.lineTo(tile);
            return hexsInLineToTarget
                .map(function(hex) {
                    // Map hexagons to tiles so we can access tile data
                    return this.map.getTile(hex.position);
                }.bind(this))
                .reduce(function(result, current) {
                    if(!result) {
                        return !current.blocksVisibility;
                    }
                    return result;
                }, false);
        },
        pathTo(targetTile) {
            let frontier = this.neighbors.map(function(neighbor) {
                var neighborTile = this.map.getTile(neighbor);
                return {
                    data: neighborTile,
                    priority: neighborTile.movementCost
                };
            }.bind(this));
            let visited = {};
            let cameFrom = {};
            let cost = {};
            visited[this.hash()] = null;
            cost[this.hash()] = 0;
            
            while(frontier.length > 0) {
                frontier = frontier.sort(function(a, b) {
                    return a.priority - b.priority;
                });
                // Pop off the current tile
                let current = frontier.pop().data;
                // Exit early if we found our target
                if(current.position.equals(targetTile.position)) {
                    break;
                }
                // Get the current tiles neighbors and add
                // them to the frontier if they haven't been visited
                current.neighbors
                    .map(function(neighbor) {
                        // Map neighbor hexagons to tiles so we can access tile data
                        return this.map.getTile(neighbor.position);
                    })
                    .forEach(function(neighbor) {
                        if(neighbor.passable) {
                            let newCost = cost[current.hash()] + neighbor.movementCost;
                            let neighborCost = cost[neighbor.hash()] || 0;
                            if(!visited[neighbor.hash()] || newCost < neighborCost) {
                                cost[neighbor.hash()] = newCost;
                                // Add current tile to came from so we can assemble a 
                                // path later
                                cameFrom[neighbor.hash()] = current;
                                frontier.push({
                                    data: neighbor,
                                    priority: newCost + neighbor.distanceTo(targetTile)
                                });
                            }
                        }
                    });
                // Add the current tile to visited
                visited[current.hash()] = current;
            }
            
            let path = [targetTile];
            let current = targetTile;
            let start = this.position;
            while(!current.position.equals(start)) {
               current = cameFrom[current.hash()];
               path.push(current);
            }
            path.reverse();
            return path;
        }
    };
    
    // Create our hexagon that we will be extending
    let hexagon = Hexagon(params);
    
    // Extend the hexagon and add any new properties
    let tile = extend(hexagon, {
        movementCost: withDefault(params.movementCost, 1),
        passable: withDefault(params.passable, true),
        blocksVisibility: withDefault(params.blocksVisibility, false),
        map: withDefault(params.map, Map())
    });
    
    return extend(tile, tileUtils);
};

export default Tile;