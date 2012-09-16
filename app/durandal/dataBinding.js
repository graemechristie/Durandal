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

    
    var getProperty = function (model, property) {
        var value = model[property];

        if (typeof value === "function" && typeof value.__computed__ === "object") {
            return value.call(model);
        };

        return value;
    };

    var setProperty = function (model, property, value) {
        if (typeof model[property] === "function") {
            throw "Attempt to assign to computed property or function '"+expression+"'";
        };

        if (typeof model[property] === "undefined") {
            throw "Attempt to assign unknown property '" + expression + "'";
        };

        model[property] = value;
    };


    var bind = function (model, expression, updateFunction) {
        var value = model[expression];

        updateFunction.call();

        // Computed observable binding
        if (typeof value === "function" && typeof value.__computed__ === "object") {
            $.each(value.__computed__.deps, function (i, dep) {
                // Dependancy on value in this view model, dep is a simple string property name
                if (typeof dep === "string") {
                    model.__bindings__[dep] = model.__bindings__[dep] || [];
                    model.__bindings__[dep].push(updateFunction);
                    return;
                }
                // Dependancy on value in another observable, { object: foo, property: "bar" }
                if (typeof dep === "object" && typeof dep.object == "object" && typeof dep.property === "string") { // && dep.object is observable
                    dep.object.__bindings__[dep.property] = dep.object.__bindings__[expression] || [];
                    dep.object.__bindings__[dep.property].push(updateFunction);
                    return;
                }
                throw ("Invalid syntax for computed property dependencies.");
            });
            return;
        }

        // Otherwise regular property

        model.__bindings__[expression] = model.__bindings__[expression] || [];
        model.__bindings__[expression].push(updateFunction);
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
                updateFunction = function () { composition.compose(element, getProperty(model, composeExpression), model); };
                bind(model, composeExpression, updateFunction);
            });

            $('[data-enable]', node).each(function (index, element) {
                var enableExpression = $(element).data('enable');
                updateFunction = function () {
                    if (getProperty(model, enableExpression)) {
                        $(element).removeAttr('disabled');
                    } else {
                        $(element).attr('disabled', 'disabled');
                    }
                };
                bind(model, enableExpression, updateFunction);
            });


            $('[data-bind]', node).each(function (index, element) {
                var bindingExpression = $(element).data('bind');
                var elementType = $(element).get(0).tagName.toLowerCase();
                var bindingProperty = defaultBinding[elementType] || bindingProperties.html;
                model.__bindings__[bindingExpression] = model.__bindings__[bindingExpression] || [];

                switch (bindingProperty) {
                    case bindingProperties.value:
                        updateFunction = function () {
                            $(element).val(getProperty(model, bindingExpression));
                        };
                        $(element).change(function (e) {
                            setProperty(model, bindingExpression, $(element).val());
                        });
                        $(element).keyup(function (e) {
                            setProperty(model, bindingExpression, $(element).val());
                        });
                        break;
                    case bindingProperties.html:
                        updateFunction = function () { $(element).html(getProperty(model, bindingExpression)); };
                        break;
                    case bindingProperties.click:
                        updateFunction = function () {
                            $(element).unbind('click.dataBinding');
                            $(element).bind('click.dataBinding', function (e) { getProperty(model, bindingExpression).call(model, e); });
                        };
                        break;
                    case bindingProperties.text:
                        updateFunction = function () { $(element).text(getProperty(model, bindingExpression)); };
                        break;
                }
                bind(model, bindingExpression, updateFunction);
            });
        }
    };
});