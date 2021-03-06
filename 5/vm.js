"use strict";
(function (InjectedScriptHost, inspectedGlobalObject, injectedScriptId) {
    var Object = ({}.constructor);

    function push(array, var_args) {
        for (var i = 1; i < arguments.length; ++i)
            array[array.length] = arguments[i];
    }

    function slice(array, index) {
        var result = [];
        for (var i = index || 0, j = 0; i < array.length; ++i, ++j)
            result[j] = array[i];
        return result;
    }

    function concat(array1, array2) {
        var result = [];
        for (var i = 0; i < array1.length; ++i)
            push(result, array1[i]);
        for (var i = 0; i < array2.length; ++i)
            push(result, array2[i]);
        return result;
    }

    function toString(obj) {
        try {
            return "" + obj;
        } catch (e) {
            var name = InjectedScriptHost.internalConstructorName(obj) || InjectedScriptHost.subtype(obj) || (typeof obj);
            return "#<" + name + ">";
        }
    }

    function toStringDescription(obj) {
        if (typeof obj === "number" && obj === 0 && 1 / obj < 0)
            return "-0";
        return toString(obj);
    }

    function bind(func, thisObject, var_args) {
        var args = slice(arguments, 2);

        function bound(var_args) {
            return InjectedScriptHost.callFunction(func, thisObject, concat(args, slice(arguments)));
        }

        bound.toString = function () {
            return "bound: " + toString(func);
        };
        return bound;
    }

    function nullifyObjectProto(obj) {
        if (obj && typeof obj === "object")
            obj.__proto__ = null;
        return obj;
    }

    function isUInt32(obj) {
        if (typeof obj === "number")
            return obj >>> 0 === obj && (obj > 0 || 1 / obj > 0);
        return "" + (obj >>> 0) === obj;
    }

    function isArrayLike(obj) {
        if (typeof obj !== "object")
            return false;
        try {
            if (typeof obj.splice === "function") {
                if (!InjectedScriptHost.suppressWarningsAndCallFunction(Object.prototype.hasOwnProperty, obj, ["length"]))
                    return false;
                var len = obj.length;
                return typeof len === "number" && isUInt32(len);
            }
        } catch (e) {
        }
        return false;
    }

    function max(a, b) {
        return a > b ? a : b;
    }

    function isSymbol(obj) {
        var type = typeof obj;
        return (type === "symbol");
    }

    function indexOf(str, searchElement, fromIndex) {
        var len = str.length;
        var n = fromIndex || 0;
        var k = max(n >= 0 ? n : len + n, 0);
        while (k < len) {
            if (str[k] === searchElement)
                return k;
            ++k;
        }
        return -1;
    }

    var domAttributesWithObservableSideEffectOnGet = nullifyObjectProto({});
    domAttributesWithObservableSideEffectOnGet["Request"] = nullifyObjectProto({});
    domAttributesWithObservableSideEffectOnGet["Request"]["body"] = true;
    domAttributesWithObservableSideEffectOnGet["Response"] = nullifyObjectProto({});
    domAttributesWithObservableSideEffectOnGet["Response"]["body"] = true;
    function doesAttributeHaveObservableSideEffectOnGet(object, attribute) {
        for (var interfaceName in domAttributesWithObservableSideEffectOnGet) {
            var isInstance = InjectedScriptHost.suppressWarningsAndCallFunction(function (object, interfaceName) {
                return typeof inspectedGlobalObject[interfaceName] === "function" && object instanceof inspectedGlobalObject[interfaceName];
            }, null, [object, interfaceName]);
            if (isInstance) {
                return attribute in domAttributesWithObservableSideEffectOnGet[interfaceName];
            }
        }
        return false;
    }

    var InjectedScript = function () {
    }
    InjectedScript.primitiveTypes = {
        "undefined": true,
        "boolean": true,
        "number": true,
        "string": true,
        __proto__: null
    }
    InjectedScript.prototype = {
        isPrimitiveValue: function (object) {
            return InjectedScript.primitiveTypes[typeof object] && !this._isHTMLAllCollection(object);
        },
        wrapObject: function (object, groupName, canAccessInspectedGlobalObject, forceValueType, generatePreview) {
            if (canAccessInspectedGlobalObject)
                return this._wrapObject(object, groupName, forceValueType, generatePreview);
            return this._fallbackWrapper(object);
        },
        wrapPropertyInArray: function (array, property, groupName, canAccessInspectedGlobalObject, forceValueType, generatePreview) {
            for (var i = 0; i < array.length; ++i) {
                if (typeof array[i] === "object" && property in array[i])
                    array[i][property] = this.wrapObject(array[i][property], groupName, canAccessInspectedGlobalObject, forceValueType, generatePreview);
            }
        },
        wrapObjectsInArray: function (array, groupName, canAccessInspectedGlobalObject, forceValueType, generatePreview) {
            for (var i = 0; i < array.length; ++i)
                array[i] = this.wrapObject(array[i], groupName, canAccessInspectedGlobalObject, forceValueType, generatePreview);
        },
        _fallbackWrapper: function (object) {
            var result = {__proto__: null};
            result.type = typeof object;
            if (this.isPrimitiveValue(object))
                result.value = object; else
                result.description = toString(object);
            return (result);
        },
        wrapTable: function (canAccessInspectedGlobalObject, table, columns) {
            if (!canAccessInspectedGlobalObject)
                return this._fallbackWrapper(table);
            var columnNames = null;
            if (typeof columns === "string")
                columns = [columns];
            if (InjectedScriptHost.subtype(columns) === "array") {
                columnNames = [];
                for (var i = 0; i < columns.length; ++i)
                    columnNames[i] = toString(columns[i]);
            }
            return this._wrapObject(table, "console", false, true, columnNames, true);
        },
        _inspect: function (object) {
            if (arguments.length === 0)
                return;
            var objectId = this._wrapObject(object, "");
            var hints = {__proto__: null};
            InjectedScriptHost.inspect(objectId, hints);
            return object;
        },
        _wrapObject: function (object, objectGroupName, forceValueType, generatePreview, columnNames, isTable, doNotBind, customObjectConfig) {
            try {
                return new InjectedScript.RemoteObject(object, objectGroupName, doNotBind, forceValueType, generatePreview, columnNames, isTable, undefined, customObjectConfig);
            } catch (e) {
                try {
                    var description = injectedScript._describe(e);
                } catch (ex) {
                    var description = "<failed to convert exception to string>";
                }
                return new InjectedScript.RemoteObject(description);
            }
        },
        _bind: function (object, objectGroupName) {
            var id = InjectedScriptHost.bind(object, objectGroupName || "");
            return "{\"injectedScriptId\":" + injectedScriptId + ",\"id\":" + id + "}";
        },
        clearLastEvaluationResult: function () {
            delete this._lastResult;
        },
        setLastEvaluationResult: function (result) {
            this._lastResult = result;
        },
        getProperties: function (object, objectGroupName, ownProperties, accessorPropertiesOnly, generatePreview) {
            var descriptors = [];
            var iter = this._propertyDescriptors(object, ownProperties, accessorPropertiesOnly, undefined);
            for (var descriptor of iter) {
                if ("get" in descriptor)
                    descriptor.get = this._wrapObject(descriptor.get, objectGroupName);
                if ("set" in descriptor)
                    descriptor.set = this._wrapObject(descriptor.set, objectGroupName);
                if ("value" in descriptor)
                    descriptor.value = this._wrapObject(descriptor.value, objectGroupName, false, generatePreview);
                if (!("configurable" in descriptor))
                    descriptor.configurable = false;
                if (!("enumerable" in descriptor))
                    descriptor.enumerable = false;
                if ("symbol" in descriptor)
                    descriptor.symbol = this._wrapObject(descriptor.symbol, objectGroupName);
                push(descriptors, descriptor);
            }
            return descriptors;
        },
        _propertyDescriptors: function*(object, ownProperties, accessorPropertiesOnly, propertyNamesOnly) {
            var propertyProcessed = {__proto__: null};

            function*process(o, properties) {
                for (var property of properties) {
                    if (propertyProcessed[property])
                        continue;
                    var name = property;
                    if (isSymbol(property))
                        name = (injectedScript._describe(property));
                    try {
                        propertyProcessed[property] = true;
                        var descriptor = nullifyObjectProto(InjectedScriptHost.suppressWarningsAndCallFunction(Object.getOwnPropertyDescriptor, Object, [o, property]));
                        if (descriptor) {
                            if (accessorPropertiesOnly && !("get" in descriptor || "set" in descriptor))
                                continue;
                            if ("get" in descriptor && "set" in descriptor && name != "__proto__" && InjectedScriptHost.formatAccessorsAsProperties(object) && !doesAttributeHaveObservableSideEffectOnGet(object, name)) {
                                descriptor.value = InjectedScriptHost.suppressWarningsAndCallFunction(function (attribute) {
                                    return this[attribute];
                                }, object, [name]);
                                descriptor.isOwn = true;
                                delete descriptor.get;
                                delete descriptor.set;
                            }
                        } else {
                            if (accessorPropertiesOnly)
                                continue;
                            try {
                                descriptor = {
                                    name: name,
                                    value: o[property],
                                    writable: false,
                                    configurable: false,
                                    enumerable: false,
                                    __proto__: null
                                };
                                if (o === object)
                                    descriptor.isOwn = true;
                                yield descriptor;
                            } catch (e) {
                            }
                            continue;
                        }
                    } catch (e) {
                        if (accessorPropertiesOnly)
                            continue;
                        var descriptor = {__proto__: null};
                        descriptor.value = e;
                        descriptor.wasThrown = true;
                    }
                    descriptor.name = name;
                    if (o === object)
                        descriptor.isOwn = true;
                    if (isSymbol(property))
                        descriptor.symbol = property;
                    yield descriptor;
                }
            }

            function*arrayIndexNames(length) {
                for (var i = 0; i < length; ++i)
                    yield"" + i;
            }

            if (propertyNamesOnly) {
                for (var i = 0; i < propertyNamesOnly.length; ++i) {
                    var name = propertyNamesOnly[i];
                    for (var o = object; this._isDefined(o); o = o.__proto__) {
                        if (InjectedScriptHost.suppressWarningsAndCallFunction(Object.prototype.hasOwnProperty, o, [name])) {
                            for (var descriptor of process(o, [name]))
                                yield descriptor;
                            break;
                        }
                        if (ownProperties)
                            break;
                    }
                }
                return;
            }
            var skipGetOwnPropertyNames;
            try {
                skipGetOwnPropertyNames = InjectedScriptHost.isTypedArray(object) && object.length > 500000;
            } catch (e) {
            }
            for (var o = object; this._isDefined(o); o = o.__proto__) {
                if (skipGetOwnPropertyNames && o === object) {
                    for (var descriptor of process(o, arrayIndexNames(o.length)))
                        yield descriptor;
                } else {
                    for (var descriptor of process(o, Object.keys((o))))
                        yield descriptor;
                    for (var descriptor of process(o, Object.getOwnPropertyNames((o))))
                        yield descriptor;
                }
                if (Object.getOwnPropertySymbols) {
                    for (var descriptor of process(o, Object.getOwnPropertySymbols((o))))
                        yield descriptor;
                }
                if (ownProperties) {
                    if (object.__proto__ && !accessorPropertiesOnly)
                        yield{
                            name: "__proto__",
                            value: object.__proto__,
                            writable: true,
                            configurable: true,
                            enumerable: false,
                            isOwn: true,
                            __proto__: null
                        };
                    break;
                }
            }
        },
        _substituteObjectTagsInCustomPreview: function (objectGroupName, jsonMLObject) {
            var maxCustomPreviewRecursionDepth = 20;
            this._customPreviewRecursionDepth = (this._customPreviewRecursionDepth || 0) + 1
            try {
                if (this._customPreviewRecursionDepth >= maxCustomPreviewRecursionDepth)
                    throw new Error("Too deep hierarchy of inlined custom previews");
                if (!isArrayLike(jsonMLObject))
                    return;
                if (jsonMLObject[0] === "object") {
                    var attributes = jsonMLObject[1];
                    var originObject = attributes["object"];
                    var config = attributes["config"];
                    if (typeof originObject === "undefined")
                        throw new Error("Illegal format: obligatory attribute \"object\" isn't specified");
                    jsonMLObject[1] = this._wrapObject(originObject, objectGroupName, false, false, null, false, false, config);
                    return;
                }
                for (var i = 0; i < jsonMLObject.length; ++i)
                    this._substituteObjectTagsInCustomPreview(objectGroupName, jsonMLObject[i]);
            } finally {
                this._customPreviewRecursionDepth--;
            }
        },
        commandLineAPI: function () {
            return new CommandLineAPI(this._commandLineAPIImpl);
        },
        remoteObjectAPI: function (objectGroup) {
            function wrap(object, forceValueType, generatePreview, columnNames, isTable, customObjectConfig) {
                return this._wrapObject(object, objectGroup, forceValueType, generatePreview, columnNames, isTable, false, customObjectConfig);
            }

            return {bindRemoteObject: bind(wrap, this), __proto__: null};
        },
        _isDefined: function (object) {
            return !!object || this._isHTMLAllCollection(object);
        },
        _isHTMLAllCollection: function (object) {
            return (typeof object === "undefined") && !!InjectedScriptHost.subtype(object);
        },
        _subtype: function (obj) {
            if (obj === null)
                return "null";
            if (this.isPrimitiveValue(obj))
                return null;
            var subtype = InjectedScriptHost.subtype(obj);
            if (subtype)
                return subtype;
            if (isArrayLike(obj))
                return "array";
            return null;
        },
        _describe: function (obj) {
            if (this.isPrimitiveValue(obj))
                return null;
            var subtype = this._subtype(obj);
            if (subtype === "regexp")
                return toString(obj);
            if (subtype === "date")
                return toString(obj);
            if (subtype === "node") {
                var description = obj.nodeName.toLowerCase();
                switch (obj.nodeType) {
                    case 1:
                        description += obj.id ? "#" + obj.id : "";
                        var className = obj.className;
                        description += (className && typeof className === "string") ? "." + className.trim().replace(/\s+/g, ".") : "";
                        break;
                    case 10:
                        description = "<!DOCTYPE " + description + ">";
                        break;
                }
                return description;
            }
            var className = InjectedScriptHost.internalConstructorName(obj);
            if (subtype === "array") {
                if (typeof obj.length === "number")
                    className += "[" + obj.length + "]";
                return className;
            }
            if (typeof obj === "function")
                return toString(obj);
            if (isSymbol(obj)) {
                try {
                    return (InjectedScriptHost.callFunction(Symbol.prototype.toString, obj)) || "Symbol";
                } catch (e) {
                    return "Symbol";
                }
            }
            if (InjectedScriptHost.subtype(obj) === "error") {
                try {
                    var stack = obj.stack;
                    var message = obj.message && obj.message.length ? ": " + obj.message : "";
                    var firstCallFrame = /^\s+at\s/m.exec(stack);
                    var stackMessageEnd = firstCallFrame ? firstCallFrame.index : -1;
                    if (stackMessageEnd !== -1) {
                        var stackTrace = stack.substr(stackMessageEnd);
                        return className + message + "\n" + stackTrace;
                    }
                    return className + message;
                } catch (e) {
                }
            }
            return className;
        },
        setCustomObjectFormatterEnabled: function (enabled) {
            this._customObjectFormatterEnabled = enabled;
        }
    }
    var injectedScript = new InjectedScript();
    InjectedScript.RemoteObject = function (object, objectGroupName, doNotBind, forceValueType, generatePreview, columnNames, isTable, skipEntriesPreview, customObjectConfig) {
        this.type = typeof object;
        if (this.type === "undefined" && injectedScript._isHTMLAllCollection(object))
            this.type = "object";
        if (injectedScript.isPrimitiveValue(object) || object === null || forceValueType) {
            if (this.type !== "undefined")
                this.value = object;
            if (object === null)
                this.subtype = "null";
            if (this.type === "number") {
                this.description = toStringDescription(object);
                switch (this.description) {
                    case"NaN":
                    case"Infinity":
                    case"-Infinity":
                    case"-0":
                        this.value = this.description;
                        break;
                }
            }
            return;
        }
        object = (object);
        if (!doNotBind)
            this.objectId = injectedScript._bind(object, objectGroupName);
        var subtype = injectedScript._subtype(object);
        if (subtype)
            this.subtype = subtype;
        var className = InjectedScriptHost.internalConstructorName(object);
        if (className)
            this.className = className;
        this.description = injectedScript._describe(object);
        if (generatePreview && this.type === "object" && this.subtype !== "node")
            this.preview = this._generatePreview(object, undefined, columnNames, isTable, skipEntriesPreview);
        if (injectedScript._customObjectFormatterEnabled) {
            var customPreview = this._customPreview(object, objectGroupName, customObjectConfig);
            if (customPreview)
                this.customPreview = customPreview;
        }
    }
    InjectedScript.RemoteObject.prototype = {
        _customPreview: function (object, objectGroupName, customObjectConfig) {
            function logError(error) {
                Promise.resolve().then(inspectedGlobalObject.console.error.bind(inspectedGlobalObject.console, "Custom Formatter Failed: " + error.message));
            }

            try {
                var formatters = inspectedGlobalObject["devtoolsFormatters"];
                if (!formatters || !isArrayLike(formatters))
                    return null;
                for (var i = 0; i < formatters.length; ++i) {
                    try {
                        var formatted = formatters[i].header(object, customObjectConfig);
                        if (!formatted)
                            continue;
                        var hasBody = formatters[i].hasBody(object, customObjectConfig);
                        injectedScript._substituteObjectTagsInCustomPreview(objectGroupName, formatted);
                        var formatterObjectId = injectedScript._bind(formatters[i], objectGroupName);
                        var result = {
                            header: JSON.stringify(formatted),
                            hasBody: !!hasBody,
                            formatterObjectId: formatterObjectId
                        };
                        if (customObjectConfig)
                            result["configObjectId"] = injectedScript._bind(customObjectConfig, objectGroupName);
                        return result;
                    } catch (e) {
                        logError(e);
                    }
                }
            } catch (e) {
                logError(e);
            }
            return null;
        }, _createEmptyPreview: function () {
            var preview = {
                type: (this.type),
                description: this.description || toStringDescription(this.value),
                lossless: true,
                overflow: false,
                properties: [],
                __proto__: null
            };
            if (this.subtype)
                preview.subtype = (this.subtype);
            return preview;
        }, _generatePreview: function (object, firstLevelKeys, secondLevelKeys, isTable, skipEntriesPreview) {
            var preview = this._createEmptyPreview();
            var firstLevelKeysCount = firstLevelKeys ? firstLevelKeys.length : 0;
            var propertiesThreshold = {
                properties: isTable ? 1000 : max(5, firstLevelKeysCount),
                indexes: isTable ? 1000 : max(100, firstLevelKeysCount),
                __proto__: null
            };
            try {
                var descriptors = injectedScript._propertyDescriptors(object, undefined, undefined, firstLevelKeys);
                this._appendPropertyDescriptors(preview, descriptors, propertiesThreshold, secondLevelKeys, isTable);
                if (propertiesThreshold.indexes < 0 || propertiesThreshold.properties < 0)
                    return preview;
                var rawInternalProperties = InjectedScriptHost.getInternalProperties(object) || [];
                var internalProperties = [];
                for (var i = 0; i < rawInternalProperties.length; i += 2) {
                    push(internalProperties, {
                        name: rawInternalProperties[i],
                        value: rawInternalProperties[i + 1],
                        isOwn: true,
                        enumerable: true,
                        __proto__: null
                    });
                }
                this._appendPropertyDescriptors(preview, internalProperties, propertiesThreshold, secondLevelKeys, isTable);
                if (this.subtype === "map" || this.subtype === "set" || this.subtype === "iterator")
                    this._appendEntriesPreview(object, preview, skipEntriesPreview);
            } catch (e) {
                preview.lossless = false;
            }
            return preview;
        }, _appendPropertyDescriptors: function (preview, descriptors, propertiesThreshold, secondLevelKeys, isTable) {
            for (var descriptor of descriptors) {
                if (propertiesThreshold.indexes < 0 || propertiesThreshold.properties < 0)
                    break;
                if (!descriptor)
                    continue;
                if (descriptor.wasThrown) {
                    preview.lossless = false;
                    continue;
                }
                var name = descriptor.name;
                if (name === "__proto__")
                    continue;
                if (!descriptor.isOwn && !descriptor.enumerable)
                    continue;
                if (this.subtype === "array" && name === "length")
                    continue;
                if ((this.subtype === "map" || this.subtype === "set") && name === "size")
                    continue;
                if (!descriptor.isOwn) {
                    preview.lossless = false;
                    continue;
                }
                if (!("value" in descriptor)) {
                    preview.lossless = false;
                    continue;
                }
                var value = descriptor.value;
                var type = typeof value;
                if (type === "function" && (this.subtype !== "array" || !isUInt32(name))) {
                    preview.lossless = false;
                    continue;
                }
                if (type === "undefined" && injectedScript._isHTMLAllCollection(value))
                    type = "object";
                if (value === null) {
                    this._appendPropertyPreview(preview, {
                        name: name,
                        type: "object",
                        subtype: "null",
                        value: "null",
                        __proto__: null
                    }, propertiesThreshold);
                    continue;
                }
                var maxLength = 100;
                if (InjectedScript.primitiveTypes[type]) {
                    if (type === "string" && value.length > maxLength) {
                        value = this._abbreviateString(value, maxLength, true);
                        preview.lossless = false;
                    }
                    this._appendPropertyPreview(preview, {
                        name: name,
                        type: type,
                        value: toStringDescription(value),
                        __proto__: null
                    }, propertiesThreshold);
                    continue;
                }
                var property = {name: name, type: type, __proto__: null};
                var subtype = injectedScript._subtype(value);
                if (subtype)
                    property.subtype = subtype;
                if (secondLevelKeys === null || secondLevelKeys) {
                    var subPreview = this._generatePreview(value, secondLevelKeys || undefined, undefined, isTable);
                    property.valuePreview = subPreview;
                    if (!subPreview.lossless)
                        preview.lossless = false;
                    if (subPreview.overflow)
                        preview.overflow = true;
                } else {
                    var description = "";
                    if (type !== "function")
                        description = this._abbreviateString((injectedScript._describe(value)), maxLength, subtype === "regexp");
                    property.value = description;
                    preview.lossless = false;
                }
                this._appendPropertyPreview(preview, property, propertiesThreshold);
            }
        }, _appendPropertyPreview: function (preview, property, propertiesThreshold) {
            if (toString(property.name >>> 0) === property.name)
                propertiesThreshold.indexes--; else
                propertiesThreshold.properties--;
            if (propertiesThreshold.indexes < 0 || propertiesThreshold.properties < 0) {
                preview.overflow = true;
                preview.lossless = false;
            } else {
                push(preview.properties, property);
            }
        }, _appendEntriesPreview: function (object, preview, skipEntriesPreview) {
            var entries = InjectedScriptHost.collectionEntries(object);
            if (!entries)
                return;
            if (skipEntriesPreview) {
                if (entries.length) {
                    preview.overflow = true;
                    preview.lossless = false;
                }
                return;
            }
            preview.entries = [];
            var entriesThreshold = 5;
            for (var i = 0; i < entries.length; ++i) {
                if (preview.entries.length >= entriesThreshold) {
                    preview.overflow = true;
                    preview.lossless = false;
                    break;
                }
                var entry = nullifyObjectProto(entries[i]);
                var previewEntry = {value: generateValuePreview(entry.value), __proto__: null};
                if ("key" in entry)
                    previewEntry.key = generateValuePreview(entry.key);
                push(preview.entries, previewEntry);
            }
            function generateValuePreview(value) {
                var remoteObject = new InjectedScript.RemoteObject(value, undefined, true, undefined, true, undefined, undefined, true);
                var valuePreview = remoteObject.preview || remoteObject._createEmptyPreview();
                if (!valuePreview.lossless)
                    preview.lossless = false;
                return valuePreview;
            }
        }, _abbreviateString: function (string, maxLength, middle) {
            if (string.length <= maxLength)
                return string;
            if (middle) {
                var leftHalf = maxLength >> 1;
                var rightHalf = maxLength - leftHalf - 1;
                return string.substr(0, leftHalf) + "\u2026" + string.substr(string.length - rightHalf, rightHalf);
            }
            return string.substr(0, maxLength) + "\u2026";
        }, __proto__: null
    }
    function CommandLineAPI(commandLineAPIImpl) {
        function customToStringMethod(name) {
            return function () {
                var funcArgsSyntax = "";
                try {
                    var funcSyntax = "" + commandLineAPIImpl[name];
                    funcSyntax = funcSyntax.replace(/\n/g, " ");
                    funcSyntax = funcSyntax.replace(/^function[^\(]*\(([^\)]*)\).*$/, "$1");
                    funcSyntax = funcSyntax.replace(/\s*,\s*/g, ", ");
                    funcSyntax = funcSyntax.replace(/\bopt_(\w+)\b/g, "[$1]");
                    funcArgsSyntax = funcSyntax.trim();
                } catch (e) {
                }
                return "function " + name + "(" + funcArgsSyntax + ") { [Command Line API] }";
            };
        }

        for (var i = 0; i < CommandLineAPI.members_.length; ++i) {
            var member = CommandLineAPI.members_[i];
            this[member] = bind(commandLineAPIImpl[member], commandLineAPIImpl);
            this[member].toString = customToStringMethod(member);
        }
        for (var i = 0; i < 5; ++i) {
            var member = "$" + i;
            this[member] = bind(commandLineAPIImpl._inspectedObject, commandLineAPIImpl, i);
        }
        this.$_ = injectedScript._lastResult;
        this.__proto__ = null;
    }

    CommandLineAPI.members_ = ["$", "$$", "$x", "dir", "dirxml", "keys", "values", "profile", "profileEnd", "monitorEvents", "unmonitorEvents", "inspect", "copy", "clear", "getEventListeners", "debug", "undebug", "monitor", "unmonitor", "table"];
    function CommandLineAPIImpl() {
    }

    CommandLineAPIImpl.prototype = {
        $: function (selector, opt_startNode) {
            if (this._canQuerySelectorOnNode(opt_startNode))
                return opt_startNode.querySelector(selector);
            return inspectedGlobalObject.document.querySelector(selector);
        }, $$: function (selector, opt_startNode) {
            if (this._canQuerySelectorOnNode(opt_startNode))
                return slice(opt_startNode.querySelectorAll(selector));
            return slice(inspectedGlobalObject.document.querySelectorAll(selector));
        }, _canQuerySelectorOnNode: function (node) {
            return !!node && InjectedScriptHost.subtype(node) === "node" && (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.DOCUMENT_NODE || node.nodeType === Node.DOCUMENT_FRAGMENT_NODE);
        }, $x: function (xpath, opt_startNode) {
            var doc = (opt_startNode && opt_startNode.ownerDocument) || inspectedGlobalObject.document;
            var result = doc.evaluate(xpath, opt_startNode || doc, null, XPathResult.ANY_TYPE, null);
            switch (result.resultType) {
                case XPathResult.NUMBER_TYPE:
                    return result.numberValue;
                case XPathResult.STRING_TYPE:
                    return result.stringValue;
                case XPathResult.BOOLEAN_TYPE:
                    return result.booleanValue;
                default:
                    var nodes = [];
                    var node;
                    while (node = result.iterateNext())
                        push(nodes, node);
                    return nodes;
            }
        }, dir: function (var_args) {
            return InjectedScriptHost.callFunction(inspectedGlobalObject.console.dir, inspectedGlobalObject.console, slice(arguments));
        }, dirxml: function (var_args) {
            return InjectedScriptHost.callFunction(inspectedGlobalObject.console.dirxml, inspectedGlobalObject.console, slice(arguments));
        }, keys: function (object) {
            return Object.keys(object);
        }, values: function (object) {
            var result = [];
            for (var key in object)
                push(result, object[key]);
            return result;
        }, profile: function (opt_title) {
            return InjectedScriptHost.callFunction(inspectedGlobalObject.console.profile, inspectedGlobalObject.console, slice(arguments));
        }, profileEnd: function (opt_title) {
            return InjectedScriptHost.callFunction(inspectedGlobalObject.console.profileEnd, inspectedGlobalObject.console, slice(arguments));
        }, monitorEvents: function (object, opt_types) {
            if (!object || !object.addEventListener || !object.removeEventListener)
                return;
            var types = this._normalizeEventTypes(opt_types);
            for (var i = 0; i < types.length; ++i) {
                object.removeEventListener(types[i], this._logEvent, false);
                object.addEventListener(types[i], this._logEvent, false);
            }
        }, unmonitorEvents: function (object, opt_types) {
            if (!object || !object.addEventListener || !object.removeEventListener)
                return;
            var types = this._normalizeEventTypes(opt_types);
            for (var i = 0; i < types.length; ++i)
                object.removeEventListener(types[i], this._logEvent, false);
        }, inspect: function (object) {
            return injectedScript._inspect(object);
        }, copy: function (object) {
            var string;
            if (injectedScript._subtype(object) === "node") {
                string = object.outerHTML;
            } else if (injectedScript.isPrimitiveValue(object)) {
                string = toString(object);
            } else {
                try {
                    string = JSON.stringify(object, null, "  ");
                } catch (e) {
                    string = toString(object);
                }
            }
            var hints = {copyToClipboard: true, __proto__: null};
            var remoteObject = injectedScript._wrapObject(string, "")
            InjectedScriptHost.inspect(remoteObject, hints);
        }, clear: function () {
            InjectedScriptHost.clearConsoleMessages();
        }, getEventListeners: function (node) {
            var result = nullifyObjectProto(InjectedScriptHost.getEventListeners(node));
            if (!result)
                return;
            function eventListenerOptions(capture, passive) {
                return {"capture": capture, "passive": passive};
            }

            function removeEventListenerWrapper(node, type, listener, capture, passive) {
                node.removeEventListener(type, listener, eventListenerOptions(capture, passive));
            }

            var removeFunc = function () {
                removeEventListenerWrapper(node, this.type, this.listener, this.useCapture, this.passive);
            }
            for (var type in result) {
                var listeners = result[type];
                for (var i = 0, listener; listener = listeners[i]; ++i) {
                    listener["type"] = type;
                    listener["remove"] = removeFunc;
                }
            }
            return result;
        }, debug: function (fn) {
            InjectedScriptHost.debugFunction(fn);
        }, undebug: function (fn) {
            InjectedScriptHost.undebugFunction(fn);
        }, monitor: function (fn) {
            InjectedScriptHost.monitorFunction(fn);
        }, unmonitor: function (fn) {
            InjectedScriptHost.unmonitorFunction(fn);
        }, table: function (data, opt_columns) {
            InjectedScriptHost.callFunction(inspectedGlobalObject.console.table, inspectedGlobalObject.console, slice(arguments));
        }, _inspectedObject: function (num) {
            return InjectedScriptHost.inspectedObject(num);
        }, _normalizeEventTypes: function (types) {
            if (typeof types === "undefined")
                types = ["mouse", "key", "touch", "pointer", "control", "load", "unload", "abort", "error", "select", "input", "change", "submit", "reset", "focus", "blur", "resize", "scroll", "search", "devicemotion", "deviceorientation"]; else if (typeof types === "string")
                types = [types];
            var result = [];
            for (var i = 0; i < types.length; ++i) {
                if (types[i] === "mouse")
                    push(result, "click", "dblclick", "mousedown", "mouseeenter", "mouseleave", "mousemove", "mouseout", "mouseover", "mouseup", "mouseleave", "mousewheel"); else if (types[i] === "key")
                    push(result, "keydown", "keyup", "keypress", "textInput"); else if (types[i] === "touch")
                    push(result, "touchstart", "touchmove", "touchend", "touchcancel"); else if (types[i] === "pointer")
                    push(result, "pointerover", "pointerout", "pointerenter", "pointerleave", "pointerdown", "pointerup", "pointermove", "pointercancel", "gotpointercapture", "lostpointercapture"); else if (types[i] === "control")
                    push(result, "resize", "scroll", "zoom", "focus", "blur", "select", "input", "change", "submit", "reset"); else
                    push(result, types[i]);
            }
            return result;
        }, _logEvent: function (event) {
            inspectedGlobalObject.console.log(event.type, event);
        }
    }
    injectedScript._commandLineAPIImpl = new CommandLineAPIImpl();
    return injectedScript;
})