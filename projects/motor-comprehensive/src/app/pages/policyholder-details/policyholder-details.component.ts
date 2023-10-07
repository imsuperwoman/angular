import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, UntypedFormGroup,ValidationErrors, Validators } from '@angular/forms';
import { FormService } from '@services/form.service';
import { QuotationSummaryService } from '../../services/quotation-summary.service';
import { emailRequiredValidator } from '@functions/validator.function';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { HEADER, LOGO, SUBHEADER, AZOL } from '../../constants/motor-online-constants';

import { Select, Store, ActionCompletion, ofActionSuccessful, Actions, ofActionCompleted } from '@ngxs/store';
import { MO_CHECK_SANCTION, MO_QUALITY_CHECK, MO_QUOTE_PROGRESS, CHECK_HSBC_CARD} from '../../store/actions/quote-progress.action';
import { GeneralSelectors } from 'module/store/general.selectors';
import { MO_SET_STEP_4 } from '../../store/actions/user-input.action';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { CustomFieldsService } from '@services/customFields.service';
import { GeneralServiceSelect } from 'module/store/general.service.select';
import { MODAL_MESSAGE } from '../../constants/get-info.constants';
import { QuoteProgessState } from '../../store/states/quote-progress.state';

@Component({
  selector: 'app-policyholder-details',
  templateUrl: 'policyholder-details.component.html',
  styleUrls: ['policyholder-details.component.scss'],
})
export class PolicyholderDetailsComponent implements OnInit, OnDestroy {
  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;

  @ViewChild('stepper') stepper: any;
  @ViewChild('notificationModal') notificationModal: any;

  /*---- Modal Dialog ----*/
  @ViewChild('leaveMyDetailsDialog') leaveMyDetailsDialog: any;
  @ViewChild('commonErrorDialog') commonErrorDialog: any;
  @ViewChild('serverTimeoutDialog') serverTimeoutDialog: any;
   @ViewChild('hsbcCardHolderDialog') hsbcCardHolderDialog: any;
  serverTimeoutDialogHeader = MODAL_MESSAGE.serverTimeoutDialogHeader;
  serverTimeoutDialogDescription = MODAL_MESSAGE.serverTimeoutDialogDescription;
  commonErrorDialogHeader = '';
  commonErrorDescription = '';

  public modal!: string;
  public dynamicContent: any;
  isLoading: boolean = true;
  isSummariesLoading: boolean = true;

  /*---- Form ----*/
  motorComprehensiveForm: UntypedFormGroup = new UntypedFormGroup({});
  policyholderForm!: UntypedFormGroup;
  policyholder!: UntypedFormGroup; 
  hsbcCardChecking!: UntypedFormGroup;

  /*---- Quotation Summaries ----*/
  summaries: any = [];
  flowSelectedType: any;
  /*---- Params ----*/
  activePartner: any;
  hasStaffEmail: boolean = false;
  productConfig$: any;
  fields: any = [];
   sourceSystem$: any;

   /*---- Error ----*/
  validhsbcCard: boolean = false;

  /*---- From Store ----*/
  @Select(GeneralSelectors.selectLov('CUSTIDTYPE')) custIDType$: any;
  @Select(GeneralSelectors.selectLov('MOBILEPREFIX')) mobilePrefix$: any;
  @Select(GeneralSelectors.selectLov('NATIONALITY')) nationality$: any;
  @Select(QuoteProgessState.selectedPackageCode) selectedPackageCode$: any
  @Select(GeneralSelectors.flowType) flowType$: any;
  private ngUnsubscribe = new Subject<void>();

