import * as ng from "@angular/core";
import {bootstrap} from "@angular/platform-browser-dynamic";

import {OnInitDirective} from "./on-init/on-init.directive";
import * as cb from "./clipboard/clipbard";
import {WatchDirective} from "./watch/watch.directive";
import {Modal} from "./bootstrap/modal/modal";
import {MyModalComponent, MY_MODAL_DEPENDENCY} from "./examples/MyModal.component";

@ng.Component({
    selector: "a2ui-app",
    templateUrl: "src/app.component.html",
    providers: [Modal]
})
class AppComponent {
    copy: (source: HTMLElement | string) => cb.ClipboardResult = cb.copy;
    cut: (source: HTMLElement | string) => cb.ClipboardResult = cb.cut;
    modalSuccessResult: any;
    modalSuccessError: any;
    modalDone: any;

    constructor (private modal: Modal) {}

    showModal (): void {
        this.modal.show(MyModalComponent, [{provide: MY_MODAL_DEPENDENCY, useValue: 42}])
            .subscribe((result: any) => {
                this.modalSuccessResult = result;
            }, (error: any) => {
                this.modalSuccessError = error;
            }, () => {
                this.modalDone = "Modal is done with us";
            });
    }
}

bootstrap(AppComponent, [
    {provide: ng.PLATFORM_DIRECTIVES, useValue: OnInitDirective, multi: true},
    {provide: ng.PLATFORM_DIRECTIVES, useValue: WatchDirective, multi: true},
]);
