import isNone from './isNone';

export function fromEnum(value, enumValues, iterator) {
    let result;
    let enumValuesIsArray = (enumValues instanceof Array);
    let enumValuesIsHashMap = (!enumValuesIsArray && typeof(enumValues) === 'object')
    // Validate enumValues
    if(isNone(enumValues) ||
        (!enumValuesIsArray && !enumValuesIsHashMap)) {
            
        throw new Error('enumValues must be an Array or Hash map (object)');
    }
    
    // Default iterator
    if(isNone(iterator) || iterator instanceof Function === false) {
        iterator = function(result, current) {
            if(isNone(result)) {
                if(current === value) {
                    return current;
                }
            }
            return result;
        };
    }
    if(!isNone(value)) {
        let enumArray = enumValues;
        if(enumValuesIsHashMap) {
            enumArray = Object.keys(enumValues);
        };
        
        result = enumArray.reduce(iterator, null);
    }
    return result;
};