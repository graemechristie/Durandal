define(function (require) {
    var app = require('durandal/app');

    return {
        displayName: "Hello",
        name: "",
        sayHello: function () {
            app.showMessage("Hello " + this.name, "Greetings");
        },
        canSayHello: app.computed(["name"], function () { return this.name.length > 0; })
    };
});