import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { Select, Store } from '@ngxs/store';
import { NavigationService } from '@services/navigation.service';
import { GeneralSelectors } from 'module/store/general.selectors';
import { emailRequiredValidator } from '@functions/validator.function';
import { hideChatBot } from '@functions/chatBot.function';
import emailConfirmValidator from '@functions/validator-email-confirm.function';
import { environment } from 'environments/environment';

@Component({
  selector: 'shared-app-leave-details',
  templateUrl: './shared-leave-details.component.html',
  styleUrls: ['./shared-leave-details.component.scss']
})
export class SharedLeaveDetailsComponent implements OnInit {
  @Input('header') header: any;
  @Input('subheader') subheader: any;
  @Input('logo') logo: any;

  @Output('leaveDetailsEvent') leaveDetailsEvent: any = new EventEmitter();
  @Select(GeneralSelectors.selectLov('MOBILEPREFIX')) mobilePrefix$: any;
  @Select(GeneralSelectors.selectLov('PREFLANGUAGE')) preflanguage$: any;
  @Select(GeneralSelectors.selectLov('STATE')) state$: any;
  @Select(GeneralSelectors.selectLov('CITY')) city$: any;

  success: boolean = false;
  imageFolder: string = IMAGE_FOLDER;

  /** Form */
  leaveDetailsForm: FormGroup = this.fb.group({
    name: new FormControl('', Validators.required),
    phoneCountryCode: new FormControl('+6010'),
    mobileNo: new FormControl('', Validators.required),
    email: new FormControl('', emailRequiredValidator),
    emailConfirm: new FormControl('', emailRequiredValidator),
    check: new FormControl(false, Validators.requiredTrue),
    recaptcha: new FormControl('', Validators.required),
  },
    {
      validators: [emailConfirmValidator.match('email', 'emailConfirm')]
    });
  sourceSystem$: any;
  recaptchaEnabled$: any;
  recaptchaKey: any;

  constructor(private fb: FormBuilder, public navigation: NavigationService, private _store: Store,) {
    this.sourceSystem$ = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
    if (this.sourceSystem$ == 'SCOL' || this.sourceSystem$ == 'HSBCBN') {
      this.leaveDetailsForm = this.fb.group({
        name: new FormControl('', Validators.required),
        phoneCountryCode: new FormControl('+6010'),
        mobileNo: new FormControl('', Validators.required),
        email: new FormControl('', emailRequiredValidator),
        emailConfirm: new FormControl('', emailRequiredValidator),
        preflanguage: new FormControl('', Validators.required),
        state: new FormControl('', Validators.required),
        city: new FormControl('', Validators.required),
        check: new FormControl(false, Validators.requiredTrue),
        recaptcha: new FormControl('', Validators.required),
      },
        {
          validators: [emailConfirmValidator.match('email', 'emailConfirm')]
        });
    }
  }

  ngOnInit(): void {
    hideChatBot();
    this.recaptchaEnabled$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) ? this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) : null;
    if (window.location.hostname == 'localhost') {
      this.recaptchaEnabled$ = 'N'
      this.recaptchaKey = environment.recaptcha.siteKey;
    } else {
      this.recaptchaEnabled$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) ? this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) : 'Y';
      this.recaptchaKey = environment.recaptcha.siteKey;
    }
    if (this.recaptchaEnabled$ == 'N') {
      this.leaveDetailsForm.get('recaptcha')?.clearValidators();
    }
  }

  onSubmit() {
    const formValue = this.leaveDetailsForm.getRawValue();
    this.leaveDetailsEvent.emit(formValue);
    this.success = true;
  }
}
