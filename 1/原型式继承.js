function inheritObject(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

//-------------------
var book = {
    name:'js book',
    peerBook:['css book','html book']
};
// var b1 = inheritObject(book);
var b1 = Object.create(book);
b1.name = 'ajax book';
b1.peerBook.push('svg book');

// var b2 = inheritObject(book);
var b2 = Object.create(book);
b2.name = 'https book';
b2.peerBook.push('canvas book');

console.log(b1.name);
console.log(b1.peerBook);
console.log('--------');
console.log(b2.name);
console.log(b2.peerBook);
console.log('--------');
console.log(book.name);
console.log(book.peerBook);

var b3 = Object.create(book, {
    a: {
        value: 123
    },
    b: {
        value: [1, 2, 3]
    }
});
console.log(b3);