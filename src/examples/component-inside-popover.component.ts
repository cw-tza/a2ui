import {Inject, Component} from "@angular/core";

@Component({
    selector: "component-inside-popover.component",
    templateUrl: "src/examples/component-inside-popover.component.html"
})
export class ComponentInsidePopoverComponent {
    constructor (@Inject(42) public val: any) {}
}
