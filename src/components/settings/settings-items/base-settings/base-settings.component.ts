import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

import {SettingsService} from '../../../../services/settings.service';
import {FadeAnimation} from '../../../../shared/fade-animation';
import {MessageServices} from '../../../../services/message.services';
import {FormBaseComponent} from '../../../../elements/pbx-form-base-component/pbx-form-base-component.component';
import {SettingsModel, SettingsOptionItem, SettingsBaseItem, SettingsItem, SettingsGroupItem} from '../../../../models/settings.models';
import {ModalEx} from '../../../../elements/pbx-modal/pbx-modal.component';


@Component({
    selector: 'base-settings-component',
    templateUrl: './template.html',
    styleUrls: ['../../local.sass'],
    providers: [SettingsService],
    animations: [FadeAnimation('300ms')]
})
export class BaseSettingsComponent extends FormBaseComponent implements OnInit {

    model: SettingsModel;
    modelValues: SettingsOptionItem[] = [];
    changes: SettingsOptionItem[] = [];

    qrCode: string;

    saveButton: any = {buttonType: 'success', value: 'Save', inactive: false, loading: false};
    cancelButton: any = {buttonType: 'cancel', value: 'Cancel', inactive: false, loading: false};
    modalExit: ModalEx = new ModalEx('', 'cancelEdit');

    @Input() path: string;

    // -- component lifecycle methods -----------------------------------------

    constructor(
        protected router: Router,
        protected service: SettingsService,
        protected message: MessageServices,
        protected fb: FormBuilder
    ) {
        super(fb, message);
    }

    ngOnInit() {
        this.getInitialParams();
    }

    // -- event handlers ------------------------------------------------------

    onValueChange(item: SettingsItem): void {
        let original = this.modelValues.find(v => v.id === item.id);
        if (!original || original.value != item.value) {
            let change = this.changes.find(c => c.id === item.id);
            if (change) change.value = item.value;
            else this.changes.push(new SettingsOptionItem(item.id, item.value));
        }
        else {
            this.changes = this.changes.filter(c => c.id !== item.id);
        }

        this.checkItemQRCode(item);
    }

    cancel(): void {
        if (this.changes.length !== 0) {
            this.modalExit.setMessage('You have made changes. Do you really want to leave without saving?');
            this.modalExit.show();
        }
        else {
            this.goBack();
        }
    }

    goBack(): void {
        this.router.navigateByUrl('/cabinet/settings');
    }

    // -- component methods ---------------------------------------------------

    findSettingById(id: number, items: SettingsBaseItem[]): SettingsItem {
        for (let item of items) {
            if ((<SettingsItem>item).id === id) return <SettingsItem>item;
            if (item.isGroup) {
                const child = this.findSettingById(id, (<SettingsGroupItem>item).children);
                if (child) return child;
            }
        }
        return null;
    }

    saveModelState(items: SettingsBaseItem[]): void {
        this.modelValues = [];
        items.forEach(i => {
            if (!i.isGroup) {
                let settingsItem = <SettingsItem>i;
                this.modelValues.push(new SettingsOptionItem(settingsItem.id, settingsItem.value));
                this.checkItemQRCode(settingsItem);
            }
            else this.saveModelState((<SettingsGroupItem>i).children);
        });
    }

    setDefaultValue(item: SettingsItem): void {
        if (!item.value) {
            if (item.type === 'bool') item.value = false;
            else if (item.type === 'int') item.value = 0;
            else if (item.type === 'string') item.value = '';
            else if (item.type === 'list') {
                item.value = item.options[0].id;
            }
        }
    }

    checkItemQRCode(item: SettingsItem): void {
        if (item.key == 'two_factor_auth_type') {
            let selected = item.options.find(o => o.id == item.value);
            if (selected && selected.value === 'google')
                this.getQR();
            else
                this.qrCode = null;
        }
    }

    // -- data processing methods ---------------------------------------------

    getInitialParams(): void {
        this.locker.lock();

        this.service.getSettingsParams(this.path).then(response => {
            this.model = SettingsModel.create(response.settings);
            this.saveModelState(this.model.items);
        }).catch(() => {
        })
            .then(() => this.locker.unlock());
    }

    getQR(): void {
        this.service.getQRCode().then(response => {
            this.qrCode = response.qrImage;
        }).catch(() => {
        });
    }

    saveSettings() {
        if (this.changes.length === 0) {
            this.message.writeSuccess('The data has been saved');
            return;
        }

        this.saveButton.loading = true;

        this.service.saveSettings(this.changes, this.path, false).then(response => {
            this.message.writeSuccess(response.message);
            this.changes = [];
            this.saveModelState(this.model.items);
        }).catch(() => {
        })
            .then(() => this.saveButton.loading = false);
    }
}
