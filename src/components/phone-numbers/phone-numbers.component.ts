import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PhoneNumbersServices} from '../../services/phone-numbers.services';
import {TableInfoModel} from '../../models/table-info.model';
import {SwipeAnimation} from '../../shared/swipe-animation';
import {calculateHeight} from '../../shared/shared.functions';
import {Router} from '@angular/router';

@Component({
  selector: 'phone-numbers-component',
  templateUrl: './template.html',
  styleUrls: ['./local.sass'],
  providers: [PhoneNumbersServices],
  animations: [SwipeAnimation('x', '300ms')]
})

export class PhoneNumbersComponent implements OnInit {

  loading: boolean;

  list: any[];
  tableInfo: TableInfoModel;
  selected: any;

  requestDetails: {
    search: string,
    page: number,
    limit: number
  };

  pagination: {
    page: number;
    total: number;
  };

  @ViewChild('row') row: ElementRef;
  @ViewChild('table') table: ElementRef;

  constructor(private _services: PhoneNumbersServices,
              public router: Router) {
    this.pagination = {page: 1, total: 1};
    this.tableInfo = {
      titles: ['Phone Number', 'Amount of phone Exts', 'Default Ext', 'Status', 'Number type'],
      keys: ['phoneNumber', 'exts', 'default_ext', 'status_value', 'provider']
    };
  }

  selectItem(item: any): void {
    this.selected = item;
  }

  deleteItem(item: any): void {
    item.loading = true;
    this._services.removePhoneNumber(item.id)
      .then(() => {
        this.selected = {};
        item.loading = false;
        this.getList();
      }).catch();
  }

  isSelected(): boolean {
    return Object.keys(this.selected).length > 0;
  }

  cancelSelected(): void {
    this.selected = {};
  }

  toggleNumber(): void {
    this.selected.loading = true;
    this._services.toggleNumber(this.selected.id, !this.selected.status)
      .then(() => {
        this.selected.status = !this.selected.status;
        this.selected.status_value = this.selected.status ? 'Enabled' : 'Disabled';
        this.selected.loading = false;
      });
  }
  onPageChange(page: number): void {
    this.pagination.page = this.requestDetails.page = page;
    this.getList();
  }

  getList(): void {
    this.loading = true;
    this._services.getPhoneNumbersList(this.requestDetails)
      .then(res => {
        this.list = [];
        this.pagination.total = res.pages;
        res.items.map(item => {
          item.exts = item.sipInners.length;
          item.status_value = !!item.status ? 'Enabled' : 'Disabled';
          item.provider = item.providerId === 1 ? 'Internal' : 'External';
          item.sipInners.map(inner => {
            if (inner.default) {
              item.default_ext = '#' + inner.phoneNumber;
            } else {
              item.default_ext = 'Not defined';
            }
          });
          this.list.push(item);
        });
        this.loading = false;
      }).catch();
  }

  ngOnInit() {
    setTimeout(() => {
      this.requestDetails = {
        search: '',
        page: 1,
        limit: calculateHeight(this.table, this.row)
      };
      this.getList();
    });
    this.pagination.page = 1;
    this.selected = {};
  }
}
