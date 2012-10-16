/// <reference path="../lib/jquery.d.ts" />
var isDebugging = true;
var nativeKeys = Object.keys;
var hasOwnProperty = Object.prototype.hasOwnProperty;
    
declare var require;

//see http://patik.com/blog/complete-cross-browser-console-log/
// Tell IE9 to use its built-in console
if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == "object") {
    ["log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"]
        .forEach(function(method) {
            console[method] = this.call(console[method], console);
        }, Function.prototype.bind);
}

export function debug(enable: bool) : bool {
    if (arguments.length == 1) {
        isDebugging = enable;
        if (isDebugging) {
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

export function log(...args: any[]) {
    if (!isDebugging) {
        return;
    }

    // Modern browsers
    if (typeof console != 'undefined' && typeof console.log == 'function') {

        // Opera 11
        if (window["opera"]) {
            var i = 0;
            while (i < args.length) {
                console.log("Item " + (i + 1) + ": " + args[i]);
                i++;
            }
        }

        // All other modern browsers
        else if ((Array.prototype.slice.call(args)).length == 1 && typeof Array.prototype.slice.call(args)[0] == 'string') {
            console.log((Array.prototype.slice.call(args)).toString());
        } else {
            console.log(Array.prototype.slice.call(args));
        }

    }

    // IE8
    else if (!Function.prototype.bind && typeof console != 'undefined' && typeof console.log == 'object') {
        Function.prototype.call.call(console.log, console, Array.prototype.slice.call(args));
    }

    // IE7 and lower, and other old browsers
    else {
        // Inject Firebug lite
        if (!document.getElementById('firebug-lite')) {
            // Include the script
            var script = document.createElement('script');
            script["type"]= "text/javascript";
            script.id = 'firebug-lite';
            // If you run the script locally, point to /path/to/firebug-lite/build/firebug-lite.js
            script["src"] = 'https://getfirebug.com/firebug-lite.js';
            // If you want to expand the console window by default, uncomment this line
            //document.getElementsByTagName('HTML')[0].setAttribute('debug','true');
            document.getElementsByTagName('HEAD')[0].appendChild(script);
            setTimeout(() => { this.log(Array.prototype.slice.call(args)); }, 2000);
        } else {
            // FBL was included but it hasn't finished loading yet, so try again momentarily
            setTimeout(() => { this.log(Array.prototype.slice.call(args)); }, 500);
        }
    }
}

export function defer(action?: any) : JQueryDeferred {
    return $.Deferred(action);
}

export function guid() : string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function acquire(...args : any[]) : JQueryPromise {
    var modules = Array.prototype.slice.call(args, 0);
    return defer(function(dfd) {
        require(modules, function(...args : any[]) {
            setTimeout(function() {
                dfd.resolve.apply(dfd, args);
            }, 1);
        });
    }).promise();
}

export function has(obj : any, key : string) : bool {
    return hasOwnProperty.call(obj, key);
}

export function keys(obj : any) : string[]  {
    if (nativeKeys) {
        return nativeKeys(obj);
    }

    if (obj !== Object(obj)) {
        throw new TypeError('Invalid object');
    }

    var keys : string[] = [];

    for (var key in obj) {
        if (has(obj, key)) {
            keys[keys.length] = key;
        }
    }

    return keys;
}
