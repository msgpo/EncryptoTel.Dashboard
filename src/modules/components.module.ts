import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularSvgIconModule} from 'angular-svg-icon';
import {FormsModule} from '@angular/forms';

import {ElementsModule} from './elements.module';
import {MainRouterModule} from './router.module';

import {PageNotFoundComponent} from '../components/errors/page-not-found/page-not-found.component';

import {IndexComponent} from '../components/index/index.component';
import {SignInComponent} from '../components/sign-in/sign-in.component';
import {SignUpComponent} from '../components/sign-up/sign-up.component';
import {EmailConfirmComponent} from '../components/confirmation/email-confirm.component';
import {CodeConfirmComponent} from '../components/confirmation/code-confirm.component';
import {PasswordRecoveryComponent} from '../components/password-recovery/password-recovery.component';
import {PasswordResetComponent} from '../components/confirmation/password-reset.component';
import {DashboardComponent} from '../components/dashboard/dashboard.component';
import {TariffPlansComponent} from '../components/tariff-plans/tariff-plans.component';
import {SignUpTariffPlansComponent} from '../components/sign-up/tariff-plans/sign-up-tariff-plans.component';
import {SignUpFormComponent} from '../components/sign-up/sign-up-form/sign-up-form.component';
import {BlankComponent} from '../components/blank/blank.component';
import {SettingsComponent} from '../components/settings/settings.component';
import {TemporaryCodeComponent} from '../components/temporary-code/temporary-code.component';
import {CallQueuesComponent} from '../components/call-queues/call-queues.component';
import {CallQueuesCreateComponent} from '../components/call-queues/call-queues-create/call-queues-create.component';
import {CallQueuesGeneralComponent} from '../components/call-queues/call-queues-create/tabs/general/call-queues-general.component';
import {CallQueuesMembersComponent} from '../components/call-queues/call-queues-create/tabs/members/call-queues-members.component';
import {CallQueuesMembersAddComponent} from '../components/call-queues/call-queues-create/tabs/members/add/call-queues-members-add.component';


/*
  Components declarations and exports
 */

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularSvgIconModule,
    ElementsModule,
    MainRouterModule,
    FormsModule
  ],
  declarations: [
    PageNotFoundComponent,
    IndexComponent,
    SignInComponent,
    SignUpComponent,
    EmailConfirmComponent,
    CodeConfirmComponent,
    TemporaryCodeComponent,
    PasswordRecoveryComponent,
    PasswordResetComponent,
    DashboardComponent,
    TariffPlansComponent,
    SignUpTariffPlansComponent,
    SignUpFormComponent,
    DashboardComponent,
    BlankComponent,
    SettingsComponent,
    CallQueuesComponent,
    CallQueuesCreateComponent,
    CallQueuesGeneralComponent,
    CallQueuesMembersComponent,
    CallQueuesMembersAddComponent
  ],
  exports: [
    ElementsModule,
    PageNotFoundComponent,
    IndexComponent,
    SignInComponent,
    SignUpComponent,
    EmailConfirmComponent,
    CodeConfirmComponent,
    TemporaryCodeComponent,
    PasswordRecoveryComponent,
    PasswordResetComponent,
    DashboardComponent,
    BlankComponent,
    CallQueuesComponent,
    CallQueuesCreateComponent,
    CallQueuesGeneralComponent,
    CallQueuesMembersComponent,
    CallQueuesMembersAddComponent
  ]
})
export class ComponentsModule {
}
