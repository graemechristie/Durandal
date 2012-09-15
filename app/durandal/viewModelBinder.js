define(function (require) {
    var system = require('durandal/system');
    var dataBinding = require('durandal/dataBinding');

    return {
        bind: function (model, view) {
            system.log("Binding", model, view);

            dataBinding.applyBindings(model, view);
            if (model.setView) {
                model.setView(view);
            }
        }
    };
});