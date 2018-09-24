import {Component, ElementRef, EventEmitter, Input, Output, ViewChild, OnInit} from '@angular/core';

import {FadeAnimation} from '../../shared/fade-animation';
import {killEvent} from '../../shared/shared.functions';


@Component({
    selector: 'pbx-button',
    templateUrl: './template.html',
    styleUrls: ['./local.sass'],
    animations: [FadeAnimation('300ms')]
})
export class ButtonComponent implements OnInit {
    @Input() name: string;
    @Input() value: string;
    @Input() buttonType: string;
    @Input() loading: boolean;
    @Input() inactive: boolean;

    @Output() onClick: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('button') button: ElementRef;

    constructor() {
        if (!this.value) this.value = 'Submit';
        if (!this.buttonType) this.buttonType = 'accent';
    }

    ngOnInit(): void {}

    clicked(event?: MouseEvent): void {
        killEvent(event);

        const div = document.createElement('div');
        
        const radius = this.button.nativeElement.clientWidth;
        div.style.width = div.style.height = radius + 'px';
        div.style.top = event.offsetY - radius / 2 + 'px';
        div.style.left = event.offsetX - radius / 2 + 'px';
        div.classList.add('button_overlay');
        this.button.nativeElement.appendChild(div);
        
        if (radius < 150) {
            div.classList.add('small');
            setTimeout(() => {
                this.button.nativeElement.removeChild(div);
            }, 300);
        }
        else if (radius >= 150 && radius < 300) {
            div.classList.add('medium');
            setTimeout(() => {
                this.button.nativeElement.removeChild(div);
            }, 400);
        }
        else {
            setTimeout(() => {
                this.button.nativeElement.removeChild(div);
            }, 550);
        }

        this.onClick.emit();
    }
}
