var StaticVars = (function () {
    var staticVars = {
        MAX_NUM: 100,
        MIN_NUM: 1,
        COUNT: 1000
    };
    return {
        get: function (name) {
            return staticVars[name] ? staticVars[name] : null;
        }
    };
})();

var c = StaticVars.get('COUNT');
console.log(c);