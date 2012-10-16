/// <reference path="../lib/jquery.d.ts" />
/// <reference path="../lib/fix.d.ts" />

import system = module('durandal/system');
import viewLocator = module('durandal/viewLocator');
import composition = module('durandal/composition');
import dom = module('durandal/dom');
import modal = module('durandal/modal');
import MessageBox = module('durandal/messageBox');
import events = module('durandal/events');

// Currently typescript/ES 6 doesn't support modules as classes, ugly workaround follows.
var Modal = modal.ModalWindow;
var Events = events.Events;

export function showModal(viewModel : any) : JQueryPromise {
    return system.defer(dfd => {
        viewLocator.locateViewForModel(viewModel)
            .then(view => {
                new Modal({
                    view: view,
                    viewModel: viewModel
                }).open().then(dfd.resolve);
            });
    }).promise();
}

export function showMessage(message : string, title : string, options: any) : JQueryPromise {
    return this.showModal(new MessageBox(message, title, options));
}

export function start() : JQueryPromise {
    return system.defer(dfd => {
        system.debug($('meta[name=debug]').attr('content') === 'true');
        dom.ready().then(() => {
            system.log('Starting Application');
            dfd.resolve();
            system.log('Started Application');
        });
    }).promise();
}

export function setRoot(shell : any, applicationHost? : string) {
    var hostElement = dom.getElementById(applicationHost || 'applicationHost');
    composition.compose(hostElement, shell);
}

export function makeFit() {
    

    if (document.body.ontouchmove) {
        document.body.ontouchmove = function(event) {
            event.preventDefault();
        };
    }

    if (document.body.onorientationchange) {
        document.body.onorientationchange = function(event) {

        };
    }
}

// Typescript kludge for module level mixin .... TODO: Refactor this

declare export var on : events.IEvent;
declare export var off : events.IEvent;
declare export var trigger : events.IEvent;
declare export var proxy : (arg: any)=>void;

Events.includeIn(this); // this shows an error but actually compiles fine
