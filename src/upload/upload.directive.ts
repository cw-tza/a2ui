import {Directive, EventEmitter, AfterContentInit, OnDestroy, NgZone, Type, ElementRef} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";

@Directive({
    selector: "[a2Upload]",
    outputs: ["onUpload: a2OnUpload"],
    inputs: ["options: a2Upload"],
    host: {
        "(drop)": "doUpload($event)"
    }
})
export class UploadDirective {
    private onUpload: EventEmitter<any> = new EventEmitter<Response>();
    private options: any = {};

    constructor(private http: Http) {
    }

    doUpload(event: DragEvent): void {
        if (!event.dataTransfer || !event.dataTransfer.files ||
            event.dataTransfer.files.length <= 0) {
            return;
        }
        let files: FileList = event.dataTransfer.files;

        if (files.length > this.options.maxFiles) {
            let filesCopy: any = [];
            filesCopy.length = this.options.maxFiles;

            filesCopy.item = (index: number): File => {
                return index > this.options.maxFiles ? undefined : event.dataTransfer.files.item(index);
            };

            for (let i: number = 0; i < this.options.maxFiles; i++) {
                filesCopy[i] = event.dataTransfer.files[i];
            }
            files = <FileList> filesCopy;
        }

        let formData: FormData = new FormData();

        for (let i: number = 0; i < files.length; i++) {
            formData.append(this.options.name ? this.options.name(i, files.item(i)) : "file-" + i, files.item(i));
        }

        this.http.request(this.options.url, {
            method: this.options.method || "POST",
            headers: this.options.headers || UploadDirective.defaultHeaders(),
            search: this.options.search || undefined,
            body: formData,
        }).subscribe((response: Response) => {
            this.onUpload.emit(response);
        });
    }

    private static defaultHeaders(): Headers {
        let headers: Headers = new Headers();
        headers.append("Content-Type", "multipart/form-data");
        return new Headers();
    }
}

let uploadComponents: LocalUploadDirective[] = [];
let globalDragStartListeners: GlobalUploadDirective[] = [];

@Directive({
    selector: "[a2FileIn]",
    outputs: ["fileIn: a2FileIn"],
})
export class LocalUploadDirective implements AfterContentInit, OnDestroy {
    public mouseIsOver: boolean = false;
    public fileIn: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public ref: ElementRef, public zone: NgZone) {
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

@Directive({
    selector: "[a2GlobalFileIn]",
    outputs: ["globalFileIn: a2GlobalFileIn"],
})
export class GlobalUploadDirective implements AfterContentInit, OnDestroy {
    public mouseIsOver: boolean = false;
    public globalFileIn: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public zone: NgZone) {
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

export const UPLOAD_DIRECTIVES: Type[] = [UploadDirective, LocalUploadDirective, GlobalUploadDirective];
