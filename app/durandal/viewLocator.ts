/// <reference path="../lib/jquery.d.ts" />

import system = module('durandal/system');
import viewEngine = module('durandal/viewEngine');

function getTypeName(object) {
    var funcNameRegex = /function (.{1,})\(/;
    var results = (funcNameRegex).exec((object).constructor.toString());
    return (results && results.length > 1) ? results[1] : "";
}

export function locateViewForModel(model: any) : JQueryPromise {
    var view;

    if (model.getView) {
        view = model.getView();
        if (view) {
            return this.locateView(view);
        }
    }

    if (model.viewUrl) {
        return this.locateView(model.viewUrl);
    }

    if (model.__moduleId__) {
        return this.locateView(model.__moduleId__);
    }

    var viewUrl = 'views/' + getTypeName(model);
    return this.locateView(viewUrl);
}

export function locateView(view : any) : JQueryPromise  {
    return system.defer(function (dfd) {
        if (typeof view === 'string') {
            if (view.indexOf(viewEngine.viewExtension) != -1) {
                view = view.substring(0, view.length - viewEngine.viewExtension.length);
            }

            var requireExpression = viewEngine.pluginPath + '!' + view + viewEngine.viewExtension;

            system.acquire(requireExpression).then( (result) => {
                dfd.resolve(viewEngine.createView(view, result));
            }, null);
        } else {
            dfd.resolve(view);
        }
    }).promise();
}
