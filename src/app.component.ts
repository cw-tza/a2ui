import {AfterContentInit, Component, PLATFORM_DIRECTIVES} from "@angular/core";
import {provideForms, disableDeprecatedForms} from "@angular/forms";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {OnInitDirective} from "./on-init/on-init.directive";
import * as cb from "./clipboard/clipbard";
import {WatchDirective} from "./watch/watch.directive";
import {Modal, ModalInstance} from "./bootstrap/modal/modal";
import {MyModalComponent, MY_MODAL_DEPENDENCY} from "./examples/MyModal.component";
import {CrossValidateDirective} from "./cross-validate/cross-validate.directive";
import {ComponentWithInputInsideComponent} from "./examples/component-with-input-inside.component";
import {PopoverDirective} from "./bootstrap/popover/popover.directive";
import {ComponentInsidePopoverComponent} from "./examples/component-inside-popover.component";
import {Rating} from "./bootstrap/rating/rating.component";
import {ViewChild} from "@angular/core";
import {Alert} from "./bootstrap/alert/alert.component";
import {
    ACCORDION_DIRECTIVES, AccordionGroupState, AccordionNavigationEvent,
    Accordion
} from "./bootstrap/accordion/accordion.component";
import {TABS_DIRECTIVES} from "./bootstrap/tabs/tabs.component";
import {PAGINATION_DIRECTIVES} from "./bootstrap/pagination/pagination.component";
import {DataTable, Column} from "./bootstrap/data-table/data-table.component";

@Component({
    selector: "a2ui-app",
    templateUrl: "src/app.component.html",
    providers: [Modal],
    directives: [ComponentWithInputInsideComponent, ACCORDION_DIRECTIVES, Rating, Alert, TABS_DIRECTIVES, PAGINATION_DIRECTIVES, DataTable, Column]
})
class AppComponent implements AfterContentInit {
    copy: (source: HTMLElement | string) => cb.ClipboardResult = cb.copy;
    cut: (source: HTMLElement | string) => cb.ClipboardResult = cb.cut;
    modalSuccessResult: any;
    modalSuccessError: any;
    modalDone: any;
    componentInsidePopoverComponent: any = ComponentInsidePopoverComponent;

    constructor(private modal: Modal) {
    }

    toggle(field: string): void {
        this[field] = !this[field];
    }

    showModal(): void {
        // noinspection TypeScriptValidateTypes
        this.modal.create({
            component: MyModalComponent,
            providers: [{provide: MY_MODAL_DEPENDENCY, useValue: 42}]
        }).subscribe((instance: ModalInstance) => {
            instance.result.subscribe((result: any) => {
                this.modalSuccessResult = result;
            }, (error: any) => {
                this.modalSuccessError = error;
            }, () => {
                this.modalDone = "Modal is done with us";
            });
        }, (error: any) => {
            this.modalSuccessError = error;
        });
    }

    ngAfterContentInit(): any {
        this.accordion.navigation.subscribe($event => {
            this.accordionNavigationState = $event;
        });

        this.accordion.contentChange.subscribe($event => {
            this.accordionContentState = $event;
            this.accordion.open($event[0].name);
        });
    }

    // Accordion
    ignoreDisabled: boolean = false;
    groupPresent: boolean = true;
    closeOthers: boolean = true;
    accordionNavigationState: AccordionNavigationEvent;
    accordionContentState: Array<AccordionGroupState> = [];
    @ViewChild("acc")
    accordion: Accordion;

    next(): void {
        if (!this.accordionNavigationState.next) return;
        this.accordion.open(this.accordionNavigationState.next);
    }

    prev(): void {
        if (!this.accordionNavigationState.prev) return;
        this.accordion.open(this.accordionNavigationState.prev);
    }

    // rating
    rating: number = 2.4;
    ratingDisabled: boolean = true;

    ratingChange(newRating: number): void {
        this.rating = newRating;
    }

    // alert
    alerts: Array<any> = [];

    createAlerts(): void {
        this.alerts = [
            {type: "success", show: true, content: "Alert", skippable: false},
            {type: "info", show: true, content: "Skippable alert", skippable: true},
            {type: "warning", show: true, content: "Alert with display time", skippable: false, displayTime: 5000},
            {
                type: "danger",
                show: true,
                content: "Skippable alert with display time",
                skippable: true,
                displayTime: 7000
            }
        ];
    }

    hideEvent(index: number): void {
        this.alerts[index].show = false;
    }

    // tabs
    openedTab: string = "a1";

    // pagination
    todo: any;
    pageSize: number = 3;
    current: number = 2;
    data: Array<any> = [
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Einstein", age: "23"},
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Zweitein", age: "23"},
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Dreitein", age: "23"},
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Viertein", age: "23"},
        {name: "Harrison", surname: "Jones", age: "72"},
        {name: "Han", surname: "Ford", age: "83"},
        {name: "Albert", surname: "Funftein", age: "23"}
    ];

    // data table
    tableData: Array<any> = [
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Einstein", age: "23", nested: {value: "Adventurer"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Egghead"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Zweitein", age: "23", nested: {value: "Egghead"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Dreitein", age: "23", nested: {value: "Egghead"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Viertein", age: "23", nested: {value: "Egghead"}},
        {name: "Harrison", surname: "Jones", age: "72", nested: {value: "Adventurer"}},
        {name: "Han", surname: "Ford", age: "83", nested: {value: "Pirate"}},
        {name: "Albert", surname: "Funftein", age: "23", nested: {value: "Egghead"}}
    ];

    rowSelection($event: any): any {
        console.log($event);
    }

}

bootstrap(AppComponent, [
    {provide: PLATFORM_DIRECTIVES, useValue: OnInitDirective, multi: true},
    {provide: PLATFORM_DIRECTIVES, useValue: WatchDirective, multi: true},
    {provide: PLATFORM_DIRECTIVES, useValue: CrossValidateDirective, multi: true},
    {provide: PLATFORM_DIRECTIVES, useValue: PopoverDirective, multi: true},
    provideForms(),
    disableDeprecatedForms(),
]);
