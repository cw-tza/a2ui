import {
    Component, Directive, TemplateRef, forwardRef, ContentChild, AfterContentInit, Input,
    OnInit
} from "@angular/core";

@Component({
    selector: "pagination",
    templateUrl: "src/pagination/pagination.component.html",
})
export class Pagination implements OnInit {

    @Input()
    public data: Array<any>;
    @Input()
    public v: string = "var";
    @Input()
    public pageSize: number = 10;

    @ContentChild(forwardRef(() => PageTemplate))
    private pageTemplate: PageTemplate;

    private currentPage: number = 0;
    private pages: Array<number>;

    ngOnInit(): any {
        this.pages = Array(Math.ceil(this.data.length / this.pageSize));
    }

    private prepareContext(index: number): any {
        let context: any = {};
        context[this.v] = this.data.slice(this.currentPage * this.pageSize, this.currentPage * this.pageSize + this.pageSize);
        return context;
    }

    private next(): void {
        if (this.hasNext()) this.currentPage++;
    }

    private previous(): void {
        if (this.hasPrev()) this.currentPage--;
    }

    private open(pageNumber: number): void {
        this.currentPage = pageNumber;
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
