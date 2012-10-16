define(["require", "exports", 'durandal/dom'], function(require, exports, __dom__) {
    var dom = __dom__;

    exports.viewExtension = '.html';
    exports.pluginPath = 'text';
    function createView(name, text) {
        var element = dom.parseHTML(text);
        element.setAttribute('data-view', name);
        return element;
    }
    exports.createView = createView;
})

