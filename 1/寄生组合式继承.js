function inheritObject(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

function inheritPrototype(subClass, superClass) {
    // 寄生式继承
    var p = inheritObject(superClass.prototype);
    p.constructor = subClass;
    // 类式继承
    subClass.prototype = p;
    // p是父子类继承过程中的连接对象
}

function SuperClass(name) {
    this.name = name;
    this.colors = ['red','blue','green'];
}
SuperClass.prototype.getName = function () {
    console.log(this.name);
};
// 构造函数继承
function SubClass(name, time) {
    SuperClass.call(this, name);
    this.time = time;
}
inheritPrototype(SubClass,SuperClass);
SubClass.prototype.getTime = function () {
    console.log(this.time);
};

//-----------------
var sub1 = new SubClass('js book',2016);
var sub2 = new SubClass('css book',2015);

sub1.colors.push('black');
console.log(sub1.colors);
console.log(sub2.colors);
sub1.getName();
sub2.getTime();