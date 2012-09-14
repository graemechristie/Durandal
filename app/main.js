﻿require.config({
    paths: {
        "text": "lib/text"
    }
});

define(function (require) {
    var app = require('durandal/app');
    app.start().then(function () {
        app.makeFit();
        app.setRoot('samples/hello/shell', 'applicationHost');
        //app.setRoot('samples/navigation/shell', 'applicationHost');
    });
});