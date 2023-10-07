import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { emailRequiredValidator } from '@functions/validator.function';
import { Select, Store } from '@ngxs/store';
import { GeneralSelectors } from 'module/store/general.selectors';
import { environment } from 'environments/environment';


@Component({
  selector: 'shared-app-renewal-form',
  templateUrl: './shared-renewal-form.component.html',
  styleUrls: ['./shared-renewal-form.component.scss']
})

export class SharedRenewalFormComponent implements OnInit {
  @Input("title") title: any;
  @Output('renewalFormEvent') renewalFormEvent: any = new EventEmitter();
  mobileMode?: boolean;

  /*---- From Store ----*/
  @Select(GeneralSelectors.selectLov('MOBILEPREFIX')) mobilePrefix$: any;

  idOption = [
    'NRIC',
    'Passport'
  ]

  /** Form */
  renewalForm: FormGroup = this.fb.group({
    product: new FormControl('Smart Home Cover'),
    name: new FormControl('', Validators.required),
    idType: new FormControl('NRIC', Validators.required),
    id: new FormControl('', Validators.required),
    phoneCountryCode: new FormControl('+6010'),
    mobileNo: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, emailRequiredValidator]),
    emailConfirm: new FormControl('', [Validators.required, emailRequiredValidator]),
    postCode: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]),
    check: new FormControl(false, Validators.requiredTrue),
    recaptcha: new FormControl('', Validators.required)
  });

  recaptchaEnabled$: any;

  /*---- Error ----*/
  invalidPostCode: boolean = false;
  recaptchaKey: any;

  /*-- Helpline --*/
  constructor(
    private fb: FormBuilder,
    private _store: Store,
  ) {
  }

  ngOnInit(): void {
    this.recaptchaEnabled$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) ? this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) : null;
    if (this.recaptchaEnabled$ && this.recaptchaEnabled$ == 'Y') {
      this.renewalForm.get('recaptcha')?.clearValidators();
    }
    this.mobileMode = window.matchMedia('(max-width: 704px)').matches;

    window.matchMedia('(max-width: 704px)').addEventListener('change', () => {
      this.mobileMode = window.matchMedia('(max-width: 704px)').matches;
    });
    this.recaptchaKey = environment.recaptcha.siteKey;
  }

  onEmailChange(): void {
    if (this.renewalForm.controls.email.value !== this.renewalForm.controls.emailConfirm.value) {
      this.renewalForm.controls['email'].setErrors({ 'incorrect': true });
      this.renewalForm.controls['emailConfirm'].setErrors({ 'incorrect': true });
    }
    else {
      this.renewalForm.controls['email'].setErrors(null);
      this.renewalForm.controls['emailConfirm'].setErrors(null);
    }
  }

  validatePostCode() {
    const value = this.renewalForm.get('postCode')?.value

    if (value.length > 0 && value.length === 5) {
      const postCodeList$ = this._store.selectSnapshot((state) => state.GeneralState.postcodeList);

      let postcode = postCodeList$.filter((item: any) => item.Postcode == value);
      if (postcode.length < 1) {
        this.invalidPostCode = true;
        this.renewalForm.get('postCode')?.markAsDirty();
        this.renewalForm.get('postCode')?.markAsTouched();
        this.renewalForm.get('postCode')?.setErrors({ invalid: true });
      } else {
        this.invalidPostCode = false;
      }
    }
    else if (value.length > 0 && value.length !== 5) {
      this.invalidPostCode = true;
      this.renewalForm.get('postCode')?.markAsDirty();
      this.renewalForm.get('postCode')?.markAsTouched();
      this.renewalForm.get('postCode')?.setErrors({ invalid: true });
    }
  }

  submitForm(): void {
    const formValue = this.renewalForm.getRawValue();
    this.renewalFormEvent.emit(formValue);
  }
}