  constructor(
    private router: Router,
    private changeDetectionRef: ChangeDetectorRef,
    private formService: FormService,
    private quotationSummaryService: QuotationSummaryService,
    private spinnerOverlayService: SpinnerOverlayService,
    private _store: Store,
    private generalService: GeneralService,
    private customFieldsService: CustomFieldsService,
    private generalServiceSelect: GeneralServiceSelect,
    private action$: Actions,
  ) {
    this.dynamicContent = this._store.selectSnapshot((state) => state.GeneralState.dynamicContent);
    this.productConfig$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig);
    this.sourceSystem$ = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    /*---- Form ----*/
    const formValues = this.formService.getForms();
    if (!formValues) return;
    var userInput = this._store.selectSnapshot((state) => state.UserInputState.userInput);
    this.flowSelectedType = userInput.selected
    Object.keys(formValues).forEach((formValue: any) => {
      if (formValue === 'coverageForm') {
        let formGroup = this.generalService.coverageFormControls(formValues[formValue]);
        this.motorComprehensiveForm.addControl(formValue, formGroup);
      } else {
        let formGroup = this.formService.generateControls(formValues[formValue]);
        this.motorComprehensiveForm.addControl(formValue, formGroup);
      }
    });   
    
   

    this.motorComprehensiveForm.valueChanges.subscribe((value) => {
      this.formService.updateForms(this.motorComprehensiveForm);
    });

    this.initializeForm();

    if (this.productConfig$ ?.voucherEmailDomain != undefined) {
      this.hasStaffEmail = true;
      this.getPolicyholder.get('email')
        ?.setValidators([Validators.required, this.validateEmailWithoutDomain.bind(this)]);
    } else {
      this.getPolicyholder
        .get('email') ?.setValidators([Validators.required, emailRequiredValidator]);
    }

    /*---- Additional Driver Handling ----*/
    this.initialDisplayAdditionalDriver();
    this.getAdditionalDriver.updateValueAndValidity();

    this.initialDisplayehailingDriver();
    this.geteHailingDriver.updateValueAndValidity();

    this.policyholderForm = this.getPolicyholderForm;
    this.policyholder = this.getPolicyholder;
    this.hsbcCardChecking = this.gethsbcCardChecking;

    this.summaries = this.quotationSummaryService.fetchSummary();

    var excessAmount = this._store.selectSnapshot((state) => state.quote ?.premium ?.excessAmount)
    this.summaries.purchaseNote = `*Excess of RM ${excessAmount ? excessAmount : 0} is applicable.`
    var selectedPackageCode = this._store.selectSnapshot((state) => state.QuoteProgessState.quote.selectedPackageCode)
    var mainFlowType = this._store.selectSnapshot((state) => state.GeneralState.flowType);
    var flowSelected = this._store.selectSnapshot((state) => state.UserInputState ?.userInput ?.selected);
    if (selectedPackageCode && flowSelected == 'direct' && mainFlowType == 'DIRECT') {
      this.summaries.additionalPartnerPurchaseNote = "";
    }

    this.isSummariesLoading = false;
    this.isLoading = false;

    if (this.dynamicContent.Header.contents) {
      this.customFieldsService.customFieldsService(this.dynamicContent.Header.contents, this.getPolicyholder, this.fields)
    }

    var customViewObj = this._store.selectSnapshot((state) => state.GeneralState.customViewObj);

    if (customViewObj.utm_source != undefined) {
      this.activePartner = true;
    }

