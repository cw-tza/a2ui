import * as ng from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/Subscriber";
import "rxjs/add/operator/share";
import "rxjs/add/operator/cache";

type ModalBackdrop = "static" & boolean;

@ng.Injectable()
export class Modal {
    constructor (private injector: ng.Injector, private componentResolver: ng.ComponentResolver) {}

    show (component: ng.Type|string, providers: Array<ng.Type | any[] | any> = [], modalParentSelector: string = "[a2modalHolder]"): Observable<any> {
        let o: Observable<any> = new Observable<any>((sub: Subscriber<any>) => {
            let modalActions: ModalActions = new ModalActions(sub);
            providers.push({provide: ModalActions, useValue: modalActions});

            this.createComponent(component, providers)
                .then((componentRef: ng.ComponentRef<any>) => {
                    let modalParent: Element = document.querySelector(modalParentSelector);
                    // tslint:disable-next-line
                    if (modalParent === undefined || modalParent === null) {
                        sub.error("Can not find parent for modal using query: " + modalParentSelector);
                        return;
                    }
                    modalParent.appendChild(componentRef.location.nativeElement);

                    // tslint:disable-next-line
                    let popup: any = (<any>window["$"](componentRef.location.nativeElement.childNodes[0]));
                    let popupModal: any = popup.modal();

                    let destroyed: boolean = false;

                    let destroy: () => void = () => {
                        if (!destroyed) {
                            destroyed = true;
                            popupModal.modal("hide").data("bs.modal", undefined);
                            componentRef.destroy();
                        }
                    };

                    popupModal.on("hidden.bs.modal", destroy);

                    o.subscribe(destroy, destroy, destroy);
                });

        }).share().cache(1);
        return o;
    }

    private createComponent (component: ng.Type|string, providers: Array<ng.Type | any[] | any>): Promise<ng.ComponentRef<any>> {
        return this.componentResolver.resolveComponent(component)
            .then((componentFactory: ng.ComponentFactory<any>) => {
                let injector: ng.ReflectiveInjector = ng.ReflectiveInjector.fromResolvedProviders(
                    ng.ReflectiveInjector.resolve(providers), this.injector);
                return componentFactory.create(injector);
            });
    };
}


export interface ModalOptions {
    component: ng.Type|string;
    providers: Array<ng.Type | any[] | any>;
    modalParentSelector: string;
    backdrop: ModalBackdrop;
}


export class ModalInstance {

}

export class ModalActions {
    constructor (private sub: Subscriber<any>) {}

    discard (): void {
        this.sub.complete();
    };

    close (val: any): void {
        this.sub.next(val);
        this.sub.complete();
    };

    error (val: any): void {
        this.sub.error(val);
    }
}
