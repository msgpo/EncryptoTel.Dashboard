import {Component, Input} from '@angular/core';
import {FadeAnimation} from '../../../shared/fade-animation';
import {RefsServices} from '../../../services/refs.services';
import {CallQueueService} from '../../../services/call-queue.service';
import {RingGroupService} from '../../../services/ring-group.service';

@Component({
    selector: 'pbx-queue-general',
    templateUrl: './template.html',
    styleUrls: ['./local.sass'],
    animations: [FadeAnimation('300ms')]
})

export class QueueGeneralComponent {
    @Input() service;
    @Input() name;
    @Input() generalHeaderText;

    private _cmpType: string;

    constructor() {}

    @Input()
    set cmpType(cmpType: string) {
        this._cmpType = cmpType;
        this.getNumbers();
    }

    loading = 0;
    numbers = [];


    private getNumbers(): void {
        this.loading++;
        this.service.getOuters().then(res => {
            this.numbers = res;
            this.loading--;
        }).catch(() => {
            this.loading--;
        });
    }
}
