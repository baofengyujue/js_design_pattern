function SuperClass(id) {
    this.id = id;
    this.books = ['js','html','css'];
}
SuperClass.prototype.showBooks = function () {
    console.log(this.books);
};
function SubClass(id, name) {
    SuperClass.call(this, id);
    this.name = name;
}

var p1 = new SubClass(10, 'yi');
var p2 = new SubClass(12, 'liqing');

console.log(p1.id);
p1.books.push('designPattern');
console.log(p1.books);
console.log(p2.id);
console.log(p2.books);
// console.log(p2.showBooks());