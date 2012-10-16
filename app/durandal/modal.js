define(["require", "exports", "durandal/system", "durandal/viewModelBinder"], function(require, exports, __system__, __viewModelBinder__) {
    var system = __system__;

    var viewModelBinder = __viewModelBinder__;

    var zIndex = 1000;
    function getNextZIndex() {
        return ++zIndex;
    }
    ; ;
    var ModalWindow = (function () {
        function ModalWindow(settings) {
            this.settings = settings || {
            };
        }
        ModalWindow.prototype.open = function () {
            var body = $('body');
            var viewElement = this.settings.view;
            this.dfd = system.defer();
            this.$view = $(viewElement);
            this.$fadeLayer = $('<div class="fade"></div>');
            if(this.settings.viewModel) {
                viewModelBinder.bind(this.settings.viewModel, viewElement);
                this.settings.viewModel.window = this;
            }
            var docWidth = $(document).width();
            var docHeight = $(document).height();

            this.$fadeLayer.css({
                'z-index': getNextZIndex(),
                'width': docWidth,
                'height': docHeight
            }).appendTo(body);
            var scrollTop = $(window).scrollTop();
            this.$view.addClass("popup").addClass("fadable").appendTo(body);
            this.$view.css({
                'top': ((($(window).height() / 2) - (this.$view.height() / 2)) + scrollTop) + 'px',
                'left': (($(document).width() / 2) - (this.$view.width() / 2)) + 'px',
                'z-index': getNextZIndex(),
                'opacity': 1
            });
            if(this.settings.viewModel && this.settings.viewModel.viewAttached) {
                this.settings.viewModel.viewAttached(this.settings.view);
            }
            return this.dfd.promise();
        };
        ModalWindow.prototype.close = function (dialogResult) {
            var _this = this;
            this.$fadeLayer.css({
                'opacity': 0
            });
            this.$view.css({
                'opacity': 0
            });
            setTimeout(function () {
                _this.$fadeLayer.remove();
                delete _this.$fadeLayer;
                _this.$view.remove();
                delete _this.$view;
                _this.dfd.resolve(dialogResult);
            }, 300);
        };
        return ModalWindow;
    })();
    exports.ModalWindow = ModalWindow;    
})

