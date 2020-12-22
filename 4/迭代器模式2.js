var AGetter = function (key) {
    if (!A) return;
    var result = A;
    key = key.split('.');
    for (var i = 0; i < key.length; i++) {
        if (result[key[i]]) {
            result = result[key[i]];
        } else {
            return;
        }
    }
    return result;
};
var ASetter = function (key, val) {
    if (!A) return;
    var result = A;
    key = key.split('.');
    // 最后一个属性跳过判断，直接赋值
    for (var i = 0; i < key.length - 1; i++) {
        if (!result[key[i]]) {
            result[key[i]] = {};
        }
        if (!(result[key[i]] instanceof Object)) {
            throw new Error('A.' + key.slice(0, i + 1).join('.') + ' is not Object');
        }
        result = result[key[i]];
    }
    return result[key[i]] = val;
};

var A = {
    common: {},
    client: {
        user: {
            username: 'hi',
            uid: 123,
            news: {}
        }
    }
};

console.log(AGetter('client.user.username'));
console.log(AGetter('common.user'));

console.log(ASetter('client.user.news.sports', 'badminton'));

console.log(ASetter('client.user.username', 'hello'));
console.log(AGetter('client.user.username'));

console.log(ASetter('client.user.username.lastName', 'world'));

