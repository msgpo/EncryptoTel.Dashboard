import {Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren} from '@angular/core';
import {InputComponent} from '../pbx-input/pbx-input.component';
import {ButtonItem, FilterItem} from '../../models/base.model';


@Component({
    selector: 'pbx-header',
    templateUrl: './template.html',
    styleUrls: ['./local.sass']
})
export class HeaderComponent implements OnInit {
    currentFilter;
    selectedFilter;
    timeout: any; // NodeJS.Timer;

    @Input() buttons: ButtonItem[];
    @Input() filters: FilterItem[];
    @Input() inactive: boolean;
    @Input() errors: any;
    
    @Output() onClick: EventEmitter<ButtonItem>;
    @Output() onReload: EventEmitter<any>;
    @Output() onUpdate: EventEmitter<any>;

    @ViewChildren(InputComponent) inputs: QueryList<InputComponent>;


    // -- component lifecycle methods -----------------------------------------

    constructor() {
        this.filters = [];
        this.currentFilter = [];
        this.selectedFilter = [];

        this.timeout = null;

        this.onClick = new EventEmitter<ButtonItem>();
        this.onReload = new EventEmitter<any>();
        this.onUpdate = new EventEmitter<any>();
    }

    ngOnInit() {}

    // -- properties ----------------------------------------------------------

    activeButtons(): ButtonItem[] {
        return this.buttons.filter(b => b.visible);
    }

    activeFilter(): FilterItem[] {
        return this.filters ? this.filters.filter(item => !item.hidden) : null;
    }

    // -- event handlers ------------------------------------------------------

    load(): void {
        Object.keys(this.currentFilter).forEach(key => {
            if (!this.currentFilter[key]) this.currentFilter[key] = null;
        });
        this.onUpdate.emit(this.currentFilter);
    }

    reload(): void {
        // if (this.currentFilter['search'].length >= 3 || this.currentFilter['search'].length === 0) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.onReload.emit(this.currentFilter);
        }, 500);
        // }
    }

    updateFilter(index: number, filter): void {
        this.selectedFilter[index] = filter;
        let item = this.inputs.find((item, idx) => idx === index);
        if (item) item.value = filter;
    }

    clickButton(item: ButtonItem): void {
        this.onClick.emit(item);
    }
}
