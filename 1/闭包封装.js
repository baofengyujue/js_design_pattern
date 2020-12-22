var Book = function () {
    // 静态私有变量、方法
    var __bookNum = 0;
    function __checkBook(name) {

    }

     function _Book(newId, newName, newPrice) {
        var _name,_price;
        function _checkId(id) {

        }

        this.getName = function () {

        };
        this.getPrice = function () {

        };
        this.setName = function () {

        };
        this.setPrice = function () {

        };

        this.id = newId;
        this.copy = function () {

        };

        __bookNum++;
        if (__bookNum>2) {
            throw new Error('仅出版2本书');
        }

        this.setName(newName);
        this.setName(newPrice);
    }

    _Book.isChinese = true;
    _Book.resetTime = function () {
        console.log('resetTime');
    };

    _Book.prototype.isJSBook = true;
    _Book.prototype.display = function () {

    };

    return _Book;
}();

//---------------------------
var b = new Book(17,'Javascript设计模式',50);
console.log(b.num);
console.log(b.isJSBook);
console.log(b.id);
console.log(b.isChinese);
console.log('-----------------');
console.log(Book.isChinese);
Book.resetTime();

var c = new Book(17,'Javascript设计模式',50);
var d = new Book(17,'Javascript设计模式',50);
