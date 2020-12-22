function createPop(type, text, info) {
    var o = {};
    o.content = text;
    o.pop = function () {
        console.log(this.content);
        return this;
    };

    if (type==='alert') {
        o.close = function () {
            console.log(info);
            return this;
        }
    }
    if (type==='confirm') {
        o.close = function () {
            console.log(info);
            return this;
        }
    }
    if (type==='prompt') {
        o.close = function () {
            console.log(info);
            return this;
        }
    }

    return o;
}

var confirm = createPop('confirm','confirm pop','confirm closeInfo');
confirm.pop().close();