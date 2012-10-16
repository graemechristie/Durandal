export class MessageBox  {
    public window: any;

    constructor (public message : string, public title : string, public options: any) {
        this.message = message;
        this.title = title || "Application";
        this.options = options || ["Ok"];
    }

    public selectOption(dialogResult : any) {
        this.window.close(dialogResult);
    }
}

declare var exports: any;
exports = MessageBox;