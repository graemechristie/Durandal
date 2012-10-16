/// <reference path="../lib/jquery.d.ts" />

import dom = module('durandal/dom');


export var viewExtension = '.html';

export var pluginPath = 'text';

export function createView(name : string, text : string) : HTMLElement {
    var element = dom.parseHTML(text);
    element.setAttribute('data-view', name);
    return element;
}

