/// <reference path="../lib/jquery.d.ts" />

import system = module("durandal/system");
import viewModelBinder = module("durandal/viewModelBinder");

var zIndex = 1000;

function getNextZIndex() {
    return ++zIndex;
};

export class ModalWindow {

    public settings: any;

    private dfd: JQueryDeferred;
    private $view: JQuery;
    private $fadeLayer: JQuery;

    constructor (settings: any) {
        this.settings = settings || {};
    }


    public open(): JQueryPromise {
        var body = $('body');
        var viewElement = this.settings.view;

        this.dfd = system.defer();
        this.$view = $(viewElement);
        this.$fadeLayer = $('<div class="fade"></div>');

        if (this.settings.viewModel) {
            viewModelBinder.bind(this.settings.viewModel, viewElement);
            this.settings.viewModel.window = this;
        }

        var docWidth = $(document).width(),
            docHeight = $(document).height();

        this.$fadeLayer
            .css({
                'z-index': getNextZIndex(),
                'width': docWidth,
                'height': docHeight
            })
            .appendTo(body);

        var scrollTop = $(window).scrollTop();

        this.$view
            .addClass("popup")
            .addClass("fadable")
            .appendTo(body);

        this.$view
            .css({
                'top': ((($(window).height() / 2) - (this.$view.height() / 2)) + scrollTop) + 'px',
                'left': (($(document).width() / 2) - (this.$view.width() / 2)) + 'px',
                'z-index': getNextZIndex(),
                'opacity': 1
            });

        if (this.settings.viewModel && this.settings.viewModel.viewAttached) {
            this.settings.viewModel.viewAttached(this.settings.view);
        }

        return this.dfd.promise();
    }

    public close(dialogResult) {
        this.$fadeLayer.css({ 'opacity': 0 });
        this.$view.css({ 'opacity': 0 });

        setTimeout(() => {
            this.$fadeLayer.remove();
            delete this.$fadeLayer;

            this.$view.remove();
            delete this.$view;

            this.dfd.resolve(dialogResult);
        }, 300);
    }
}