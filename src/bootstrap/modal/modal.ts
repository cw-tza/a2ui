import * as ng from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subscriber} from "rxjs/Subscriber";
import {share} from "rxjs/operator/share";

@ng.Injectable()
export class Modal {
    constructor (private injector: ng.Injector, private componentResolver: ng.ComponentResolver) {}

    show (component: ng.Type|string, modalParentSelector: string = "[a2modalHolder]", providers?: Array<ng.Type | any[] | any>): Observable<any> {
        let o: Observable<any> = new Observable<any>((sub: Subscriber<any>) => {
            if (!providers) {
                providers = [];
            }
            let modalActions: ModalActions = new ModalActions(sub);
            providers.push({provide: ModalActions, useValue: modalActions});

            this.createComponent(component, providers)
                .then((componentRef: ng.ComponentRef<any>) => {
                    let modalParent: Element = document.querySelector(modalParentSelector);

                    modalParent.appendChild(componentRef.location.nativeElement);

                    let popup: any = (<any>window["$"](componentRef.location.nativeElement));
                    let popupModal: any = popup.modal();

                    let destroyed: boolean = false;

                    let destroy: () => void = () => {
                        if (!destroyed) {
                            destroyed = true;
                            popupModal.modal("hide").data("bs.modal", null);
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
            .then((componentFactory: ng.ComponentFactory) => {
                let injector: ng.ReflectiveInjector = ng.ReflectiveInjector.fromResolvedProviders(
                    ng.ReflectiveInjector.resolve(providers), this.injector);
                return componentFactory.create(injector);
            });
    };
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
