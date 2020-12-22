;(function (F) {
    var moduleCache = {};
    /**
     * getUrl
     * @param moduleName
     */
    var getUrl = function (moduleName) {
        return ('' + moduleName).replace(/\.js$/g, '') + '.js';
    };

    /**
     * loadScript
     * @param src
     */
    var loadScript = function (src) {
        var script = document.createElement('script');
        script.type = 'text/JavaScript';
        script.charset = 'UTF-8';
        script.async = true;
        script.src = src;
        document.getElementsByTagName('head')[0].appendChild(script);
    };


    /**
     * setModule
     * @param moduleName
     * @param params
     * @param callback
     */
    var setModule = function (moduleName, params, callback) {
        var _module, fn;

        if (moduleCache[moduleName]) {
            _module = moduleCache[moduleName];
            _module.status = 'loaded';
            _module.exports = callback ? callback.apply(_module, params) : null;
            while (fn = _module.onload.shift()) {
                fn(_module.exports);
            }
        } else {
            callback && callback.apply(null, params);
        }
    };

    /**
     * loadModule
     * @param moduleName
     * @param callback
     */
    var loadModule = function (moduleName, callback) {
        var _module;

        if (moduleCache[moduleName]) {
            _module = moduleCache[moduleName];
            if (_module.status === 'loaded') {
                setTimeout(callback(_module.exports), 0);
            } else {
                _module.onload.push(callback);
            }
        } else {
            moduleCache[moduleName] = {
                moduleName: moduleName,
                status: 'loading',
                exports: null,
                onload: [callback]
            };
            loadScript(getUrl(moduleName));
        }
    };

    /**
     * module
     * @param url
     * @param moduleDeps
     * @param moduleCallback
     */
    F.module = function (url, moduleDeps, moduleCallback) {
        var
            args = [].slice.call(arguments),
            callback = args.pop(),
            deps = (args.length && args[args.length - 1] instanceof Array) ?
                args.pop() : [],
            url = args.length ? args.pop() : null,
            params = [],
            depsCount = 0,
            i = 0,
            len;

        if (len = deps.length) {

            while (i < len) {

                (function (i) {
                    depsCount++;
                    loadModule(deps[i], function (module) {
                        params[i] = module;
                        depsCount--;
                        if (depsCount === 0) {
                            setModule(url, params, callback);
                        }
                    });
                })(i);

                i++;
            }

        } else {
            setModule(url, [], callback);
        }
    };

})((function () {
    return window.F = {};
})());