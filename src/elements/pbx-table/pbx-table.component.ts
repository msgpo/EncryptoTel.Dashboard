import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {TableInfoExModel, TableInfoItem, TableInfoModel} from '../../models/base.model';
import {ModalEx} from "../pbx-modal/pbx-modal.component";
import {PlayerAnimation} from "../../shared/player-animation";
import {FadeAnimation} from "../../shared/fade-animation";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'pbx-table',
    templateUrl: './template.html',
    styleUrls: ['./local.sass'],
    animations: [
        FadeAnimation('200ms'),
        PlayerAnimation
    ]
})

export class TableComponent implements OnInit {
    @Input() tableItems: any[];
    @Input() selected: any;
    @Input() tableInfo: TableInfoModel;
    @Input() tableInfoEx: TableInfoExModel;
    @Input() editable: boolean;
    @Input() deletable: boolean = true;
    @Input() multiple: boolean;
    @Input() columnFormat: string[];
    @Input() name: string;

    @Output() onSelect: EventEmitter<object> = new EventEmitter<object>();
    @Output() onEdit: EventEmitter<object> = new EventEmitter<object>();
    @Output() onDelete: EventEmitter<object> = new EventEmitter<object>();
    @Output() onPageChangeEx: EventEmitter<number> = new EventEmitter<number>();
    @Output() onSort: EventEmitter<object> = new EventEmitter<object>();
    @Output() onDropDown: EventEmitter<object> = new EventEmitter<object>();
    @Output() onDropDownClick: EventEmitter<object> = new EventEmitter<object>();
    @Output() onPlayerClick: EventEmitter<object> = new EventEmitter<object>();

    modal: ModalEx = new ModalEx('Are you sure?', 1);
    selectedDelete: any;
    dropDirection = '';

    isSelected(id: number): boolean {
        if (this.selected) {
            return !!this.selected.find(item => {
                return Number.isInteger(item) ? item === id : item.id === id;
            });
        }
    }

    selectItem(item): void {
        this.onSelect.emit(item);
    }

    editItem(item, ev: MouseEvent): void {
        if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        }
        this.onEdit.emit(item);
    }

    clickDeleteItem(item, ev: MouseEvent) {
        if (ev) {
            ev.stopPropagation();
            ev.preventDefault();
        }
        this.selectedDelete = item;
        this.modal.visible = true;
    }

    deleteItem(): void {
        this.onDelete.emit(this.selectedDelete);
    }

    getValueByKeyEx(item: any, key: string): string {
        let result: any = this.getValueByKey(item, key);
        return result === true || result === false ? '' : result
    }

    getValueByKey(item: any, key: string): string {
        const keyArray = key.split('.');
        keyArray.forEach(k => item = item && item[k]);
        return item;
    }

    changePage(): void {
        this.onPageChangeEx.emit();
    }

    sort(item: TableInfoItem) {
        if (item.sort) {
            this.tableInfoEx.sort.isDown = !(this.tableInfoEx.sort.column === item.sort && this.tableInfoEx.sort.isDown);
            this.tableInfoEx.sort.column = item.sort;
            this.onSort.emit(item);
        }
    }

    headerClass(item: TableInfoItem) {
        return [item.sort ? 'sort' : '', item.width ? ('fix' + item.width) : ''];
    }

    dropOpen(action, item) {
        let prev = item.ddShow;
        this.tableItems.forEach((item) => {
            item.ddShow = false;
        });
        this.onDropDown.emit({action: action, item: item});
        item.ddShow = prev === false;

        if ((this.tableItems.length - 4) < this.tableItems.indexOf(item)) {
            this.dropDirection = 'top';
        } else {
            this.dropDirection = 'bottom';
        }
    }

    dropClick(action, option, item) {
        this.onDropDownClick.emit({action: action, option: option, item: item});
    }

    mouseEnter(event, item) {
        // console.log('mouseEnter', item.id);

    }

    mouseLeave(event, item) {
        // console.log('mouseLeave', item.id);
    }

    /* ------------------------------------------------------
     * Media player
     * ------------------------------------------------------
     */

    playerClick(item) {
        this.onPlayerClick.emit(item);
    }

    playerOpenClose(item) {
        item.playerAnimationState = item.playerAnimationState === 'min' ? 'max' : 'min';
    }

    playerAnimationStart(item) {
        if (item) {
            // console.log('PLAYER_ANIMATION1', item.playerAnimationState);
            // console.log('PLAYER_ANIMATION2', item.playerContentShow);
            if (item.playerAnimationState === 'min') {
                item.playerContentShow = false;
            }
        }
    }

    playerAnimationEnd(item) {
        if (item) {
            item.playerContentShow = item.playerContentShow === false;
            if (item.playerAnimationState === 'min') {
                item.playerContentShow = false;
            }
        }
    }

    ngOnInit() {
        this.name ? this.modal.body = `Are you sure you want to delete this ${this.name}?` : null;
        if (!this.tableInfoEx) {
            this.tableInfoEx = new TableInfoExModel();
            for (let i = 0; i < this.tableInfo.titles.length; i++) {
                let item: TableInfoItem = {
                    title: this.tableInfo.titles[i],
                    key: this.tableInfo.keys[i],
                    width: null,
                    sort: null,
                };
                this.tableInfoEx.items.push(item);
            }
        }
    }

}

