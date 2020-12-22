var LoopImg = function (imgArr, container) {
    this.imgArr = imgArr;
    this.container = container;
};
LoopImg.prototype = {
    createImg: function () {
        console.log('LoopImg createImg');
    },
    changeImg: function () {
        console.log('LoopImg changeImg');
    }
};

var SlideLoopImg = function (imgArr, container) {
    LoopImg.call(this, imgArr, container);
};
SlideLoopImg.prototype = new LoopImg();
SlideLoopImg.prototype.changeImg = function () {
    console.log('SlideLoopImg changeImg');
};

var FadeLoopImg = function (imgArr, container, arrow) {
    LoopImg.call(this, imgArr, container);
    this.arrow = arrow;
};
FadeLoopImg.prototype = new LoopImg();
FadeLoopImg.prototype.changeImg = function () {
    console.log('FadeLoopImg changeImg');
};

//--------------------
var fadeloop = new FadeLoopImg([
    '01.jpg',
    '02.jpg',
    '03.jpg',
    '04.jpg'
],'#slideBox',['left.jpg','right.jpg']);

console.log(fadeloop.container);
console.log(fadeloop.arrow);
fadeloop.changeImg();
