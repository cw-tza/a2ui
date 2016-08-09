import {Component, Input, Output, Directive, QueryList, forwardRef, ContentChildren, AfterContentInit} from "@angular/core";
import {NgClass} from "@angular/common";
import {PAGINATION_DIRECTIVES} from "../pagination/pagination.component";
import {EventEmitter} from "@angular/platform-browser-dynamic/src/facade/async";

@Component({
    selector: "data-table",
    templateUrl: "src/bootstrap/data-table/data-table.component.html",
    directives: [PAGINATION_DIRECTIVES, NgClass]
})
export class DataTable implements AfterContentInit {
    pageSize: number = 5;
    current: number = 2;
    @Input()
    public data: Array<any>;
    @Output()
    public rowSelection: EventEmitter<any> = new EventEmitter<any>();
    @ContentChildren(forwardRef(() => Column))
    private columns: QueryList<Column>;

    private dataToDisplay: Array<any>;
    private filters: any = {};

    ngAfterContentInit(): any {
        this.dataToDisplay = this.data.slice();
    }

    private filter(): void {
        this.dataToDisplay = this.data.filter(row => {
            let fulfilled: boolean = true;
            for (let key in this.filters) {
                if (this.filters.hasOwnProperty(key)) {
                    fulfilled = fulfilled && this.valueOf(row, key).includes(this.filters[key]);
                }
            }
            return fulfilled;
        });
    }

    private orderBy(column: Column): void {
        if (column.sortBy === undefined) return;
        this.dataToDisplay.sort((a, b) => this.alphabeticalSort(this.valueOf(a, column.sortBy), this.valueOf(b, column.sortBy), column.order));
        column.order = column.order * -1;
    }

    private alphabeticalSort(a: any, b: any, order: number): number {
        if (a < b) return -1 * order;
        if (a > b) return order;
        return 0;
    };

    private valueOf(root: any, path: string): any {
        let value: any = root;
        path.split(".").forEach(field => {
            value = value[field];
        });
        return value;
    }

    private emitSelectEvent(row: any): void {
        this.rowSelection.emit(row);
    }

    private edit(event: any, column: Column, row: any): void {
        let value: any = row;
        let paths: Array<string> = column.content.split(".");
        while (paths.length > 0) {
            let path: string = paths.shift();
            paths.length !== 0 ? value = value[path] : value[path] = event;
        }
    }
}


@Directive({
    selector: "column",
})
export class Column {
    @Input()
    public header: string;
    @Input()
    public content: string;
    @Input()
    public sortBy: string;
    @Input()
    public filterBy: string;
    @Input()
    public editable: boolean;

    public order: number = 1;
}
