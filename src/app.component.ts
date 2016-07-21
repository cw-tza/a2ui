import * as ng from "@angular/core";
import * as f from "@angular/forms";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {OnInitDirective} from "./on-init/on-init.directive";
import * as cb from "./clipboard/clipbard";
import {WatchDirective} from "./watch/watch.directive";
import {Modal, ModalInstance} from "./bootstrap/modal/modal";
import {MyModalComponent, MY_MODAL_DEPENDENCY} from "./examples/MyModal.component";
import {CrossValidateDirective} from "./cross-validate/cross-validate.directive";
import {ComponentWithInputInsideComponent} from "./examples/component-with-input-inside.component";
import {PopoverDirective} from "./bootstrap/popover/popover.directive";
import {ComponentInsidePopoverComponent} from "./examples/component-inside-popover.component";

@ng.Component({
    selector   : "a2ui-app",
    templateUrl: "src/app.component.html",
    providers  : [Modal],
    directives : [ComponentWithInputInsideComponent]
})
class AppComponent {
    copy: (source: HTMLElement | string) => cb.ClipboardResult = cb.copy;
    cut: (source: HTMLElement | string) => cb.ClipboardResult = cb.cut;
    modalSuccessResult: any;
    modalSuccessError: any;
    modalDone: any;
    ComponentInsidePopoverComponent: any = ComponentInsidePopoverComponent;

    constructor (private modal: Modal) {}

    showModal (): void {
        // noinspection TypeScriptValidateTypes
        this.modal.create({
            component: MyModalComponent,
            providers: [{provide: MY_MODAL_DEPENDENCY, useValue: 42}]
        }).subscribe((instance: ModalInstance) => {
            instance.result.subscribe((result: any) => {
                this.modalSuccessResult = result;
            }, (error: any) => {
                this.modalSuccessError = error;
            }, () => {
                this.modalDone = "Modal is done with us";
            });
        }, (error: any) => {
            this.modalSuccessError = error;
        });
    }
}

bootstrap(AppComponent, [
    {provide: ng.PLATFORM_DIRECTIVES, useValue: OnInitDirective, multi: true},
    {provide: ng.PLATFORM_DIRECTIVES, useValue: WatchDirective, multi: true},
    {provide: ng.PLATFORM_DIRECTIVES, useValue: CrossValidateDirective, multi: true},
    {provide: ng.PLATFORM_DIRECTIVES, useValue: PopoverDirective, multi: true},
    f.provideForms(),
    f.disableDeprecatedForms(),
]);
