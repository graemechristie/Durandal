define(["require", "exports", 'durandal/system'], function(require, exports, __system__) {
    var system = __system__;

    function ready() {
        return system.defer(function (dfd) {
            $(function () {
                dfd.resolve();
            });
        }).promise();
    }
    exports.ready = ready;
    function getElementById(id) {
        return document.getElementById(id);
    }
    exports.getElementById = getElementById;
    function createElement(tagName) {
        return document.createElement(tagName);
    }
    exports.createElement = createElement;
    function parseHTML(html) {
        return $(html).get(0);
    }
    exports.parseHTML = parseHTML;
})

