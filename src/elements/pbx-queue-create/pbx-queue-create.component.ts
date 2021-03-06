import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FadeAnimation} from '../../shared/fade-animation';
import {MessageServices} from '../../services/message.services';
import {FormComponent} from '../pbx-form/pbx-form.component';
import {isValidId} from '../../shared/shared.functions';
import {FormBuilder, Validators} from '@angular/forms';
import {FormBaseComponent} from '../pbx-form-base-component/pbx-form-base-component.component';
import {numberRegExp} from '../../shared/vars';
import {numberRangeValidator} from '../../shared/encry-form-validators';

@Component({
    selector: 'pbx-queue-create',
    templateUrl: './template.html',
    styleUrls: ['./local.sass'],
    animations: [FadeAnimation('300ms')]
})

export class QueueCreateComponent extends FormBaseComponent implements OnInit {

    @Input() name: string;
    @Input() service: any;

    @Input() headerText: string;
    @Input() generalHeaderText: string;
    @Input() cmpType;

    @ViewChild(FormComponent) formComponent: FormComponent;

    background: string;

    id: number = 0;

    loading: number = 0;
    saving: number = 0;

    tabs: string[] = [ 'General', 'Members' ];
    activeTabs: boolean[] = [ true, true ];
    currentTab: string = 'General';

    confirm: {} = { value: 'Save', buttonType: 'success', inactive: this.saving !== 0 };
    decline: {} = {
        standard: {value: 'Cancel', buttonType: 'cancel'},
        member: {value: 'Back', buttonType: 'cancel'},
    };

    addMembersMode: boolean = false;

    // -- properties ----------------------------------------------------------

    get model(): any {
        return this.service.item;
    }
    set model(value: any) {
        this.service.item = value;
    }

    get hasId(): boolean {
        return isValidId(this.id);
    }

    get isCallQueue(): boolean {
        return this.name === 'call-queues';
    }

    get tabGeneralActive(): boolean {
        return this.currentTab === this.tabs[0];
    }

    get tabMembersInViewModeActive(): boolean {
        return this.currentTab === this.tabs[1] && !this.addMembersMode;
    }

    get tabMembersInEditModeActive(): boolean {
        return this.currentTab === this.tabs[1] && this.addMembersMode;
    }

    // -- component lifecycle methods -----------------------------------------

    constructor(public router: Router,
                private activatedRoute: ActivatedRoute,
                protected fb: FormBuilder,
                protected message: MessageServices) {
        super(fb, message);

        this.id = this.activatedRoute.snapshot.params.id;
        this.currentTab = this.tabs[0];
        this.background = 'form-body-fill';

        this.validationHost.customMessages = [
            { name: 'Ring Time', error: 'pattern', message: 'Please enter valid number' },
            { name: 'Ring Time', error: 'range', message: 'Please enter value between 15 and 600' },
            { name: 'Maximum Callers in Queue', error: 'pattern', message: 'Please enter valid number' },
            { name: 'Maximum Callers in Queue', error: 'range', message: 'Please enter value between 1 and 100' },
        ];
    }

    ngOnInit(): void {
        this.service.reset();
        this.service.editMode = this.hasId;

        this.getModel(this.id);

        super.ngOnInit();
    }

    initForm(): void {
        this.form = this.fb.group({
            id:          [ '' ],
            name:        [ '', [ Validators.required ] ],
            description: [ '' ],
            sipId:       [ null, [ Validators.required ] ],
            strategy:    [ null, [ Validators.required ] ],
            timeout:     [ '', [ Validators.required, Validators.pattern(numberRegExp), numberRangeValidator(15, 600) ] ],
            // queueMembers: [ null, [ Validators.required ] ],
        });
        if (this.isCallQueue) {
            // Add Call-Queues specific controls
            this.form.addControl('maxlen', this.fb.control(null, [ Validators.required, Validators.pattern(numberRegExp), numberRangeValidator(1, 100) ]));
            this.form.addControl('announceHoldtime', this.fb.control(null));
            this.form.addControl('announcePosition', this.fb.control(null));
        }
        else {
            // Add Ring-Groups specific controls
            // this.form.addControl('action', this.fb.control(null));
        }
    }

    // -- event handlers ------------------------------------------------------

    selectTab(tab: string): void {
        if (!this.validateForms()) {
            return;
        }
        if (tab === 'Members') {
            this.background = 'form-body-empty';
        } else {
            this.background = 'form-body-fill';
        }
        this.addMembersMode = false;
        this.currentTab = tab;

        this.setModelData();
    }

    addMembers(mode: boolean) {
        if (mode) {
            this.background = 'form-body-fill';
        }
        this.addMembersMode = mode;
        this.service.saveMembersBefore();
    }

    save(): void {
        if (!this.validateForms()) return;

        this.setModelData();
        this.saveModel();
    }

    cancel(): void {
        this.close(this.service.editMode, () => this.cancelConfirm());
    }

    cancelConfirm(): void {
        this.router.navigate(['cabinet', this.name]);
    }

    back(): void {
        if (this.currentTab === 'Members') {
            this.background = 'form-body-empty';
        } else {
            this.background = 'form-body-fill';
        }
        this.addMembersMode = false;
        let message = this.service.getMembersMessage();
        message && this.message.writeSuccess(message);
    }

    // -- component model methods ---------------------------------------------

    setModelData(): void {
        super.setModelData(this.model);
    }

    // -- data processing methods ---------------------------------------------

    getModel(id: number) {
        this.loading ++;
        this.service.getItem(id).then(() => {
            this.getParams();
            this.setFormData(this.model);
        }).catch(() => {})
          .then(() => this.loading --);
    }

    getParams() {
        this.loading ++;
        this.service.getParams().then(() => {})
          .catch(() => {})
          .then(() => this.loading --);
    }

    saveModel(): void {
        this.saving ++;
        this.service.save(this.id, true, (response) => {
            if (response && response.errors) {
                if (response.errors.queueMembers) {
                    this.message.writeError(this.formComponent.selected === 'Members'
                        ? 'You have not selected members'
                        : 'You must select members');
                }
                return true;
            }
        }).then(() => {
            this.saveFormState();
            if (!this.id) this.cancel();
        }).catch(() => {})
          .then(() => this.saving --);
    }
}
