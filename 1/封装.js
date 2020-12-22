var Book = function (id, name, price) {
    // 私有属性、方法
    var num = 1;
    function checkId() {

    }
    // 特权方法
    this.getName = function () {

    };
    this.getPrice = function () {

    };
    this.setName = function () {

    };
    this.setPrice = function () {

    };
    // 公有属性、方法
    this.id = id;
    this.copy = function () {

    };
    // 构造器
    this.setName(name);
    this.setPrice(price);
};

// 类静态公有属性、方法
Book.isChinese = true;
Book.resetTime = function () {
    console.log('resetTime');
};
// 公有属性、方法
Book.prototype.isJSBook = true;
Book.prototype.display = function () {

};

//---------------------------
var b = new Book(17,'Javascript设计模式',50);
console.log(b.num);
console.log(b.isJSBook);
console.log(b.id);
console.log(b.isChinese);
console.log('-----------------');
console.log(Book.isChinese);
Book.resetTime();
