import * as ng from "@angular/core";

@ng.Directive({
    inputs  : ["watch: a2Watch"],
    outputs : ["onChange: a2Change"],
    selector: "[a2Watch]",
})
export class WatchDirective {
    onChange: ng.EventEmitter<any> = new ng.EventEmitter<any>();
    private previousValue: any;
    private lastUpdateTime: Date;
    private first: boolean = true;

    set watch (value: any) {
        if (this.first) {
            this.first = false;
            this.lastUpdateTime = new Date();
            this.previousValue = value;
            return;
        }

        this.onChange.emit({lastUpdateTime: this.lastUpdateTime, old: this.previousValue});
        this.lastUpdateTime = new Date();
        this.previousValue = value;
    }
}
