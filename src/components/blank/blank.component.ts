import {Component} from '@angular/core';
import {TableInfoModel} from '../../models/table-info.model';
import {SidebarInfo} from '../../models/sidebar-info.model';

@Component({
  selector: 'pbx-blank',
  template: `
            <div style="flex-direction: row; flex: 0 0 auto">
              <pbx-button style="flex: 0 0 auto; margin-bottom: 16px; width: 100px;"></pbx-button>
              <pbx-button style="flex: 0 0 auto; margin-bottom: 16px; width: 100px;" buttonType="success" value="Accept"></pbx-button>
              <pbx-button style="flex: 0 0 auto; margin-bottom: 16px; width: 100px;" buttonType="cancel" value="Cancel"></pbx-button>
              <pbx-button
                style="flex: 0 0 auto; margin-bottom: 16px; width: 100px;"
                buttonType="error"
                value="Modal"
                (onClick)="modalVisible = true"></pbx-button>
            </div>
            <pbx-select
              style="flex: 0 0 auto; width: 300px; margin-bottom: 16px"
              [options]="selectOptions"
              [singleBorder]="true"
              [selected]="selectedOption"
              [objectKey]="'title'"
              [placeholder]="'Please select something'"
              (onSelect)="selectOption($event)"></pbx-select>
            <pbx-select
              style="flex: 0 0 auto; width: 300px; margin-bottom: 16px"
              [options]="selectOptions"
              [selected]="selectedOption"
              [objectKey]="'title'"
              [placeholder]="'Please select something'"
              (onSelect)="selectOption($event)"></pbx-select>
            <pbx-checkbox style="flex: 0 0 auto; margin-bottom: 16px" [value]="checkboxStatus" (onToggle)="checkbox($event)"></pbx-checkbox>
            <pbx-modal [visible]="modalVisible" (onConfirm)="modalConfirm()" (onDecline)="modalDecline()">
              <div style="font-size: 16px">Modal body</div>
            </pbx-modal>
            <div style="flex-direction: row; width: 100%">
              <pbx-table [tableItems]="tableData"
                         [multiple]="true"
                         [tableInfo]="tableInfo"
                         [selected]="selectedRow"
                         [editable]="false"
                         (onSelect)="selectItem($event)"
                         (onDelete)="deleteItem($event)"
                         (onEdit)="editItem($event)"
                          style="flex: 1 0 auto"></pbx-table>
              <pbx-sidebar [sidebarInfo]="sidebarInfo" style="flex: 0 0 auto;"></pbx-sidebar>
            </div>`
})

export class BlankComponent {
  selectedRow = [];
  selectedOption;
  checkboxStatus: boolean;
  modalVisible: boolean;
  sidebarInfo: SidebarInfo = {
    title: 'Information',
    description: [
      {title: 'Available space', value: '4Mb'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'},
      {title: 'Available external numbers', value: '16'}
    ]
  };
  selectOptions = [
    {id: 1, title: 'Option 1', description: 'Select option 1'},
    {id: 2, title: 'Option 2', description: 'Select option 2'},
    {id: 3, title: 'Option 3', description: 'Select option 3'},
    {id: 4, title: 'Option 4', description: 'Select option 4'},
    {id: 5, title: 'Option 5', description: 'Select option 5'},
    {id: 6, title: 'Option 6', description: 'Select option 6'}
  ];
  tableData = [
    {id: 1, name: '123123', value: 'value1', additionalData: '1', hiddenValue: 'hidden'},
    {id: 2, name: '123123', value: 'value2', additionalData: '2', hiddenValue: 'hidden'},
    {id: 3, name: '123123', value: 'value3', additionalData: '3', hiddenValue: 'hidden'},
    {id: 4, name: '123123', value: 'value4', additionalData: '4', hiddenValue: 'hidden'},
    {id: 5, name: '123123', value: 'value5', additionalData: '5', hiddenValue: 'hidden'},
    {id: 6, name: '123123', value: 'value6', additionalData: '6', hiddenValue: 'hidden'},
    {id: 7, name: '123123', value: 'value7', additionalData: '7', hiddenValue: 'hidden'},
    {id: 8, name: '123123', value: 'value8', additionalData: '8', hiddenValue: 'hidden'}
  ];
  tableInfo: TableInfoModel = {
    titles: ['name', 'value', 'info'],
    keys: ['name', 'value', 'additionalData']
  };

  selectItem(item): void {
    const selected = this.selectedRow.find(i => i.id === item.id);
    if (selected) {
      this.selectedRow.splice(this.selectedRow.indexOf(selected), 1);
    } else {
      this.selectedRow.push(item);
    }
  }
  editItem(item): void {
    console.log('EDITED: \n', item);
    this.selectedRow = item;
  }
  deleteItem = (id): void => {
    const selected = this.selectedRow.find(i => i.id === id);
    if (selected) {
      this.selectedRow.splice(this.selectedRow.indexOf(selected), 1);
    }
  }
  selectOption(object): void {
    this.selectedOption = object;
  }
  checkbox = (ev): void => {
    this.checkboxStatus = ev;
  }
  modalConfirm = (): void => {
    console.log('Modal confirmed!');
    this.modalVisible = false;
  }
  modalDecline = (): void => {
    console.log('Modal declined!');
    this.modalVisible = false;
  }
}
