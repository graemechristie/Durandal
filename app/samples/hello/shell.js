define(function (require) {
    var app = require('durandal/app');

    return {
        displayName: "Hello",
        name: "Phil",
        sayHello: function () {
            app.showMessage("Hello " + this.name, "Greetings");
        },
        canSayHello: function () { return true; }
    };
});