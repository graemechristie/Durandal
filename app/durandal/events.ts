//heavily borrowed from backbone events, augmented by signal.js, added a little of my own code, cleaned up for better readability

import system = module('durandal/system');

var eventSplitter = /\s+/;

class Subscription implements IEvent {
    constructor(public owner : Events, public events : any[]) { }

    public then(callback? : any, context? : any) : Subscription {
        if (!callback) {
            return this;
        }

        var calls = this.owner.callbacks || (this.owner.callbacks = {});
        var events = this.events, list;

        for (var i = 0; i < events.length; i++) {
            var current = events[i];

            list = calls[current] || (calls[current] = []);
            list.push(callback, context);
        }

        return this;
    }
}

export interface IEvent {
    on? : (events : any, callback :any , context: any)=>IEvent;
    off? : (events : any, callback :any , context: any)=>IEvent;
    trigger? : (events : any, ...rest : any[]) => IEvent;
    proxy? : (arg: any)=>void;
    then?: (callback? : any, context? : any)=>Subscription;
};

export class Events implements IEvent {

    public callbacks : any = {};

    public on (events, callback, context) : IEvent {
        var calls, event, list;
        events = events.split(eventSplitter);

        if (!callback) {
            return new Subscription(this, events);
        } else {
            calls = this.callbacks;

            while (event = events.shift()) {
                list = calls[event] || (calls[event] = []);
                list.push(callback, context);
            }

            return this;
        }
    }

    public off (events, callback, context) : IEvent {
        var event, calls, list, i;

        // No events
        if (!(calls = this.callbacks)) {
            return this;
        }

        //removing all
        if (!(events || callback || context)) {
            delete this.callbacks;
            return this;
        }

        events = events ? events.split(eventSplitter) : system.keys(calls);

        // Loop through the callback list, splicing where appropriate.
        while (event = events.shift()) {
            if (!(list = calls[event]) || !(callback || context)) {
                delete calls[event];
                continue;
            }

            for (i = list.length - 2; i >= 0; i -= 2) {
                if (!(callback && list[i] !== callback || context && list[i + 1] !== context)) {
                    list.splice(i, 2);
                }
            }
        }

        return this;
    }

    public trigger (events : any, ...rest : any[]) : IEvent {
        var event, calls, list, i, length, args, all, rest;
        if (!(calls = this.callbacks)) {
            return this;
        }

        events = events.split(eventSplitter);

        // For each event, walk through the list of callbacks twice, first to
        // trigger the event, then to trigger any `"all"` callbacks.
        while (event = events.shift()) {
            // Copy callback lists to prevent modification.
            if (all = calls.all) {
                all = all.slice();
            }

            if (list = calls[event]) {
                list = list.slice();
            }

            // Execute event callbacks.
            if (list) {
                for (i = 0, length = list.length; i < length; i += 2) {
                    list[i].apply(list[i + 1] || this, rest);
                }
            }

            // Execute "all" callbacks.
            if (all) {
                args = [event].concat(rest);
                for (i = 0, length = all.length; i < length; i += 2) {
                    all[i].apply(all[i + 1] || this, args);
                }
            }
        }

        return this;
    }

    public proxy(events:any) : (arg: any)=>void {
        return ((arg) => {
            this.trigger(events, arg);
        });
    } 
    
    public static includeIn(targetObject: any): void {
        targetObject.on = Events.prototype.on;
        targetObject.off = Events.prototype.off;
        targetObject.trigger = Events.prototype.trigger;
        targetObject.proxy = Events.prototype.proxy;
    }   
}




