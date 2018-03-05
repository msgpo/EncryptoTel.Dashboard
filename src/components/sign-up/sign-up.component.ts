import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

import {AuthorizationServices} from '../../services/authorization.services';
import {UserServices} from '../../services/user.services';

import {FadeAnimation} from '../../shared/fade-animation';
import {passwordConfirmation} from '../../shared/password-confirmation';
import {validateForm} from '../../shared/shared.functions';
import * as _vars from '../../shared/vars';

@Component({
  selector: 'sign-up',
  templateUrl: './template.html',
  animations: [FadeAnimation('300ms')]
})
export class SignUpComponent implements OnInit, OnDestroy {
  constructor(private _router: Router,
              private _user: UserServices,
              public _services: AuthorizationServices) {}
  loading = false;
  errorsSubscription: Subscription;
  error: string;
  signUpForm: FormGroup;
  /*
  Form field validation. Accepted params:
  Name: string - form field name,
  Error Type: string - validation type (not necessary)
 */
  inputValidation(name: string, errorType?: string): boolean {
    if (errorType) {
      const field = this.signUpForm.controls[name];
      return field.errors[errorType] && (field.dirty || field.touched);
    } else {
      const field = this.signUpForm.controls[name];
      return field.invalid && (field.dirty || field.touched);
    }
  }

  /*
    Form passwords match validation.
   */
  passwordsMismatch(): boolean {
    const confirm = this.signUpForm.controls['password_confirmation'];
    const password = this.signUpForm.controls['password'];
    if (this.signUpForm.errors && ((confirm.touched || confirm.dirty) || (password.touched || password.dirty))) {
      return this.signUpForm.errors.mismatch;
    } else {
      return false;
    }
  }
  /*
    Sign-up action
   */
  signUp(ev?: Event): void {
    if (ev) { ev.preventDefault(); }
    validateForm(this.signUpForm);
    if (this.signUpForm.valid) {
      this.loading = true;
      this._services.signUp(this.signUpForm.value).then(() => {
        this.loading = false;
      }).catch(() => this.loading = false);
    }
  }
  ngOnInit(): void {
    this._services.clearError();
    this.errorsSubscription = this._services.readError().subscribe(error => {
      this.error = error;
    });
    if (this._user.fetchUser()) {
      this._router.navigateByUrl('/cabinet');
    }
    this.signUpForm = new FormGroup({
      'name': new FormControl(null, [
        Validators.required,
        Validators.pattern(_vars.nameRegExp)
      ]),
      'surname': new FormControl(null, [
        Validators.pattern(_vars.nameRegExp)
      ]),
      'email': new FormControl(null, [
        Validators.required,
        Validators.pattern(_vars.emailRegExp)
      ]),
      'password': new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      'password_confirmation': new FormControl(),
    }, passwordConfirmation);
  }
  ngOnDestroy(): void {
    this._services.clearError();
    this.errorsSubscription.unsubscribe();
  }
}