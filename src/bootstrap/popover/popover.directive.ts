import * as ng from "@angular/core";

@ng.Directive({
    selector: "[a2Popover]",
    exportAs: "popover",
    inputs  : ["options: a2Popover"]
})
export class PopoverDirective {
    options: {type?: ng.Type, provides?: Array<any>, bs?: any};
    private shown: boolean = false;

    constructor (private ref: ng.ElementRef,
                 private vcr: ng.ViewContainerRef,
                 private componentResolver: ng.ComponentResolver,
                 private injector: ng.Injector) {}

    toggle (): void {
        if (this.shown) {
            this.hide();
        } else {
            this.show();
        }
    }

    show (): void {
        if (this.shown) {
            return;
        }
        this.shown = true;

        this.createComponent().then((content: any) => {
            let opts: any = {};
            let bs = this.options.bs || {};
            opts.animation = bs.animation;
            opts.container = bs.container;
            opts.delay = bs.delay;
            opts.html = bs.html || true;
            opts.content = content;
            opts.placement = bs.placement;
            opts.selector = bs.selector;
            opts.template = bs.template;
            opts.title = bs.title;
            opts.trigger = bs.trigger;
            opts.viewport = bs.viewport;

            let jqPopover: any = $(this.ref.nativeElement).popover(opts);
            jqPopover.popover('show');
        });
    }

    hide (): void {
        if (!this.shown) {
            return;
        }

        this.shown = false;
    }

    createComponent (): Promise<any> {
        if (this.options.bs.content) {
            return Promise.resolve(this.options.bs.content);
        }
        return this.factory(this.options.type, this.options.provides)
            .then((component: ng.ComponentRef<any>) => {
                return component.location.nativeElement;
            });
    }

    private factory (component: ng.Type|string, providers: Array<any> = []): Promise<ng.ComponentRef<any>> {
        if (!Array.isArray(providers)) {
            providers = [providers];
        }
        return this.componentResolver.resolveComponent(component)
            .then((componentFactory: ng.ComponentFactory<any>) => {
                let injector: ng.ReflectiveInjector = ng.ReflectiveInjector.fromResolvedProviders(
                    ng.ReflectiveInjector.resolve(providers), this.injector);
                return this.vcr.createComponent(componentFactory, undefined, injector);
                // return componentFactory.create(injector);
            });
    }
}


// tslint:disable-next-line
const $: any = window["$"];