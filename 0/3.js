Function.prototype.addMethod = function (name, fn) {
    this.prototype[name] = fn;
    return this;
};

var Methods = function () {
    this.say = 'this is Methods object';
};

Methods.addMethod('checkName',function () {
    console.log('checkName');
    return this;
}).addMethod('checkEmail',function () {
    console.log('checkEmail');
    return this;
});

var m = new Methods();
console.log(m.checkName().checkEmail().say);