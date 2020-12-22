var decorator = function (id, newHandler) {
    var el = document.getElementById(id);
    if (typeof el.onclick === 'function') {
        var oldHandler = el.onclick;
        el.onclick = function () {
            oldHandler();
            newHandler();
        };
    } else {
        el.onclick = newHandler;
    }
};

decorator('input', function () {
    console.log('newHandler doSomething...');
});