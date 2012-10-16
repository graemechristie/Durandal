define(["require", "exports"], function(require, exports) {
    $.ajax;
    function get(url) {
        return $.ajax(url, {
        });
    }
    exports.get = get;
    function post(url, data) {
        return $.ajax(url, {
            data: JSON.stringify(data),
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json'
        });
    }
    exports.post = post;
})

