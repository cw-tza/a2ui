import * as ng from "@angular/core";
import * as f from "@angular/forms";

@ng.Directive({
    selector: "cross-validate,[crossValidate]",
    providers: [{
        provide    : f.ControlContainer,
        useExisting: ng.forwardRef(() => CrossValidateDirective)
    }]
})
export class CrossValidateDirective extends f.ControlContainer {
    constructor (@ng.SkipSelf() public proxied: f.ControlContainer) { super(); }

    get control (): any { return this.proxied.control; }

    get value (): any { return this.proxied.value; }

    get valid (): boolean { return this.proxied.valid; }

    get errors (): any { return this.proxied.errors; }

    get pristine (): boolean { return this.proxied.pristine; }

    get dirty (): boolean { return this.proxied.dirty; }

    get touched (): boolean { return this.proxied.touched; }

    get untouched (): boolean { return this.proxied.untouched; }

    get path (): string[] { return this.proxied.path; }

    get name (): string {return this.proxied.name; }

    get formDirective (): any { return this.proxied.formDirective; }
}
