define(['require', 'durandal/composition'], function (require) {

    var bindingProperties = {
        value: 1,
        text: 2,
        html: 3,
        click: 4
    }

    var defaultBinding = {
        input: bindingProperties.value,
        button: bindingProperties.click
    }

    var observer = new ChangeSummary(function (summaries) {
        summaries.forEach(function (summary) {
            // summary.object; // The object to which this summary describes changes which occurred.
            // summary.newProperties; // An Array of property names which are new since creation, or the previous callback.
            // summary.deletedProperties; // An Array of property names which have been deleted since creation, or the previous callback.
            // summary.arraySplices; // An Array of objects, each of which describes a "splice", if Array.isArray(summary.object).
            // summary.getOldPathValue(path); // A function which returns previous value of the changed path.
            // summary.getNewPathValue(path); // A function which returns the new value (as of callback) of the changed path.

            for (var i in summary.pathValueChanged) {
                var path = summary.pathValueChanged[i];

                if (path.lastIndexOf('__bindings__') !== -1)
                    continue;

                updateFunctions = summary.object.__bindings__[path];
                if (updateFunctions && updateFunctions.length) {
                    for (var j in updateFunctions) {
                        if (typeof updateFunctions[j] == "function") {
                            updateFunctions[j].call();
                        }
                    }
                }
            }
            // An Array of path strings, whose value has changed.

        });
    });

    return {
        applyBindings: function (model, node) {
            window.models = window.models || {}
            window.models[model.__moduleId__ || 'temp'] = model; // very rough .. for debugging in console TODO: Delete me

            model.__bindings__ = model.__bindings__ || {};
            observer.observe(model);
            var composition = require('durandal/composition'); // Circular Ref with viewModelBinder, so require here at runtime

            var updateFunction;

            $('[data-compose]', node).each(function (index, element) {
                var composeExpression = $(element).data('compose');
                updateFunction = function () { composition.compose(element, model[composeExpression], model); };
                updateFunction.call();
                model.__bindings__[composeExpression] = model.__bindings__[composeExpression] || [];
                model.__bindings__[composeExpression].push(updateFunction);
            });


            $('[data-bind]', node).each(function (index, element) {
                var bindingExpression = $(element).data('bind');
                var elementType = $(element).get(0).tagName.toLowerCase();
                var bindingProperty = defaultBinding[elementType] || bindingProperties.html;
                model.__bindings__[bindingExpression] = model.__bindings__[bindingExpression] || [];

                switch (bindingProperty) {
                    case bindingProperties.value:
                        updateFunction = function () {
                            $(element).val(model[bindingExpression]);
                        };
                        $(element).change(function (e) {
                            model[bindingExpression] = $(element).val();
                        });
                        break;
                    case bindingProperties.html:
                        updateFunction = function () { $(element).html(model[bindingExpression]); };
                        break;
                    case bindingProperties.click:
                        updateFunction = function () {
                            $(element).unbind('click.dataBinding');
                            $(element).bind('click.dataBinding', function (e) { model[bindingExpression].call(model, e); });
                        };
                        break;
                    case bindingProperties.text:
                        updateFunction = function () { $(element).text(model[bindingExpression]); };
                        break;
                }

                updateFunction.call();
                model.__bindings__[bindingExpression].push(updateFunction);
            });
        }
    };
});