    if (this.sourceSystem$ == 'HSBCBN') {
      this.policyholderForm?.get('hsbcCardChecking')?.enable();
    } else {
       this.policyholderForm?.get('hsbcCardChecking')?.disable();
    }
    
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).select();

    this.changeDetectionRef.detectChanges();
  }

  initializeForm(): void {
    var step1$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);
    var step2$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2);

    this.getPolicyholder.get('dob') ?.setValue(step2$ ?.ownerDetails.dob);
    this.getPolicyholder.get('idType') ?.setValue(this.getQuoteForm.get('idType') ?.value);
    this.getPolicyholder.get('idNo') ?.setValue(this.getQuoteForm.get('idNo') ?.value);
    this.getPolicyholder.get('gender')
      ?.setValue(this.getVehicleOwnerDetailsForm.get('ownerDetails') ?.get('gender') ?.value);
    this.getPolicyholder.get('dob') ?.disable();
    this.getPolicyholder.get('idType') ?.disable();
    this.getPolicyholder.get('idNo') ?.disable();
    this.getPolicyholder.get('gender') ?.disable();

    if (this.getQuoteForm.get('idType') ?.value !== 'PASS') {
      this.getPolicyholder.get('nationality') ?.setValue('MAL');
    } else {
      this.getPolicyholder.get('nationality') ?.enable();
    }
    var postcodeList = this._store.selectSnapshot((state) => state.GeneralState ?.postcodeList)
    var stateCode = postcodeList.find((item: any) => item.Postcode == step1$.postcode)

    this.getPolicyholder.get('address') ?.get('postcode') ?.setValue(step1$.postcode);
    this.getPolicyholder.get('address') ?.get('city') ?.setValue(stateCode ?.CityDescp);
    this.getPolicyholder.get('address') ?.get('state') ?.setValue(stateCode ?.StateDescp);
    this.getPolicyholder.get('address') ?.get('postcode') ?.disable();
    this.getPolicyholder.get('address') ?.get('city') ?.disable();
    this.getPolicyholder.get('address') ?.get('state') ?.disable();
    this.getPolicyholder.get('address') ?.get('line1') ?.setValidators([Validators.required]);

  }

  initialDisplayAdditionalDriver(): void {
    /*---- Additional Driver Handling ----*/
    if (!this.displayAdditionalDriver()) {
      this.getAdditionalDriver.clearValidators();
    } else {
      if (
        this.getCoverageAdditionalDriverAmount == '1 additional drivers' ||
        this.getCoverageAdditionalDriverAmount == '2 additional drivers'
      ) {
        this.getAdditionalDriver.get('driver1') ?.get('fullname') ?.addValidators([Validators.required]);
        this.getAdditionalDriver.get('driver1') ?.get('idType') ?.addValidators([Validators.required]);
        this.getAdditionalDriver.get('driver1') ?.get('idNo') ?.addValidators([Validators.required]);
      }

      if (this.getCoverageAdditionalDriverAmount == '2 additional drivers') {
        this.getAdditionalDriver.get('driver2') ?.get('fullname') ?.addValidators([Validators.required]);
        this.getAdditionalDriver.get('driver2') ?.get('idType') ?.addValidators([Validators.required]);
        this.getAdditionalDriver.get('driver2') ?.get('idNo') ?.addValidators([Validators.required]);
      }

      if (
        this.getCoverageAdditionalDriverAmount == '1 additional drivers' &&
        this.getAdditionalDriver.get('driver2')
      ) {
        this.getAdditionalDriver.get('driver2') ?.reset();
        this.getAdditionalDriver.get('driver2') ?.get('fullname') ?.removeValidators([Validators.required]);
        this.getAdditionalDriver.get('driver2') ?.get('idType') ?.removeValidators([Validators.required]);
        this.getAdditionalDriver.get('driver2') ?.get('idNo') ?.removeValidators([Validators.required]);
      }
    }
  }

  initialDisplayehailingDriver(): void {
    if (!this.displayeHailingDriver()) {
      this.geteHailingDriver.clearValidators();
    } else {
      this.geteHailingDriver ?.get('fullname') ?.addValidators([Validators.required]);
      this.geteHailingDriver ?.get('idType') ?.addValidators([Validators.required]);
      this.geteHailingDriver ?.get('idNo') ?.addValidators([Validators.required]);
    }
  }

  displayAdditionalDriver(): boolean {
    return (
      this.motorComprehensiveForm
        ?.get('coverageForm')
          ?.get('additionalCoverages')
            ?.get('additionalDriver') ?.value &&
              this.getCoverageAdditionalDriverAmount != 'Unlimited drivers'
    );
  }

  displayeHailingDriver(): boolean {
    var additionalCover = this._store.selectSnapshot((state) => state.UserInputState.userInput.step3.additionalCover);
    try {
      var eHailing = additionalCover ?.filter((item: any) => item.coverCode == 'A202');

      if (eHailing.length > 0) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }

  get getCoverageAdditionalDriverAmount(): any {
    return this.motorComprehensiveForm
      ?.get('coverageForm')
        ?.get('additionalCoverages')
          ?.get('additionalDriverAmount') ?.value;
  }

  get getPolicyholderForm(): UntypedFormGroup {
    return this.motorComprehensiveForm.get('policyholderForm') as UntypedFormGroup;
  }

  get getPolicyholder(): UntypedFormGroup {
    return this.motorComprehensiveForm.get('policyholderForm') ?.get('policyholder') as UntypedFormGroup;
  }

  get getAdditionalDriver(): UntypedFormGroup {
    return this.motorComprehensiveForm
      .get('policyholderForm') ?.get('additionalDriver') as UntypedFormGroup;
  }

  get geteHailingDriver(): UntypedFormGroup {
    return this.motorComprehensiveForm
      .get('policyholderForm') ?.get('ehailingDriver') as UntypedFormGroup;
  }

  get getQuoteForm(): UntypedFormGroup {
    return this.motorComprehensiveForm.get('quoteForm') as UntypedFormGroup;
  }

  get getVehicleOwnerDetailsForm(): UntypedFormGroup {
    return this.motorComprehensiveForm.get('vehicleOwnerDetailsForm') as UntypedFormGroup;
  }
  get gethsbcCardChecking(): UntypedFormGroup {
  return this.motorComprehensiveForm
      .get('policyholderForm') ?.get('hsbcCardChecking') as UntypedFormGroup;
  }

  
  validateEmailWithoutDomain(control: AbstractControl): ValidationErrors | null {
    if (!control.value || !control.value.length) {
      return null;
    } else if (control.value && control.value.match(/^\w+([\.-]?\w+)+$/i)) {
      return null;
    } else {
      return { invalid: true, message: 'Please enter a valid email. ' };
    }
  }

  checkEmpty(data: string) {
    if (data == undefined || data == '' || data == null) {
      return false;
    } else {
      return true;
    }
  }

  checkUserInfo(info: any) {
    var payload;
    var productConfig = this._store.selectSnapshot<any>(
      (state) => state.GeneralState.productConfig
    );
    if (info == 'phoneNo') {
      var prefixNumber = this.policyholder.get('phonePrefix') ?.value;
      var phoneNumber = this.policyholder.get('phoneNo') ?.value;
      if (this.policyholder ?.get('phoneNo') ?.valid) {
        payload = {
          agentCode: productConfig.AgentCode,
          mobileNo: prefixNumber.replace('+', '') + phoneNumber
        };
      }
    } else if (info == 'email' || info == 'staffEmail') {
      const customerEmail = info == 'email' ? this.policyholder.get('email') ?.value : `${this.policyholder.get('email') ?.value}${this.productConfig$ ?.voucherEmailDomain}`

      if (this.policyholder.get('email') ?.valid) {
        payload = {
          agentCode: productConfig.AgentCode,
          email: customerEmail,
        };
      }
    }

    if (this.policyholder.get('email') ?.valid || this.policyholder.get('mobile') ?.valid) {
      this._store.dispatch(new MO_QUALITY_CHECK(payload)).subscribe((res) => {
        if (res.QuoteProgessState.checkUserInfo) {
          if (info == 'email' || info == 'staffEmail') {
            this.commonErrorDialogHeader = 'This email address is already in use';
            this.commonErrorDescription = 'Please enter another email address to proceed.';
            this.commonErrorDialog.open();
          } else {
            this.commonErrorDialogHeader = 'This mobile no is already in use';
            this.commonErrorDescription = 'Please enter another mobile no to proceed.';
            this.commonErrorDialog.open();
          }
        }
      });
    }
  }

  async proceedNext(): Promise<void> {
    var policyholderForm = this.policyholderForm.getRawValue();
    if (this.productConfig$ ?.voucherEmailDomain != undefined) {
      var newEmail = this.policyholder.get('email') ?.value + this.productConfig$ ?.voucherEmailDomain;
      policyholderForm.policyholder.email = newEmail;
    }

    this._store.dispatch(new MO_SET_STEP_4(policyholderForm));
    var quoteProgressState = this._store.selectSnapshot((state => state.QuoteProgessState));
    var policyholderDetails = this.policyholderForm.getRawValue().policyholder
    var userInput = this._store.selectSnapshot((state => state.UserInputState.userInput));
    var payload = {
      "appName": AZOL,
      "clientRefNo": quoteProgressState ?.vehicleDetails ?.contractNumber,
      "personsList": [
        {
          "fullName": policyholderDetails ?.fullname,
          "dob": policyholderDetails ?.dob,
          "nationCode": policyholderDetails ?.nationality,
          "countryCode": this.generalServiceSelect.selectLovDescription('NATIONALITY', policyholderDetails ?.nationality),
          "idType": policyholderDetails ?.idType,
          "idval": userInput.step1.idNo,
          "role": "POLICY HOLDER",
        }]
    }

    var scanctionCheck = await this.checkSanction(payload);
    if (!scanctionCheck) return;
    this.spinnerOverlayService.showLoadOverlay();
    var checkHSBCHolder =
      await this.checkHSBCHolder();
    if (!checkHSBCHolder) { return this.spinnerOverlayService.hideLoadOverlay(); }
    
    this._store.dispatch(new MO_QUOTE_PROGRESS('USERDETAILS', 4, ''));

    this.action$
      .pipe(ofActionCompleted(MO_QUOTE_PROGRESS),
      takeUntil(this.ngUnsubscribe))
      .subscribe((data: ActionCompletion) => {
        if (data.result.error) {
          this.spinnerOverlayService.hideLoadOverlay();
          this.serverTimeoutDialog.open()
        }
      });

    this.action$.pipe(ofActionSuccessful(MO_QUOTE_PROGRESS))
      .subscribe(async () => {
        this.router.navigate(['/checkout'], { queryParamsHandling: 'preserve' });
        this.spinnerOverlayService.hideLoadOverlay();
      });

  }

  leaveMyDetailsDialogHeader = '';
  leaveMyDetailsDialogDescription = 'Oops! We are sorry that we are unable to process your request due to our online ' +
  'risk acceptance controls. Please leave your details and our representative will ' +
  'contact you to assist you further.'

  async checkSanction(payload: any) {
    var result = false;
    if (this.policyholderForm.valid) {
      await firstValueFrom(
        this._store.dispatch(new MO_CHECK_SANCTION(payload))
      ).then((_) => {
        if (_.QuoteProgessState.checkSanction) {
          //flowType = 'DIRECT';'STAFFR'; 'REFERRAL'; 'BANK';'AGENT';
          this.flowType$ ?.subscribe((res: any) => {
            if (res == 'DIRECT') {
              this.commonErrorDialogHeader = '';
              this.commonErrorDescription = 'Oops! We are sorry that we are unable to process your request due to our online ' +
                'risk acceptance controls. Please contact an Allianz representative for assistance.';
              this.commonErrorDialog.open();
            } else {
              this.leaveMyDetailsDialog.open();
            }
          });
          result = false;
        } else {
          result = true;
        }
      });
    }
    return result;
  }

    hsbcCardHolderHeader = '';
  hsbcCardHolderDescription = 'Sorry, this application is open to HSBC Malaysia Debit/Credit cardholders who is currently in Malaysia only. To apply, ';

  hsbcCardHolderError() {
    this.hsbcCardHolderDialog.open();
  }

  checkHsbcCardHolderNumber() {
    const value =this.hsbcCardChecking
      ?.get('hsbcCardHolderNumber')?.value;
    this._store.dispatch(new CHECK_HSBC_CARD(value)).subscribe((res) => {
      if (!res.QuoteProgessState.checkUserInfo) {
        this.commonErrorDialogHeader = '';
        this.commonErrorDescription = 'Sorry but you have entered an incorrect number & this plan is only available for HSBC Malaysia Debit / Credit Card customers.';
        this.commonErrorDialog.open();
        this.validhsbcCard = false;
      } else {
        this.validhsbcCard = true;
      }
    });
  }
    async checkHSBCHolder(): Promise<boolean> {
    if (this.hsbcCardChecking?.enabled) {
      var hsbcCardHolder = this.hsbcCardChecking.get('hsbcCardHolder')?.value;
      // Check again if user select back to quatation screen
      if (hsbcCardHolder == 'false') {
        this.hsbcCardHolderError();
        return false;
      } else {
        this.checkHsbcCardHolderNumber();
        return this.validhsbcCard;
      }
    }

    return true;
  }  
}
