import * as ng from "@angular/core";

@ng.Directive({
    selector: "[a2Upload]",
    outputs: ["onUpload: a2OnUpload"],
    inputs: ["inputs: drop", "options: a2Upload"],
})
export class UploadDirective {
    onUpload: ng.EventEmitter<any> = new ng.EventEmitter<any>();

    set drop(event: any) {
        console.log(event);
        return false;
    }
}

let uploadComponents: LocalUploadDirective[] = [];
let globalDragStartListeners: GlobalUploadDirective[] = [];

@ng.Directive({
    selector: "[a2FileIn]",
    outputs: ["fileIn: a2FileIn"],
})
export class LocalUploadDirective implements ng.AfterContentInit, ng.OnDestroy {
    public mouseIsOver: boolean = false;
    public fileIn: ng.EventEmitter<boolean> = new ng.EventEmitter<boolean>();

    constructor(public ref: ng.ElementRef, public zone: ng.NgZone) {
        ref.nativeElement.addEventListener("dragover", function (event: any): boolean {
            // Element can handle drop event
            event.preventDefault();
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
        let directive: LocalUploadDirective = getLocalUploadDirective(event);
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
        let directive: LocalUploadDirective = uploadComponents.find((d) => {
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

document.addEventListener("drop", (event: DragEvent) => {
    window.clearTimeout(dragTimer);

    if (isDragSourceExternalFile(event)) {

        for (let i: number = 0; i < globalDragStartListeners.length; i++) {
            let listener: GlobalUploadDirective = globalDragStartListeners[i];
            listener.mouseIsOver = false;

            listener.zone.run(() => {
                listener.globalFileIn.emit(false);
            });
        }

        for (let i: number = 0; i < uploadComponents.length; i++) {
            let listener: LocalUploadDirective = uploadComponents[i];
            listener.mouseIsOver = false;

            listener.zone.run(() => {
                listener.fileIn.emit(false);
            });
        }
    }

});

function isDragSourceExternalFile(event: DragEvent): boolean {
    let dt: DataTransfer = event.dataTransfer;
    // tslint:disable-next-line
    return dt.types != null && ((<any>dt.types).indexOf ? (<any>dt.types).indexOf('Files') != -1 : dt.types.contains('application/x-moz-file'));
}

function getLocalUploadDirective(event: DragEvent): LocalUploadDirective {
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

export const UPLOAD_DIRECTIVES: ng.Type[] = [UploadDirective, LocalUploadDirective, GlobalUploadDirective];
