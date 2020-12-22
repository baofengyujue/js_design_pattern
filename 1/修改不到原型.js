function C() {
    // this.a = 'a';
}
C.prototype.hi = 'hi1234';
// C.prototype.hey = 'hey';
C.prototype.a = [1, 2];

var c = new C();
// c.hi = 'hello';
// c.a = 'a';
c.a.push(3, 4);
// console.log(c.hi);
// console.log(c.hey);
console.log(c.a);
// console.log(C.prototype.hi);
console.log(C.prototype.a);




//-------------
function A() {

}
A.prototype.p = 10;

var a = new A();
a.p++;
console.log(a.p);
console.log(A.prototype.p);
