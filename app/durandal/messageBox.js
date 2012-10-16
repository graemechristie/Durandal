define(["require", "exports"], function(require, exports) {
    var MessageBox = (function () {
        function MessageBox(message, title, options) {
            this.message = message;
            this.title = title;
            this.options = options;
            this.message = message;
            this.title = title || "Application";
            this.options = options || [
                "Ok"
            ];
        }
        MessageBox.prototype.selectOption = function (dialogResult) {
            this.window.close(dialogResult);
        };
        return MessageBox;
    })();
    exports.MessageBox = MessageBox;    
    exports = MessageBox;
})

