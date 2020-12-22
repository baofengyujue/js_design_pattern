Function.prototype.addMethod = function (name, fn) {
    this[name] = fn;
    return this;
};

var methods = function () {
    console.log('this is methods');
};

methods.addMethod('checkName',function () {
    console.log('checkName');
    return this;
}).addMethod('checkEmail',function () {
    console.log('checkEmail');
    return this;
});

methods.checkName().checkEmail();