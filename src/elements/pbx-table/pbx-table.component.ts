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
import {str2regexp, killEvent} from '../../shared/shared.functions';
import {isObject, isArray} from 'util';
import {RefsServices} from '../../services/refs.services';
import {FormBuilder} from '@angular/forms';
import {MessageServices} from '../../services/message.services';
import {AddressBookService} from '../../services/address-book.service';
import {AddressBookComponent} from '../../components/address-book/address-book.component';
import {TariffStateService} from '../../services/state/tariff.state.service';


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
    @Input() columnFormat: string[];
    @Input() deletable: boolean = true;
    @Input() editable: boolean;
    @Input() editMode: boolean = true;
    @Input() multiple: boolean;
    @Input() name: string;
    @Input() selected: any;
    @Input() tableInfo: TableInfoModel;
    @Input() tableInfoEx: TableInfoExModel;
    @Input() tableItems: any[];
    @Input() tableReload: number = 0;

    @Output() onDelete: EventEmitter<object> = new EventEmitter<object>();
    @Output() onDropDown: EventEmitter<object> = new EventEmitter<object>();
    @Output() onDropDownClick: EventEmitter<object> = new EventEmitter<object>();
    @Output() onEdit: EventEmitter<object> = new EventEmitter<object>();
    @Output() onPageChangeEx: EventEmitter<number> = new EventEmitter<number>();
    @Output() onPlayerClick: EventEmitter<object> = new EventEmitter<object>();
    @Output() onSelect: EventEmitter<object> = new EventEmitter<object>();
    @Output() onSort: EventEmitter<object> = new EventEmitter<object>();

    dropDirection = '';
    modal: ModalEx = new ModalEx('Are you sure?', 'delete');
    selectedDelete: any;
    hideField: boolean = false;

    constructor(protected state: TariffStateService) {

    }

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

    editItem(item, event: MouseEvent): void {
        killEvent(event);
        this.onEdit.emit(item);
    }

    clickDeleteItem(item: any, event: MouseEvent) {
        killEvent(event);

        this.selectedDelete = item;
        if (!this.editMode) {
            this.deleteItem();
        }
        else {
            if (this.name === 'Phone Number') {
                this.modal.body = '';
                let body: string;
                body = '';
                let innerCount;
                innerCount = 0;
                if (item.sipInners && item.sipInners.length > 0) {
                    innerCount = item.sipInners.length;
                }
                body = body.concat('Are you sure you want to delete ', item.phoneNumber, ' and ', innerCount, ' Ext(s)?');
                this.modal.body = body;
            }
            this.modal.visible = true;
        }
    }

    deleteItem(): void {
        this.onDelete.emit(this.selectedDelete);
    }

    getItemFormatting(item: any, tableItem: TableInfoItem, itemIndex: number): string {
        let css = '';
        
        // console.log('cf', this.columnFormat);
        if (!!this.columnFormat && !!this.columnFormat[itemIndex]) css += ' ' + this.columnFormat[itemIndex];
        
        if (tableItem.dataWidth !== undefined) css += ' fix_' + tableItem.dataWidth;
        else if (!!tableItem.width) css += ' fix_' + tableItem.width;
        
        if (tableItem.specialFormatting) {
            let value = this.getValueByKeyEx(item, tableItem.key);
            tableItem.specialFormatting.forEach(rule => {
                if (value.match(str2regexp(rule.pattern))) {
                    css += ' ' + rule.cssClass;
                }
            });
        }

        return css;
    }

    getValueByKeyEx(item: any, key: string): string {
        let result: any = this.getValueByKey(item, key);
        return result === true || result === false || isObject(result) || isArray(result) ? '' : result;
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
        item.player.animationState = item.player.animationState === 'min' ? 'max' : 'min';
    }

    playerAnimationStart(item) {
        if (item) {
            // console.log('PLAYER_ANIMATION1', item.player.animationState);
            // console.log('PLAYER_ANIMATION2', item.player.contentShow);
            if (item.player.animationState === 'min') {
                item.player.contentShow = false;
            }
        }
    }

    playerAnimationEnd(item) {
        if (item) {
            item.player.contentShow = item.player.contentShow === false;
            if (item.player.animationState === 'min') {
                item.player.contentShow = false;
            }
        }
    }

    ngOnInit() {
        this.state.change.subscribe(hideField => {
            this.hideField = hideField;
        });

        this.name ? this.modal.body = `Are you sure you want to delete this ${this.name}?` : null;
        if (!this.tableInfoEx) {
            this.tableInfoEx = new TableInfoExModel();
            for (let i = 0; i < this.tableInfo.titles.length; i++) {
                let item: TableInfoItem = {
                    title: this.tableInfo.titles[i],
                    key: this.tableInfo.keys[i],
                    width: null,
                    dataWidth: undefined,
                    sort: null,
                    noDataColumn: false,
                };
                this.tableInfoEx.items.push(item);
            }
        }
    }

}

