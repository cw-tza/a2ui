import * as ng from "@angular/core";

let uploadComponents: UploadDirective[] = [];
let globalDragStartListeners: GlobalUploadDirective[] = [];

@ng.Directive({
    selector: "[a2FileIn]",
    outputs: ["fileIn: a2FileIn"],
})
export class UploadDirective implements ng.AfterContentInit, ng.OnDestroy {
    public mouseIsOver: boolean = false;
    public fileIn: ng.EventEmitter<boolean> = new ng.EventEmitter<boolean>();

    constructor(public ref: ng.ElementRef, public zone: ng.NgZone) {
        ref.nativeElement.addEventListener("dragover", function (): boolean {
            // Element can handle drop event
            return false;
        });
    }

    ngAfterContentInit(): void {
        uploadComponents.push(this);
    }

    ngOnDestroy(): void {
        uploadComponents.splice(uploadComponents.indexOf(this), 1);
    };
}

@ng.Directive({
    selector: "[a2GlobalFileIn]",
    outputs: ["globalFileIn: a2GlobalFileIn"],
})
export class GlobalUploadDirective implements ng.AfterContentInit, ng.OnDestroy {
    public mouseIsOver: boolean = false;
    public globalFileIn: ng.EventEmitter<boolean> = new ng.EventEmitter<boolean>();

    constructor(public zone: ng.NgZone) {
    }

    ngAfterContentInit(): void {
        globalDragStartListeners.push(this);
    }

    ngOnDestroy(): void {
        globalDragStartListeners.splice(globalDragStartListeners.indexOf(this), 1);
    };
}

let dragTimer: number;

document.addEventListener("dragover", (event: DragEvent) => {

    window.clearTimeout(dragTimer);

    if (isDragSourceExternalFile(event)) {
        // Start drag file
        // console.log(event.target);
        let directive: UploadDirective = getUploadDirective(event);
        if (directive !== undefined) {

            if (directive.mouseIsOver === false) {
                directive.mouseIsOver = true;

                directive.zone.run(() => {
                    directive.fileIn.emit(true);
                });
            }
        }


        for (let i: number = 0; i < globalDragStartListeners.length; i++) {
            let listener: GlobalUploadDirective = globalDragStartListeners[i];
            if (listener.mouseIsOver === false) {
                listener.mouseIsOver = true;

                listener.zone.run(() => {
                    listener.globalFileIn.emit(true);
                });
            }
        }
    }
});

document.addEventListener("dragleave", (event: DragEvent) => {
    window.clearTimeout(dragTimer);

    if (isDragSourceExternalFile(event)) {
        // File drag leave
        let directive: UploadDirective = uploadComponents.find((d) => {
            return event.target === d.ref.nativeElement;
        });

        if (directive !== undefined &&
            (event.target === directive.ref.nativeElement
                || !inSide(<HTMLElement>event.target, directive.ref.nativeElement)
            )) {

            directive.mouseIsOver = false;

            directive.zone.run(() => {
                directive.fileIn.emit(false);
            });

            // Element can handle upload
            return false;
        }
    }

    dragTimer = window.setTimeout(() => {
        for (let i: number = 0; i < globalDragStartListeners.length; i++) {
            let listener: GlobalUploadDirective = globalDragStartListeners[i];
            listener.mouseIsOver = false;

            listener.zone.run(() => {
                listener.globalFileIn.emit(false);
            });
        }
    }, 80);
});

function isDragSourceExternalFile(event: DragEvent): boolean {
    let dt: DataTransfer = event.dataTransfer;
    // tslint:disable-next-line
    return dt.types != null && ((<any>dt.types).indexOf ? (<any>dt.types).indexOf('Files') != -1 : dt.types.contains('application/x-moz-file'));
}

function getUploadDirective(event: DragEvent): UploadDirective {
    return uploadComponents.find((d) => {
        return inSide(<HTMLElement>event.target, d.ref.nativeElement);
    });
}

function inSide(element: Node, container: HTMLElement): boolean {
    if (!(element === container)) {
        if (element !== document.body && element !== null) {
            return inSide(element.parentNode, container);
        } else {
            return false;
        }
    }
    return true;
}
