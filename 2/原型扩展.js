function prototypeExtend() {
    var F = function () {},
        args = arguments,
        i = 0,
        len = args.length;
    for (; i < len; i++) {
        for (var j in args[i]) {
            F.prototype[j] = args[i][j];
        }
    }
    return new F();
}
// F.prototype = {
//      speed: ...
//      swim: ...
//      run: ...
//      ...
// }
// penguin = new F()
//--------------------
var penguin = prototypeExtend({
    speed: 20,
    swim: function () {
        console.log('游泳速度：' + this.speed);
        return this;
    }
}, {
    run: function (speed) {
        console.log('奔跑速度：' + speed);
        return this;
    }
}, {
    jump: function () {
        console.log('跳跃动作');
        return this;
    }
});

penguin.swim().run(10).jump();