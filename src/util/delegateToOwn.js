export function delegateToOwn(receiver, methods, propertyName) {
    methods.forEach(function (methodName) {
        receiver[methodName] = function () {
            var toProvider = receiver[propertyName];
            return toProvider[methodName].apply(receiver, arguments);
        };
    });
    
    return receiver;
};

export default delegateToOwn;