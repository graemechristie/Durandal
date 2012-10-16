/// <reference path="../lib/jquery.d.ts" />

import system = module('durandal/system');

export function ready() : JQueryPromise {
    return system.defer(function(dfd) {
        $(function() {
            dfd.resolve();
        });
    }).promise();
}

export function getElementById(id : string) : HTMLElement {
    return document.getElementById(id);
}

export function createElement(tagName: string) : HTMLElement {
    return document.createElement(tagName);
}

export function parseHTML(html : string) : HTMLElement {
    return $(html).get(0);
}
