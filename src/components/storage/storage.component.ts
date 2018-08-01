import {Component, OnInit, ViewChild} from '@angular/core';
import {StorageService} from "../../services/storage.service";
import {MessageServices} from "../../services/message.services";
import {SizePipe} from '../../services/size.pipe';
import {ButtonItem, FilterItem, TableInfoExModel, TableInfoItem} from "../../models/base.model";
import {ListComponent} from "../../elements/pbx-list/pbx-list.component";

@Component({
    selector: 'pbx-storage',
    templateUrl: './template.html',
    styleUrls: ['./local.sass'],
    providers: [StorageService],
})

export class StorageComponent implements OnInit {

    @ViewChild(ListComponent) list;

    search: string = '';
    source = {
        option: [
            {title: 'Audio', type: 'audio'},
            // {title: 'Call Records', type: 'call_record'},
            // {title: 'Trash', type: 'trash'}
            ],
        select: {title: '', type: ''}
    };
    table: TableInfoExModel = new TableInfoExModel();

    player = {item: [], current: null};
    modal = {
        visible: false,
        text: '',
        confirm: {type: 'error', value: 'Delete'},
        decline: {type: 'cancel', value: 'Cancel'}
    };
    buttons: ButtonItem[] = [];
    filters: FilterItem[] = [];

    constructor(private service: StorageService,
                private message: MessageServices,
                private _size: SizePipe) {
        this.table.sort.isDown = false;
        this.table.sort.column = 'date';
        this.table.items.push(new TableInfoItem('Name', 'name', 'name'));
        this.table.items.push(new TableInfoItem('Date', 'date', 'date', 168));
        this.table.items.push(new TableInfoItem('Size, MB', 'size', 'size', 104));


        this.buttons.push({
            id: 0,
            title: 'Delete Selected',
            type: 'error',
            visible: false,
            inactive: false,
        });
        this.filters.push(new FilterItem(1, 'type', 'Select Source:', [
            {id: 'audio', title: 'Audio'}
        ], 'title'));
        this.filters.push(new FilterItem(2, 'search', 'Search:', null, null, 'Search by Name'));
    }

    updateLoading(loading, deleting = false) {
        this.list.loading = loading;
        if (!loading) {
            this.load();
            if(this.service.successCount) {
                this.message.writeSuccess(`Successfully ${deleting ? 'deleted' : 'uploaded'} ${this.service.successCount} file(s).`);
            }
        }
    }

    private uploadFiles(files) {
        this.service.resetCount();
        for (let i = 0; i < files.length; i++) {
            if (this.service.checkCompatibleType(files[i])) {
                this.service.checkFileExists(files[i], (loading) => {
                    this.updateLoading(loading);
                });
            } else {
                this.message.writeError('Accepted formats: mp3, ogg, wav');
            }
        }
        this.service.checkModal();
    }

    time(value: number): string {
        const sec = (value % 60);
        const min = Math.round(value / 60) % 60;
        const hour = Math.round(value / 3600);
        return (hour < 10 ? '0' : '') + hour + ':' + (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
    }

    play(id: number): void {
        // this.player.current = this.player.current === id ? null : id;
        // if (!this.find(this.player.item, id)) {
        //     this.player.item.push(id);
        // }
    }

    findById(array, id) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].id === id) {
                return array[i]
            }
        }
        return null;
    }

    find(array, value): boolean {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === value) {
                return true;
            }
        }
        return false;
    }

    dropHandler(e) {
        e.preventDefault();
        if (!this.service.pageInfo.items) {
            return ;
        }
        const files = e.dataTransfer.files;
        this.uploadFiles(files);
    }

    dragOverHandler(e) {
        e.preventDefault();
    }

    dragEndHandler(e) {
    }

    dragLeaveHandler(e) {
        e.preventDefault();
    }

    deleteSelected() {
        this.modal.visible = true;
    }

    doDeleteSelected() {
        this.service.resetCount();
        for (let i = 0; i < this.service.select.length; i++) {
            const id = this.service.select[i];
            const item = this.list.pageInfo.items.find(item => item.id === id);
            item ? item.loading++ : null;
            this.service.deleteById(id, (loading) => {
                this.updateLoading(loading, true);
            }, false).then(() => {
                item ? item.loading-- : null;
            }).catch(() => {
                item ? item.loading-- : null;
            });
        }
    }

    sendFile(e) {
        e.preventDefault();
        const files = e.target.files;
        if (e.target.files[0]) {
            this.uploadFiles(files);
        }
    }

    selectItem(id: number) {
        this.service.selectItem(id);
        this.buttons[0].inactive = this.service.select.length === 0;
    }

    load() {
        this.service.select = [];
        this.buttons[0].visible = this.service.pageInfo.itemsCount > 0;
        this.buttons[0].inactive = true;
    }

    ngOnInit(): void {

    }

}
