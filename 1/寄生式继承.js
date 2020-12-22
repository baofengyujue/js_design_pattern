function inheritObject(o) {
    function F() {}
    F.prototype = o;
    return new F();
}
// 相当于带props的Object.create
function createBook(obj) {
    var o = inheritObject(obj);
    o.getName = function () {
        console.log(this.name);
    };
    return o;
}

//------------------
var book = {
    name: 'js book',
    peerBook: ['css book','html book']
};
var b1 = createBook(book);
b1.name = 'node book';
var b2 = createBook(book);

b1.getName();
b2.getName();
b1.peerBook.push('c/c++ book');
console.log(b2.peerBook);