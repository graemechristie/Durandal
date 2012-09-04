require.config({
    paths: {
        "text": "lib/text"
    }
});

define(function (require) {
    var app = require('durandal/app');

    app.start().then(function () {
        app.makeFit();
        debugger;
        app.setRoot('samples/hello/shell', 'applicationHost');
    });
});