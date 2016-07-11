import * as ng from "@angular/core";

@ng.Directive({
    selector: "[a2OnInit]",
    outputs: ["onInitChange: a2OnInit"]
})
export class OnInitDirective implements ng.OnInit {
    onInitChange: ng.EventEmitter<void> = new ng.EventEmitter<void>();

    ngOnInit (): void {
        this.onInitChange.emit({time: new Date()});
    }
}
