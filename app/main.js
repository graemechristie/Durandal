define(["require", "exports", 'durandal/app'], function(require, exports, __app__) {
    window.require.config({
        paths: {
            "text": "lib/text"
        }
    });
    var app = __app__;

    app.start().then(function () {
        app.makeFit();
        app.setRoot('samples/Navigation/shell');
    });
})

