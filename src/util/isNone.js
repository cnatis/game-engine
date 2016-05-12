export function isNone(value) {
    return (typeof(value) === 'undefined' || value === null);
};

export default isNone;