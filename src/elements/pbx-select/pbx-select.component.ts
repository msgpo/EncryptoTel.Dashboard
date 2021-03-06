import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';

import {SwipeAnimation} from '../../shared/swipe-animation';
import {assertNumber} from "@angular/core/src/render3/assert";
import {StorageService} from '../../services/storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CallRulesService} from '../../services/call-rules.service';
import {MessageServices} from '../../services/message.services';
import {FormBuilder} from '@angular/forms';
import {RefsServices} from '../../services/refs.services';

@Component({
    selector: 'pbx-select',
    templateUrl: './template.html',
    styleUrls: ['./local.sass'],
    animations: [SwipeAnimation('y', '200ms')]
})

export class SelectComponent implements OnInit {
    @Input() name: string;
    @Input() singleBorder: boolean;
    @Input() options: any[];
    @Input() objectKey: string;
    @Input()
    set selected(selected: any) {
        if (typeof selected == 'number' || typeof selected == 'string') {
            let option = this.options.find(o => +o.id === +selected);
            if (option) this._selected = option;
        }
        else {
            this._selected = selected;
        }

        if (this._selected && (this._selected.title || this._selected.value))
            this.selectedObject = true;
    }
    _selected: any;

    @Input()
    set placeholder(placeholder: string) {
        this._placeholder = placeholder;
        if (this._selected === undefined || this._selected === null) {
            this.selectedObject = false;
        } else {
            if (this._selected[this.objectKey] != '') {
                this.selectedObject = true;
            }
            if (this._selected[this.objectKey] === undefined) {
                this.selectedObject = false;
            }
        }
    }
    _placeholder: string;

    @Input() errors: any[];
    @Output() onSelect: EventEmitter<object> = new EventEmitter();
    @Output() onOpen: EventEmitter<object> = new EventEmitter();
    @Output() onClose: EventEmitter<object> = new EventEmitter();
    @Output() onFocus: EventEmitter<object> = new EventEmitter();
    @Output() onBlur: EventEmitter<object> = new EventEmitter();
    isVisible = false;

    selectedObject = false;

    @ViewChild('optionsWrap') optionsWrap: ElementRef;
    @ViewChild('selectWrap') selectWrap: ElementRef;

    @HostListener('window:keydown', ['$event']) globalHide(event: KeyboardEvent) {
        if (event.code === 'Escape') {
            this.hideOptions();
        }
    }

    constructor() {
    }

    ngOnInit() {
        // console.log('select', this.options, this.objectKey, this.options[0][this.objectKey]);
    }

    calcPosition(): string {
        const comparison = (window.innerHeight - this.selectWrap.nativeElement.offsetTop + 40) > 230;
        return comparison ? 'bottom' : 'top';
    }

    /*
      Toggle options visibility
     */
    toggleOptions(event?: MouseEvent): void {
        if (event) {
            event.stopPropagation();
            event.preventDefault();
            this.isVisible ? this.hideOptions() : this.showOptions();
        }
    }

    /*
      Hide options
     */
    hideOptions(): void {
        this.selectWrap.nativeElement.blur();
        this.isVisible = false;
        this.closed();
        this.onBlur.emit();
    }

    /*
      Show options
     */
    showOptions(): void {
        this.selectWrap.nativeElement.focus();
        this.isVisible = true;
        const currentIndex = this.selected ? this.options.indexOf(this.selected) : 0; // Index of selected item
        setTimeout(() => this.scrollToCurrent(currentIndex), 1);
        this.opened();
        this.onFocus.emit();
    }

    /*
      Scroll to selected option
     */
    scrollToCurrent(currentIndex: number): void {
        if (this.isVisible && this.optionsWrap) {
            const optionsWrap = this.optionsWrap.nativeElement; // Options list HTML element
            optionsWrap.scrollTop = (currentIndex - 2) * 40;
        }
    }

    /*
      Select option
     */
    selectItem(option: object, event?: Event): void {
        if (option) {
            this.selectedObject = true;
        }
        if (event) {
            event.stopPropagation();
            event.preventDefault();
        }
        this.onSelect.emit(option);
        this.hideOptions();
    }

    /*
      Arrows navigation
     */
    keyboardNavigation(event: KeyboardEvent) {
        const currentIndex = this.options.findIndex(item => {
            if (!this.selected) return null;
            return Number.isInteger(item) ? item === this.selected : item.id === this.selected.id;
        });
        switch (event.code) {
            case 'Space': {
                this.toggleOptions();
                break;
            }
            case 'ArrowDown': {
                if ((currentIndex + 1) !== this.options.length) {
                    this.onSelect.emit(this.options[currentIndex + 1]);
                    this.scrollToCurrent(currentIndex + 1);
                } else {
                    this.onSelect.emit(this.options[0]);
                    this.scrollToCurrent(0);
                }
                break;
            }
            case 'ArrowUp': {
                if (currentIndex > 0) {
                    this.onSelect.emit(this.options[currentIndex - 1]);
                    this.scrollToCurrent(currentIndex - 1);
                } else {
                    this.onSelect.emit(this.options[this.options.length - 1]);
                    this.scrollToCurrent(this.options.length - 1);
                }
                break;
            }
            case 'Enter': {
                if (this.isVisible) {
                    this.selectItem(this.options[currentIndex]);
                }
                break;
            }
            default:
                break;
        }
    }

    isCurrent(item) {
        return this.selected ? (Number.isInteger(item) ? item === this.selected : item.id === this.selected.id) : false;
    }

    opened() {
        this.onOpen.emit();
    }

    closed() {
        this.onClose.emit();
    }
}
