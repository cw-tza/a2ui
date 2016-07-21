import * as ng from "@angular/core";
import {Inject} from "@angular/core";

@ng.Component({
    selector   : "component-inside-popover.component",
    templateUrl: "src/examples/component-inside-popover.component.html"
})
export class ComponentInsidePopoverComponent {
    constructor (@Inject(42) public val: any) {}
}
