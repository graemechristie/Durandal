define(["require", "exports", 'durandal/system', 'durandal/viewLocator', 'durandal/composition', 'durandal/dom', 'durandal/modal', 'durandal/messageBox', 'durandal/events'], function(require, exports, __system__, __viewLocator__, __composition__, __dom__, __modal__, __MessageBox__, __events__) {
    var system = __system__;

    var viewLocator = __viewLocator__;

    var composition = __composition__;

    var dom = __dom__;

    var modal = __modal__;

    var MessageBox = __MessageBox__;

    var events = __events__;

    var Modal = modal.ModalWindow;
    var Events = events.Events;
    function showModal(viewModel) {
        return system.defer(function (dfd) {
            viewLocator.locateViewForModel(viewModel).then(function (view) {
                new Modal({
                    view: view,
                    viewModel: viewModel
                }).open().then(dfd.resolve);
            });
        }).promise();
    }
    exports.showModal = showModal;
    function showMessage(message, title, options) {
        return this.showModal(new MessageBox(message, title, options));
    }
    exports.showMessage = showMessage;
    function start() {
        return system.defer(function (dfd) {
            system.debug($('meta[name=debug]').attr('content') === 'true');
            dom.ready().then(function () {
                system.log('Starting Application');
                dfd.resolve();
                system.log('Started Application');
            });
        }).promise();
    }
    exports.start = start;
    function setRoot(shell, applicationHost) {
        var hostElement = dom.getElementById(applicationHost || 'applicationHost');
        composition.compose(hostElement, shell);
    }
    exports.setRoot = setRoot;
    function makeFit() {
        if(document.body.ontouchmove) {
            document.body.ontouchmove = function (event) {
                event.preventDefault();
            };
        }
        if(document.body.onorientationchange) {
            document.body.onorientationchange = function (event) {
            };
        }
    }
    exports.makeFit = makeFit;
    Events.includeIn(this);
})

