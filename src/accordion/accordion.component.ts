import {ContentChildren} from "@angular/core";
import {QueryList} from "@angular/core";
import {AccordionGroup} from "./accordion-group.component";
import {forwardRef} from "@angular/core";
import {AfterContentInit} from "@angular/core";
import {Input} from "@angular/core";
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";
import {OnChanges} from "@angular/core";
import {SimpleChanges} from "@angular/core";
import {Component} from "@angular/core";

@Component({
    selector: "accordion",
    templateUrl: "src/accordion/accordion.component.html"
})
export class Accordion implements AfterContentInit, OnChanges {

    @Input()
    public closeOther: boolean = true;
    @Input()
    public ignoreDisabled: boolean = false;
    @Output()
    public contentChange: EventEmitter<Array<AccordionGroupState>> = new EventEmitter<Array<AccordionGroupState>>();
    @Output()
    public navigation: EventEmitter<AccordionNavigationEvent> = new EventEmitter<AccordionNavigationEvent>();
    @ContentChildren(forwardRef(() => AccordionGroup))
    private children: QueryList<AccordionGroup>;

    private groups: Array<AccordionGroup> = [];

    ngAfterContentInit (): void {
        this.children.changes.subscribe(() => {
            this.getAvailableGroups();
        });
        this.getAvailableGroups();
        if (this.closeOther) {
            let openedGroup: number = this.groups.findIndex(group => group.opened);
            let index: number = openedGroup ? openedGroup : 0;
            this.notifyNavigationState(index - 1, index, index + 1);
        }
    }

    ngOnChanges (changes: SimpleChanges): any {
        if (this.children && changes.hasOwnProperty("ignoreDisabled")) {
            this.getAvailableGroups();
        }
    }

    public open (toBeOpened: string): void {
        this.groups.forEach((group, index) => {
            if (group.name === toBeOpened) {
                group.opened = true;
                if (this.closeOther) this.notifyNavigationState(index - 1, index, index + 1);
            } else if (this.closeOther) group.opened = false;
        });
    }

    public close (toBeClosed: string): void {
        this.groups.forEach((group, index) => {
            if (group.name === toBeClosed) {
                group.opened = false;
                if (this.closeOther) this.notifyNavigationState(index, undefined, index + 1);
            }
        });
    }

    private getAvailableGroups (): void {
        this.groups = this.children.filter((child) => !this.ignoreDisabled || !child.disabled);
        this.contentChange.emit(this.groups.map((group) => {
            return {name: group.name, opened: group.opened, disabled: group.disabled};
        }));
    }

    private notifyNavigationState (prev: number, current: number, next: number): void {
        let navigationState: AccordionNavigationEvent = {
            current: current !== undefined ? this.groups[current].name : undefined,
            next: next !== undefined && next < this.groups.length ? this.groups[next].name : undefined,
            prev: prev !== undefined && prev >= 0 ? this.groups[prev].name : undefined
        };

        this.navigation.emit(navigationState);
    }
}

export interface AccordionNavigationEvent {
    prev: string;
    current: string;
    next: string;
}

export interface AccordionGroupState {
    name: string;
    opened: boolean;
    disabled: boolean;
}

export const ACCORDION_DIRECTIVES: Array<any> = [Accordion, AccordionGroup];

