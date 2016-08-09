import {Directive, AfterContentInit, OnDestroy, ElementRef} from "@angular/core";

let uploadComponents: UploadDirective[] = [];

@Directive({
    selector: "a2Upload, [a2Upload]"
})
export class UploadDirective implements AfterContentInit, OnDestroy {
    public mouseIsOver: boolean = false;

    constructor (public ref: ElementRef) {}

    ngAfterContentInit (): void {
        uploadComponents.push(this);
    }

    ngOnDestroy (): void {
        uploadComponents.splice(uploadComponents.indexOf(this), 1);
    };
}

let dragTimer: number;

document.addEventListener("dragover", (event: DragEvent) => {
    window.clearTimeout(dragTimer);
    if (isDragSourceExternalFile(event)) {
        // Start drag file
        let directive: UploadDirective = getUploadDirective(event);
        if (directive !== undefined) {

            if (!directive.mouseIsOver) {
                // directive.
            }

            // Element can handle upload
            return false;
        }
    }
});

document.addEventListener("dragleave", (event: DragEvent) => {
    window.clearTimeout(dragTimer);

    dragTimer = window.setTimeout(() => {
        // End file drag
    }, 80);
});

function isDragSourceExternalFile (event: DragEvent): boolean {
    let dt: DataTransfer = event.dataTransfer;
    // tslint:disable-next-line
    return dt.types != null && ((<any>dt.types).indexOf ? (<any>dt.types).indexOf('Files') != -1 : dt.types.contains('application/x-moz-file'));
}

function getUploadDirective (event: DragEvent): UploadDirective {
    return uploadComponents.find((d) => d.ref.nativeElement === event.target);
}
