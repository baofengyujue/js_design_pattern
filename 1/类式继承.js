function SuperClass() {
    this.superValue = 'superValue';
    this.books = ['js','html','css'];
}
SuperClass.prototype.getSuperValue = function () {
    return this.superValue;
    // return this.subValue;
};

function SubClass() {
    this.subValue = 'subValue';
}
SubClass.prototype = new SuperClass();
// SubClass.prototype.__proto__ = SuperClass.prototype;
// Object.setPrototypeOf(SubClass.prototype, SuperClass.prototype);
SubClass.prototype.getSubValue = function () {
    return this.subValue;
};

//---------------------
var sub = new SubClass();
console.log(sub.getSubValue());
console.log(sub.getSuperValue());
console.log(sub instanceof SubClass);
console.log(sub instanceof SuperClass);
console.log('---------------');
var sub1 = new SubClass();
var sub2 = new SubClass();
console.log(sub2.books);
sub1.books.push('DesignPattern');
console.log(sub2.books);
console.log('---------------');
// a instanceof A 用于检测A.prototype是否存在于a的原型链上
// A.prototype===a.__proto__(/.__proto__.__proto__/...)
function C() {}
var o = {}, p = {}, q = {};
C.prototype = p;
o.__proto__ = q;
q.__proto__ = p;
console.log(o instanceof C);
