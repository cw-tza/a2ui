import * as ng from "@angular/core";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import "rxjs/add/operator/share";
import "rxjs/add/operator/cache";

type ModalBackdrop = "static" | boolean;

@ng.Injectable()
export class Modal {
    private rootRef: ng.ViewContainerRef;

    constructor (private injector: ng.Injector,
                 private componentResolver: ng.ComponentResolver,
                 private appRef: ng.ApplicationRef) {}

    create ({
        component, providers = [],
        modalParentSelector,
        keyboard = true,
        show = true,
        backdrop = true
    }: ModalOptions): Observable<ModalInstance> {
        const instanceSubject: Subject<ModalInstance> = new Subject<ModalInstance>();
        const resultSubject: Subject<ModalInstance> = new Subject<ModalInstance>();

        let modalActions: ModalActions = new ModalActions(resultSubject);
        providers.push({provide: ModalActions, useValue: modalActions});

        this.createComponent(component, providers).then((componentRef: ng.ComponentRef<any>) => {
            let modalParent: Element;

            if (modalParentSelector !== undefined) {

                modalParent = document.querySelector(modalParentSelector);

                // tslint:disable-next-line
                if (modalParent === undefined || modalParent === null) {
                    instanceSubject.error("Can not find parent for modal using query: " + modalParentSelector);
                    return;
                }

            } else {
                modalParent = this.getAppRef().element.nativeElement;
            }

            modalParent.appendChild(componentRef.location.nativeElement);

            // tslint:disable-next-line
            let popup: any = (<any>window["$"](componentRef.location.nativeElement.childNodes[0]));
            let popupModal: any = popup.modal({keyboard, show, backdrop});


            let destroy: () => void = () => {
                if (!modalActions.destroyed) {
                    modalActions.destroyed = true;
                    popupModal.modal("hide").data("bs.modal", undefined);
                    componentRef.destroy();
                }
            };

            let bsDestroyEventHandler: () => void = () => {
                if (!modalActions.destroyed) {
                    destroy();
                    modalActions.close(undefined);
                }
            };

            popupModal.on("hidden.bs.modal", bsDestroyEventHandler);

            resultSubject.subscribe(destroy, destroy, destroy);

            instanceSubject.next({
                jqueryElement: popupModal,
                result       : resultSubject,
                discard      : modalActions.discard,
                close        : modalActions.close,
                error        : modalActions.error
            });
        });

        return instanceSubject;
    }

    private createComponent (component: ng.Type|string, providers: Array<ng.Type | any[] | any>): Promise<ng.ComponentRef<any>> {
        return this.componentResolver.resolveComponent(component)
            .then((componentFactory: ng.ComponentFactory<any>) => {
                let injector: ng.ReflectiveInjector = ng.ReflectiveInjector.fromResolvedProviders(
                    ng.ReflectiveInjector.resolve(providers), this.injector);
                return this.getAppRef().createComponent(componentFactory, undefined, injector);
            });
    };

    private getAppRef (): ng.ViewContainerRef {
        // Hack, until fix:
        // https://github.com/angular/angular/issues/9293
        // tslint:disable-next-line
        return <ng.ViewContainerRef>this.appRef["_rootComponents"][0]["_hostElement"].vcRef;
    }
}

export interface ModalOptions {
    component: ng.Type|string;
    providers?: Array<ng.Type | any[] | any>;
    modalParentSelector?: string;
    backdrop?: ModalBackdrop;
    show?: boolean;
    keyboard?: boolean;
}

export interface ModalInstance {
    jqueryElement: any;
    result: Observable<any>;
    discard (): void;
    close (val: any): void;
    error (val: any): void;
}

export class ModalActions {
    constructor (private sub: Subject<any>,
                 public destroyed: boolean = false) {}

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
