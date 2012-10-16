declare var window: { require: { config: any; }; };

window.require.config({
    paths: {
        "text": "lib/text"
    }
});

import app = module('durandal/app');

app.start().then(()=> {
    app.makeFit();
    app.setRoot('samples/Navigation/shell');
});