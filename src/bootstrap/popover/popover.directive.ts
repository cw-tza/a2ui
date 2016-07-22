import * as ng from "@angular/core";

// tslint:disable-next-line
const $: any = window["$"];

@ng.Directive({
    selector: "[a2Popover]",
    exportAs: "popover",
    inputs: ["options: a2Popover"]
})
export class PopoverDirective {
    options: {type?: ng.Type, provides?: Array<any>, bs?: any};
    private shown: boolean = false;
    private popover: any;
    private component: ng.ComponentRef<any>;

    constructor (private vcr: ng.ViewContainerRef,
                 private componentResolver: ng.ComponentResolver,
                 private injector: ng.Injector) {}

    toggle (): void {
        if (this.shown) {
            this.destroy();
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
            let bs: any = this.options.bs || {};
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

            this.popover = $(this.vcr.element.nativeElement).popover(opts);
            this.popover.popover("show");
            this.popover.on("hidden.bs.popover", () => {
                if (this.component) {
                    this.component.destroy();
                    this.component = undefined;
                }
            });
        });
    }

    destroy (): void {
        if (!this.shown) {
            return;
        }
        this.shown = false;

        this.popover.popover("destroy");
    }

    createComponent (): Promise<any> {
        if (this.options.bs.content) {
            return Promise.resolve(this.options.bs.content);
        }
        return this.factory(this.options.type, this.options.provides)
            .then((component: ng.ComponentRef<any>) => {
                this.component = component;
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
            });
    }
}
