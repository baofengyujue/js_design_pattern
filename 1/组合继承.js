function SuperClass(name) {
    this.name = name;
    this.books = ['js','html','css'];
}
SuperClass.prototype.getName = function () {
    console.log(this.name);
};

function SubClass(name,time) {
    SuperClass.call(this,name);
    this.time = time;
}
SubClass.prototype = new SuperClass();
SubClass.prototype.getTime = function () {
    console.log(this.time);
};

//-----------------
var sub1 = new SubClass('js book',2016);
sub1.books.push('DesignPattern');
console.log(sub1.books);
sub1.getName();
sub1.getTime();
console.log('----------');
var sub2 = new SubClass('css book',2015);
console.log(sub2.books);
sub2.getName();
sub2.getTime();
