/// <reference path="../lib/jquery.d.ts" />

import viewLocator = module('durandal/viewLocator');
import viewModelBinder = module('durandal/viewModelBinder');
import viewEngine = module('durandal/viewEngine');
import system = module('durandal/system');

declare var ko : any; // Knockout .. this will probably be factored out, for now we just use the global ko object rather than mess with ko.d.ts reference

export function switchContent(parent : any, newChild : any, settings: any) {
    if (!newChild) {
        $(parent).empty();
    } else {
        $(parent).empty().append(newChild);

        if (settings.model && settings.model.viewAttached) {
            settings.model.viewAttached(newChild);
        }
    }
}

export function defaultStrategy(settings : any) : JQueryPromise {
    return viewLocator.locateViewForModel(settings.model);
}

export function getSettings(valueAccessor : ()=>any) : any {
    var settings = {},
        value = ko.utils.unwrapObservable(valueAccessor()) || {};

    if (typeof value == 'string') {
        settings = value;
    } else {
        for (var attrName in value) {
            if (typeof attrName == 'string') {
                var attrValue = ko.utils.unwrapObservable(value[attrName]);
                settings[attrName] = attrValue;
            }
        }
    }

    return settings;
}

export function executeStrategy (element : HTMLElement, settings: any) : void {
    settings.strategy(settings).then((view) => {
        viewModelBinder.bind(settings.model, view);
        switchContent(element, view, settings);
    });
}

export function inject(element : HTMLElement, settings : any) : void {
    if (!settings.model) {
        switchContent(element, null, settings);
        return;
    }

    if (settings.view) {
        viewLocator.locateView(settings.view).then(view => {
            viewModelBinder.bind(settings.model, view);
            switchContent(element, view, settings);
        });

        return;
    }

    if (!settings.strategy) {
        settings.strategy = defaultStrategy;
    }

    if (typeof settings.strategy == 'string') {
        system.acquire(settings.strategy).then(strategy => {
            settings.strategy = strategy;
            executeStrategy(element, settings);
        });
    } else {
        executeStrategy(element, settings);
    }
}

export function compose(element : HTMLElement, settings : any, fallbackModel? : any) : void {

    if (typeof settings == 'string') {
        if (settings.indexOf(viewEngine.viewExtension, settings.length - viewEngine.viewExtension.length) !== -1) {
            settings = {
                view: settings
            };
        } else {
            settings = {
                model: settings
            };
        }
    }

    if (settings && settings.__moduleId__) {
        settings = {
            model:settings
        };
    }

    if (!settings.model) {
        if (!settings.view) {
            switchContent(element, null, settings);
        } else {
            viewLocator.locateView(settings.view).then(view => {
                viewModelBinder.bind(fallbackModel || {}, view);
                switchContent(element, view, settings);
            });
        }
    } else if (typeof settings.model == 'string') {
        system.acquire(settings.model).then(module =>  {
            //TODO: is it an object or function?
            //if function, call as ctor

            settings.model = module;
            inject(element, settings);
        });
    } else {
        inject(element, settings);
    }
}

ko.bindingHandlers.compose = {
    update: (element, valueAccessor, allBindingsAccessor, viewModel) => {
        var settings = getSettings(valueAccessor);
        compose(element, settings, viewModel);
    }
};


