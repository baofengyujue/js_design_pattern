;(function (window) {
    var A = function (selector, context) {
        if (typeof selector == 'function') {
            A(window).on('load', selector);
        } else {
            return new A.fn.init(selector, context);
        }
    };

    A.fn = A.prototype = {
        constructor: A,
        init: function (selector, context) {
            if (typeof selector == 'object') {
                this[0] = selector;
                this.length = 1;
                return this;
            }
            this.length = 0;
            context = document.getElementById(context) || document;
            if (selector.indexOf('#') >= 0) {
                this[0] = document.getElementById(selector.slice(1));
                this.length = 1;
            } else if (selector.indexOf('.') >= 0) {
                var doms = [],
                    className = selector.slice(1);

                if (context.getElementsByClassName) {
                    doms = context.getElementsByClassName(className);
                } else {
                    doms = context.getElementsByTagName('*');
                }

                for (var i = 0, len = doms.length; i < len; i++) {
                    if (doms[i].className && !!~doms[i].className.indexOf(className)) {
                        this[this.length] = doms[i];
                        this.length++;
                    }
                }

            } else {
                var doms = context.getElementsByTagName(selector);
                for (var i = 0, len = doms.length; i < len; i++) {
                    this[i] = doms[i];
                }
                this.length = len;
            }
            this.context = context;
            this.selector = selector;
            return this;
        },
        length: 0,
        push: [].push,
        splice: [].splice
    };


    A.fn.init.prototype = A.fn;

    A.extend = A.fn.extend = function () {
        var i = 1,
            len = arguments.length,
            target = arguments[0],
            j;

        if (i == len) {
            target = this;
            i--;
        }

        for (; i < len; i++) {
            for (j in arguments[i]) {
                target[j] = arguments[i][j];
            }
        }

        return target;
    };

    A.extend({
        camelCase: function (str) {
            return str.replace(/\-(\w)/g, function (match, letter) {
                return letter.toUpperCase();
            });
        },
        trim: function (str) {
            return str.replace(/^\s+|\s+$/g, '');
        },
        create: function (type, value) {
            var dom = document.createElement(type);
            return A(dom).attr(value);
        },
        formatString: function (str, data) {
            var html = '';
            if (data instanceof Array) {
                for (var i = 0; i < data.length; i++) {
                    html += arguments.callee(str, data[i]);
                }
                return html;
            } else {
                return str.replace(/\{\{(\w+)}}/g, function (match, key) {
                    return typeof data == 'string' ? data :
                        data[key] ? data[key] : '';
                });
            }
        }
    });

    var _on = function () {
        if (document.addEventListener) {
            return function (dom, type, fn, data) {
                dom.addEventListener(type, function (e) {
                    fn.call(dom, e, data);
                }, false);
            }
        } else {
            return function (dom, type, fn, data) {
                dom.attachEvent('on' + type, function (e) {
                    fn.call(dom, e, data);
                });
            }
        }
    }();

    A.fn.extend({
        on: function (type, fn, data) {
            var i = this.length;
            for (; --i > -1;) {
                _on(this[i], type, fn, data);
            }
            return this;
        },
        css: function () {
            var arg = arguments,
                len = arguments.length;

            if (this.length < 1) {
                return this;
            }
            if (len == 1) {
                if (typeof arg[0] == 'string') {
                    if (this[0].currentStyle) {
                        return this[0].currentStyle[A.camelCase(arg[0])];
                    } else {
                        return getComputedStyle(this[0])[A.camelCase(arg[0])];
                    }
                } else if (typeof arg[0] == 'object') {
                    for (var i in arg[0]) {
                        for (var j = this.length - 1; j > -1; j--) {
                            this[j].style[A.camelCase(i)] = arg[0][i];
                        }
                    }
                }
            } else if (len == 2) {
                for (var j = this.length - 1; j > -1; j--) {
                    this[j].style[A.camelCase(arg[0])] = arg[1];
                }
            }

            return this;
        },
        attr: function () {
            var arg = arguments,
                len = arg.length;

            if (this.length < 1) {
                return this;
            }
            if (len == 1) {
                if (typeof arg[0] == 'string') {
                    return this[0].getAttribute(arg[0]);
                } else if (typeof arg[0] == 'object') {
                    for (var i in arg[0]) {
                        for (var j = this.length - 1; j > -1; j--) {
                            this[j].setAttribute(i, arg[0][i]);
                        }
                    }
                }
            } else if (len == 2) {
                for (var j = this.length - 1; j > -1; j--) {
                    this[j].setAttribute(arg[0], arg[1]);
                }
            }

            return this;
        },
        html: function () {
            var arg = arguments,
                len = arg.length;

            if (this.length < 1) {
                return this;
            }
            if (len == 0) {
                return this[0].innerHTML;
            } else if (len == 1) {
                for (var i = this.length - 1; i > -1; i--) {
                    this[i].innerHTML = arg[0];
                }
            } else if (len == 2 && arg[1]) {
                for (var i = this.length - 1; i > -1; i--) {
                    this[i].innerHTML += arg[0];
                }
            }

            return this;
        },
        hasClass: function (val) {
            if (!this[0]) {
                return;
            }
            var value = A.trim(val);

            return this[0].className && this[0].className.indexOf(value) >= 0 ? true : false;
        },
        addClass: function (val) {
            var value = A.trim(val),
                str = '';

            for (var i = 0, len = this.length; i < len; i++) {
                str = this[i].className;
                if (str.indexOf(value) < 0) {
                    this[i].className += ' ' + value;
                }
            }

            return this;
        },
        removeClass: function (val) {
            var value = A.trim(val),
                classNameArr,
                result;

            for (var i = 0, len = this.length; i < len; i++) {
                if (this[i].className && ~this[i].className.indexOf(value)) {
                    classNameArr = this[i].className.split(' ');
                    result = '';

                    for (var j = classNameArr.length - 1; j > -1; j--) {
                        classNameArr[j] = A.trim(classNameArr[j]);
                        result += classNameArr[j] && classNameArr[j] != value ?
                        '' + classNameArr[j] : '';
                    }
                    this[i].className = result;
                }
            }

            return this;
        },
        appendTo: function (parent) {
            var doms = A(parent);

            if (doms.length) {
                for (var j = this.length - 1; j > -1; j--) {
                    doms[0].appendChild(this[j]);
                }
            }
        }
    });

    var Tween = {
        timer: 0,
        queue: [],
        interval: 16,
        easing: {
            def: function (time, startValue, changeValue, duration) {
                return changeValue * time / duration + startValue;
            },
            easeOutQuart: function (time, startValue, changeValue, duration) {
                return -changeValue * ((time = time / duration - 1) * time * time * time - 1) + startValue;
            }
        },
        add: function (instance) {
            this.queue.push(instance);
            this.run();
        },
        clear: function () {
            clearInterval(this.timer);
            this.timer = 0;
        },
        run: function () {
            if (this.timer) {
                return;
            }
            this.clear();
            this.timer = setInterval(this.loop, this.interval);
        },
        loop: function () {
            if (Tween.queue.length == 0) {
                Tween.clear();
                return;
            }
            var now = +new Date();

            for (var i = Tween.queue.length - 1; i > -1; i--) {
                var instance = Tween.queue[i];
                instance.passed = now - instance.start;
                if (instance.passed < instance.duration) {
                    Tween.workFn(instance);
                } else {
                    Tween.endFn(instance);
                }
            }
        },
        workFn: function (instance) {
            instance.tween = this.easing[instance.type](instance.passed, instance.from,
                instance.to - instance.from, instance.duration);

            this.exec(instance);
        },
        endFn: function (instance) {
            instance.passed = instance.duration;
            instance.tween = instance.to;
            this.exec(instance);
            this.destroy(instance);
        },
        exec: function (instance) {
            try {
                instance.main(instance.dom);
            } catch (err) {
            }
        },
        destroy: function (instance) {
            instance.end();
            this.queue.splice(this.queue.indexOf(instance), 1);
            for (var i in instance) {
                delete instance[i];
            }
        }
    };
    Tween.queue.indexOf = function () {
        var self = this;
        return Tween.queue.indexOf || function (instance) {
                for (var i = 0, len = self.length; i < len; i++) {
                    if (self[i] == instance) {
                        return i;
                    }
                }
                return -1;
            }
    }();

    A.fn.extend({
        animate: function (obj) {
            obj = A.extend({
                duration: 400,
                type: 'def',
                from: 0,
                to: 1,
                start: +new Date(),
                dom: this,
                main: function () {

                },
                end: function () {

                }
            }, obj);
            Tween.add(obj);
        }
    });

    A.noConflict = function (library) {
        if (library) {
            window.$ = library;
        } else {
            window.$ = null;
            delete window.$;
        }

        return A;
    };

    window.$ = window.A = A;

})(window);