var t = 100;

function A() {
    setTimeout(A, t);
    t += 1000;
    console.log('hello');
}

A();