define(["require", "exports", 'durandal/system'], function(require, exports, __system__) {
    var system = __system__;

    function bind(model, view) {
        system.log("Binding", model, view);
        ko.applyBindings(model, view);
        if(model.setView) {
            model.setView(view);
        }
    }
    exports.bind = bind;
})

