import * as ng from "@angular/core";

@ng.Directive({
    inputs  : ["watch: a2Watch"],
    outputs : ["onChange: a2Change"],
    selector: "[a2Watch]",
})
export class WatchDirective {
    private previousValue: any;
    private lastUpdateTime: Date;
    private first: boolean = true;
    onChange: ng.EventEmitter<any> = new ng.EventEmitter<any>();

    constructor() {
        console.log("Hello");
    }

    set watch (value: any) {
        if (this.first) {
            this.first = false;
            this.lastUpdateTime = new Date();
            this.previousValue = value;
            return;
        }

        this.onChange.emit({old: this.previousValue, lastUpdateTime: this.lastUpdateTime});
        this.lastUpdateTime = new Date();
        this.previousValue = value;
    }
}