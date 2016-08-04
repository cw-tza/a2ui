import * as ng from "@angular/core";

@ng.Directive({
    selector: "[a2Dropdown]",
    exportAs: "dropdown"
})
export class Dropdown {
    constructor() {
        console.log("dropdown");
    }

    toggle() {

    }
}