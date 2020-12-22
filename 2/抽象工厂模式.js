var VehicleFactory = function (subType, superType) {
    if (typeof VehicleFactory[superType]==='function') {
        function F() {}
        F.prototype = new VehicleFactory[superType]();
        subType.constructor = subType;
        subType.prototype = new F();
    } else {
        throw new Error('未创建该抽象类');
    }
};

VehicleFactory.Car = function () {
    this.type = 'car';
};
VehicleFactory.Car.prototype = {
    getPrice: function () {
        return new Error('抽象方法不能调用');
    },
    getSpeed: function () {
        return new Error('抽象方法不能调用');
    }
};

VehicleFactory.Bus = function () {
    this.type = 'bus';
};
VehicleFactory.Bus.prototype = {
    getPrice: function () {
        return new Error('抽象方法不能调用');
    },
    getPassengerNum: function () {
        return new Error('抽象方法不能调用');
    }
};

//-------------------
var BMW = function (price, speed) {
    this.price = price;
    this.speed = speed;
};
VehicleFactory(BMW, 'Car');
// BMW.prototype.getPrice = function () {
//     return this.price;
// };
// BMW.prototype.getSpeed = function () {
//     return this.speed;
// };

var YUTONG = function (price, passenger) {
    this.price = price;
    this.passenger = passenger;
};
VehicleFactory(YUTONG, 'Bus');
YUTONG.prototype.getPrice = function () {
    return this.price;
};
YUTONG.prototype.getPassengerNum = function () {
    return this.passenger;
};
//-------------------
var c1 = new BMW(100000,200);
// console.log(c1.getPrice());
console.log(c1.type);
console.log('--------');
var c2 = new YUTONG(200000,120);
console.log(c2.getPassengerNum());
console.log(c2.type);

// 并不强制要求实现，弱实现