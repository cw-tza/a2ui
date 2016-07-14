import * as ng from "@angular/core";
import {ModalActions} from "../bootstrap/modal/modal";

export const MY_MODAL_DEPENDENCY: ng.OpaqueToken = new ng.OpaqueToken("myModalDependency");

@ng.Component({
    selector: "my-modal",
    templateUrl: "src/examples/MyModal.component.html"
})
export class MyModalComponent {
    constructor(public actions: ModalActions, @ng.Inject(MY_MODAL_DEPENDENCY) public dynamicDependency: any) {}

    discard(): void {
        this.actions.discard();
    }

    close(): void {
        this.actions.close({"my": "data to return from popup"});
    }

    error(): void {
        this.actions.error({"close": "with error data"});
    }
}
