import {
    Component, Directive, TemplateRef, forwardRef, ContentChild, Input, Output, OnChanges, SimpleChanges
} from "@angular/core";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";

@Component({
    selector: "pagination",
    templateUrl: "src/bootstrap/pagination/pagination.component.html",
})
export class Pagination implements OnChanges {

    @Input()
    public data: Array<any>;
    @Input()
    public v: string = "var";
    @Input()
    public pageSize: number = 10;
    @Output()
    pageChange: EventEmitter<number> = new EventEmitter();

    @ContentChild(forwardRef(() => PageTemplate))
    private pageTemplate: PageTemplate;

    private currentPage: number = 0;
    private pages: Array<number>;
    private context: any = {};

    ngOnChanges (changes: SimpleChanges): any {
        if (changes.hasOwnProperty("data")) {
            this.pages = Array(Math.ceil(this.data.length / this.pageSize));
        }
    }

    private prepareContext(): any {
        this.context[this.v] = this.data.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize);
        return this.context;
    }

    private openNext(): void {
        if (this.hasNext()) this.currentPage++;
    }

    private openPrevious(): void {
        if (this.hasPrev()) this.currentPage--;
    }

    private open(pageNumber: number): void {
        this.currentPage = pageNumber;
        this.pageChange.emit(this.currentPage);
    }

    private openFirst(): void {
        this.currentPage = 0;
    }

    private openLast(): void {
        this.currentPage = this.pages.length - 1;
    }

    private hasNext(): boolean {
        return this.currentPage + 1 < this.pages.length;
    }

    private hasPrev(): boolean {
        return this.currentPage > 0;
    }
}

@Directive({
    selector: "template[pageTemplate]"
})
export class PageTemplate {
    constructor(public templateRef: TemplateRef<any>) {
    }
}

export const PAGINATION_DIRECTIVES: Array<any> = [Pagination, PageTemplate];
