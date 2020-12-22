var Factory = function (type, content) {
    if (this instanceof Factory) {
        return new this[type](content);
    } else {
        return new Factory(type, content);
    }
};
Factory.prototype = {
    Java:function (content) {
        this.content = content;
        console.log('java init');
    },
    UI:function (content) {
        this.content = content;
        console.log('ui init');
    }
};

//----------------
var java1 = Factory('Java','java content 1');
var java2 = new Factory('Java','java content 2');
console.log(java1.content);
console.log(java2.content);

var ui = new Factory('UI','ui content');
console.log(ui.content);



