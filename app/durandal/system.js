define(["require", "exports"], function(require, exports) {
    var isDebugging = true;
    var nativeKeys = Object.keys;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    if(Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == "object") {
        [
            "log", 
            "info", 
            "warn", 
            "error", 
            "assert", 
            "dir", 
            "clear", 
            "profile", 
            "profileEnd"
        ].forEach(function (method) {
            console[method] = this.call(console[method], console);
        }, Function.prototype.bind);
    }
    function debug(enable) {
        if(arguments.length == 1) {
            isDebugging = enable;
            if(isDebugging) {
                window["require"].config({
                    urlArgs: 'bust=' + (new Date()).getTime()
                });
                this.log('Debug mode enabled.');
            } else {
                window["require"].config({
                    urlArgs: ''
                });
                this.log('Debug mode disabled.');
            }
        } else {
            return isDebugging;
        }
    }
    exports.debug = debug;
    function log() {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        if(!isDebugging) {
            return;
        }
        if(typeof console != 'undefined' && typeof console.log == 'function') {
            if(window["opera"]) {
                var i = 0;
                while(i < args.length) {
                    console.log("Item " + (i + 1) + ": " + args[i]);
                    i++;
                }
            } else {
                if((Array.prototype.slice.call(args)).length == 1 && typeof Array.prototype.slice.call(args)[0] == 'string') {
                    console.log((Array.prototype.slice.call(args)).toString());
                } else {
                    console.log(Array.prototype.slice.call(args));
                }
            }
        } else {
            if(!Function.prototype.bind && typeof console != 'undefined' && typeof console.log == 'object') {
                Function.prototype.call.call(console.log, console, Array.prototype.slice.call(args));
            } else {
                if(!document.getElementById('firebug-lite')) {
                    var script = document.createElement('script');
                    script["type"] = "text/javascript";
                    script.id = 'firebug-lite';
                    script["src"] = 'https://getfirebug.com/firebug-lite.js';
                    document.getElementsByTagName('HEAD')[0].appendChild(script);
                    setTimeout(function () {
                        _this.log(Array.prototype.slice.call(args));
                    }, 2000);
                } else {
                    setTimeout(function () {
                        _this.log(Array.prototype.slice.call(args));
                    }, 500);
                }
            }
        }
    }
    exports.log = log;
    function defer(action) {
        return $.Deferred(action);
    }
    exports.defer = defer;
    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0;
            var v = c == 'x' ? r : (r & 3 | 8);

            return v.toString(16);
        });
    }
    exports.guid = guid;
    function acquire() {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        var modules = Array.prototype.slice.call(args, 0);
        return defer(function (dfd) {
            require(modules, function () {
                var args = [];
                for (var _i = 0; _i < (arguments.length - 0); _i++) {
                    args[_i] = arguments[_i + 0];
                }
                setTimeout(function () {
                    dfd.resolve.apply(dfd, args);
                }, 1);
            });
        }).promise();
    }
    exports.acquire = acquire;
    function has(obj, key) {
        return hasOwnProperty.call(obj, key);
    }
    exports.has = has;
    function keys(obj) {
        if(nativeKeys) {
            return nativeKeys(obj);
        }
        if(obj !== Object(obj)) {
            throw new TypeError('Invalid object');
        }
        var keys = [];
        for(var key in obj) {
            if(has(obj, key)) {
                keys[keys.length] = key;
            }
        }
        return keys;
    }
    exports.keys = keys;
})

