import * as ng from "@angular/core";

@ng.Directive({
    outputs: ["onInitChange: a2OnInit"],
    selector: "[a2OnInit]",
})
export class OnInitDirective implements ng.OnInit {
    onInitChange: ng.EventEmitter<InitEvent> = new ng.EventEmitter<InitEvent>();

    ngOnInit (): void {
        this.onInitChange.emit({time: new Date()});
    }
}

export interface InitEvent {
    time: Date;
}
