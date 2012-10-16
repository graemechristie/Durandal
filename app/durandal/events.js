define(["require", "exports", 'durandal/system'], function(require, exports, __system__) {
    var system = __system__;

    var eventSplitter = /\s+/;
    var Subscription = (function () {
        function Subscription(owner, events) {
            this.owner = owner;
            this.events = events;
        }
        Subscription.prototype.then = function (callback, context) {
            if(!callback) {
                return this;
            }
            var calls = this.owner.callbacks || (this.owner.callbacks = {
            });
            var events = this.events;
            var list;

            for(var i = 0; i < events.length; i++) {
                var current = events[i];
                list = calls[current] || (calls[current] = []);
                list.push(callback, context);
            }
            return this;
        };
        return Subscription;
    })();    
    ; ;
    var Events = (function () {
        function Events() {
            this.callbacks = {
            };
        }
        Events.prototype.on = function (events, callback, context) {
            var calls;
            var event;
            var list;

            events = events.split(eventSplitter);
            if(!callback) {
                return new Subscription(this, events);
            } else {
                calls = this.callbacks;
                while(event = events.shift()) {
                    list = calls[event] || (calls[event] = []);
                    list.push(callback, context);
                }
                return this;
            }
        };
        Events.prototype.off = function (events, callback, context) {
            var event;
            var calls;
            var list;
            var i;

            if(!(calls = this.callbacks)) {
                return this;
            }
            if(!(events || callback || context)) {
                delete this.callbacks;
                return this;
            }
            events = events ? events.split(eventSplitter) : system.keys(calls);
            while(event = events.shift()) {
                if(!(list = calls[event]) || !(callback || context)) {
                    delete calls[event];
                    continue;
                }
                for(i = list.length - 2; i >= 0; i -= 2) {
                    if(!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                        list.splice(i, 2);
                    }
                }
            }
            return this;
        };
        Events.prototype.trigger = function (events) {
            var rest = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                rest[_i] = arguments[_i + 1];
            }
            var event;
            var calls;
            var list;
            var i;
            var length;
            var args;
            var all;
            var rest;

            if(!(calls = this.callbacks)) {
                return this;
            }
            events = events.split(eventSplitter);
            while(event = events.shift()) {
                if(all = calls.all) {
                    all = all.slice();
                }
                if(list = calls[event]) {
                    list = list.slice();
                }
                if(list) {
                    for(i = 0 , length = list.length; i < length; i += 2) {
                        list[i].apply(list[i + 1] || this, rest);
                    }
                }
                if(all) {
                    args = [
                        event
                    ].concat(rest);
                    for(i = 0 , length = all.length; i < length; i += 2) {
                        all[i].apply(all[i + 1] || this, args);
                    }
                }
            }
            return this;
        };
        Events.prototype.proxy = function (events) {
            var _this = this;
            return (function (arg) {
                _this.trigger(events, arg);
            })
        };
        Events.includeIn = function includeIn(targetObject) {
            targetObject.on = Events.prototype.on;
            targetObject.off = Events.prototype.off;
            targetObject.trigger = Events.prototype.trigger;
            targetObject.proxy = Events.prototype.proxy;
        }
        return Events;
    })();
    exports.Events = Events;    
})

