define(["require", "exports", 'durandal/system', 'durandal/viewEngine'], function(require, exports, __system__, __viewEngine__) {
    var system = __system__;

    var viewEngine = __viewEngine__;

    function getTypeName(object) {
        var funcNameRegex = /function (.{1,})\(/;
        var results = (funcNameRegex).exec((object).constructor.toString());
        return (results && results.length > 1) ? results[1] : "";
    }
    function locateViewForModel(model) {
        var view;
        if(model.getView) {
            view = model.getView();
            if(view) {
                return this.locateView(view);
            }
        }
        if(model.viewUrl) {
            return this.locateView(model.viewUrl);
        }
        if(model.__moduleId__) {
            return this.locateView(model.__moduleId__);
        }
        var viewUrl = 'views/' + getTypeName(model);
        return this.locateView(viewUrl);
    }
    exports.locateViewForModel = locateViewForModel;
    function locateView(view) {
        return system.defer(function (dfd) {
            if(typeof view === 'string') {
                if(view.indexOf(viewEngine.viewExtension) != -1) {
                    view = view.substring(0, view.length - viewEngine.viewExtension.length);
                }
                var requireExpression = viewEngine.pluginPath + '!' + view + viewEngine.viewExtension;
                system.acquire(requireExpression).then(function (result) {
                    dfd.resolve(viewEngine.createView(view, result));
                }, null);
            } else {
                dfd.resolve(view);
            }
        }).promise();
    }
    exports.locateView = locateView;
})

