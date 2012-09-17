define({
    'weakmap': [
        {
            isAvailable: function () {
                // test if we have the native Weakmap feature
                return "WeakMap" in window;
            },

            implementation: 'lib/weakmap_native'
        },
        {
            isAvailable: function () {
                // if we end up here, There is no native implementation,
                // so we can just return true.
                return true;
            },

            implementation: 'lib/weakmap_shim'
        }
    ],
    'changesummary': [
        {
            isAvailable: function () {
                // test if we have the native Object.observe functionality
                return "observe" in Object
                    && "Map" in window // Change Summary requires Map and Set functionality
                    && "Set" in window;
            },

            implementation: 'lib/change_summary_native'
        },
        {
            isAvailable: function () {
                // if we end up here, There is no native implementation,
                // so we can just return true.
                return true;
            },

            implementation: 'lib/change_summary_shim'
        }
    ]
});