import system = module('durandal/system');

declare var ko;

export function bind(model :any, view: any) {
    system.log("Binding", model, view);
            
    ko.applyBindings(model, view);
    if (model.setView) {
        model.setView(view);
    }
}
