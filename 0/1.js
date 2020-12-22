

var CheckObject = function () {};
CheckObject.prototype.checkName = function () {
    console.log('checkName');
    return this;
};
CheckObject.prototype.checkEmail = function () {
    console.log('checkEmail');
    return this;
};
CheckObject.prototype.checkPassword = function () {
    console.log('checkPassword');
    return this;
};

var a = new CheckObject();

a.checkEmail().checkName();