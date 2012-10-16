define(["require", "exports", 'durandal/viewLocator', 'durandal/viewModelBinder', 'durandal/viewEngine', 'durandal/system'], function(require, exports, __viewLocator__, __viewModelBinder__, __viewEngine__, __system__) {
    var viewLocator = __viewLocator__;

    var viewModelBinder = __viewModelBinder__;

    var viewEngine = __viewEngine__;

    var system = __system__;

    function switchContent(parent, newChild, settings) {
        if(!newChild) {
            $(parent).empty();
        } else {
            $(parent).empty().append(newChild);
            if(settings.model && settings.model.viewAttached) {
                settings.model.viewAttached(newChild);
            }
        }
    }
    exports.switchContent = switchContent;
    function defaultStrategy(settings) {
        return viewLocator.locateViewForModel(settings.model);
    }
    exports.defaultStrategy = defaultStrategy;
    function getSettings(valueAccessor) {
        var settings = {
        };
        var value = ko.utils.unwrapObservable(valueAccessor()) || {
        };

        if(typeof value == 'string') {
            settings = value;
        } else {
            for(var attrName in value) {
                if(typeof attrName == 'string') {
                    var attrValue = ko.utils.unwrapObservable(value[attrName]);
                    settings[attrName] = attrValue;
                }
            }
        }
        return settings;
    }
    exports.getSettings = getSettings;
    function executeStrategy(element, settings) {
        settings.strategy(settings).then(function (view) {
            viewModelBinder.bind(settings.model, view);
            switchContent(element, view, settings);
        });
    }
    exports.executeStrategy = executeStrategy;
    function inject(element, settings) {
        if(!settings.model) {
            switchContent(element, null, settings);
            return;
        }
        if(settings.view) {
            viewLocator.locateView(settings.view).then(function (view) {
                viewModelBinder.bind(settings.model, view);
                switchContent(element, view, settings);
            });
            return;
        }
        if(!settings.strategy) {
            settings.strategy = defaultStrategy;
        }
        if(typeof settings.strategy == 'string') {
            system.acquire(settings.strategy).then(function (strategy) {
                settings.strategy = strategy;
                executeStrategy(element, settings);
            });
        } else {
            executeStrategy(element, settings);
        }
    }
    exports.inject = inject;
    function compose(element, settings, fallbackModel) {
        if(typeof settings == 'string') {
            if(settings.indexOf(viewEngine.viewExtension, settings.length - viewEngine.viewExtension.length) !== -1) {
                settings = {
                    view: settings
                };
            } else {
                settings = {
                    model: settings
                };
            }
        }
        if(settings && settings.__moduleId__) {
            settings = {
                model: settings
            };
        }
        if(!settings.model) {
            if(!settings.view) {
                switchContent(element, null, settings);
            } else {
                viewLocator.locateView(settings.view).then(function (view) {
                    viewModelBinder.bind(fallbackModel || {
                    }, view);
                    switchContent(element, view, settings);
                });
            }
        } else {
            if(typeof settings.model == 'string') {
                system.acquire(settings.model).then(function (module) {
                    settings.model = module;
                    inject(element, settings);
                });
            } else {
                inject(element, settings);
            }
        }
    }
    exports.compose = compose;
    ko.bindingHandlers.compose = {
        update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var settings = getSettings(valueAccessor);
            compose(element, settings, viewModel);
        }
    };
})

