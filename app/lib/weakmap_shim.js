define(function () {
    context = window;

    // (C) WebReflection - Mit Style License
    // WeakMap(void):WeakMap
    function WeakMap() {

        // private references holders
        var keys = [],
                values = [];

        // WeakMap#delete(key:void*):void
        function del(key) {
            if (has(key)) {
                keys.splice(i, 1);
                values.splice(i, 1);
            }
            return -1 < i;
        }

        // WeakMap#get(key:void*[, d3fault:void*]):void*
        function get(key, d3fault) {
            return has(key) ? values[i] : d3fault;
        }

        // WeakMap#has(key:void*):boolean
        function has(key) {
            if (key !== Object(key))
                throw new TypeError("not a non-null object")
          ;
            i = indexOf.call(keys, key);
            return -1 < i;
        }

        // WeakMap#has(key:void*, value:void*):void
        function set(key, value) {
            has(key) ?
            values[i] = value
            :
            values[keys.push(key) - 1] = value
          ;
        }

        // returns freshly new created
        // instanceof WeakMap in any case
        return create(WeakMapPrototype, {
            "delete": { value: del },
            get: { value: get },
            has: { value: has },
            set: { value: set }
        });

    }

    // need for an empty constructor ...
    function WeakMapInstance() { }  // GC'ed if !!Object.create
    // ... so that new WeakMapInstance and new WeakMap
    // produces both an instanceof WeakMap

    var 
    // shortcuts and ...
        Object = context.Object,
        WeakMapPrototype = WeakMap.prototype,

    // partial polyfill for this aim only
        create = Object.create || function create(proto, descriptor) {
            // partial ad-hoc Object.create shim if not available
            var object = new WeakMapInstance;
            object["delete"] = descriptor["delete"].value;
            object.get = descriptor.get.value;
            object.has = descriptor.has.value;
            object.set = descriptor.set.value;
            return object;
        },

        indexOf = [].indexOf || function indexOf(value) {
            // partial fast Array#indexOf polyfill if not available
            for (i = this.length; i-- && this[i] !== value; );
            return i;
        },

        i // recycle ALL the variables !
      ;

    // used to follow FF behavior where WeakMap.prototype is a WeakMap itself
    WeakMap.prototype = WeakMapInstance.prototype = WeakMapPrototype = WeakMap();

    // assign it to the global context
    "defineProperty" in Object ?
        Object.defineProperty(context, "WeakMap", { value: WeakMap })
        :
        context.WeakMap = WeakMap
      ;

    return WeakMap;

    // that's pretty much it in less than 400bytes minzipped

});