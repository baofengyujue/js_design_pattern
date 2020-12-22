// 浅复制
var extend = function (target, source) {
    for (var prop in source) {
        target[prop] = source[prop];
    }
    return target;
};

var book = {
    name: 'jsDesignPattern',
    peerBook: ['css', 'html', 'JS']
};
var anotherBook = {
    color: 'purple',
    name: 'angular'
};
extend(anotherBook, book);
console.log(anotherBook);

var mix = function () {
    var len = arguments.length,
        target = arguments[0],
        arg, i = 1;

    for (; i < len; i++) {
        arg = arguments[i];
        for (var prop in arg) {
            target[prop] = arg[prop];
        }
    }
    
    return target;
};
