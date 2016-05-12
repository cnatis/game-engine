import isNone from './isNone';

export function withDefault(optionalValue, defaultValue) {
    if(isNone(optionalValue)) {
        return defaultValue;
    } else {
        return optionalValue;
    }
};

export default withDefault;