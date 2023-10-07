import { ChangeDetectorRef, Component, HostListener, TemplateRef, OnDestroy, OnInit, ViewChild, NgZone } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import {
  Actions,
  ofActionCompleted,
  ActionCompletion,
  ofActionSuccessful,
  Select,
  Store,
} from '@ngxs/store';
import { SET_STEP_3 } from '../../store/actions/user-input.action';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { GeneralSelectors } from 'module/store/general.selectors';
import { RenewalPolicyService } from '../../services/renewal-policy.service';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { Router } from '@angular/router';
import {
  CHECK_HSBC_CARD,
  CHECK_USER_INFO,
  DO_SANCTION_CHECKING,
  PUT_CUSTOMER_DETAILS,
} from '../../store/actions/quote-progess.action';
import * as moment from 'moment';
import { firstValueFrom, Subject, Subscription, takeUntil } from 'rxjs';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { ServerTimeoutDialogComponent } from 'module/server-timeout-dialog/server-timeout-dialog.component';
import { QuoteProgessState, UserInputState } from '../../store/states';
import { emailRequiredValidator, emailValidator, postCodeValidator } from '@functions/validator.function';
import { nricValidator } from '@functions/validator-nric.function';
import { hideChatBot } from '@functions/chatBot.function';
import bankEmailValidator from '../../functions/bank-email-validator.function';
import { FormService } from '@services/form.service';


@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss'],
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  @HostListener('window:beforeunload', ['$event']) unloadHandler(event: Event) {
    event.returnValue = false;
  }

  @ViewChild('stepper') stepper: any;
  @ViewChild('commonErrorDialog') commonErrorDialog: any;
  @ViewChild('leaveMyDetailsDialog') leaveMyDetailsDialog: any;
  @ViewChild('hsbcCardHolderDialog') hsbcCardHolderDialog: any;

  checkInfoModalRef!: NxModalRef<any>;
  activeDialogRef!: NxModalRef<any>;
  public modalMessage: any;
  public dynamicContent: any;
  imageFolder: string = IMAGE_FOLDER;
  renewal: boolean = false;
  hasStaffEmail: boolean = false;
  selectedPolicy: number = 0;
  mobileMode?: boolean;
  /*---- Error ----*/
  validhsbcCard: boolean = false;

  /*---- Forms ----*/
  smartHomeCoverForm: FormGroup = new FormGroup({});
  policyForm!: FormGroup;
  policyDetailsForm!: FormGroup;
  coverageForm!: FormGroup;
  propertyDetails!: FormGroup;
  correspondenceDetails!: FormGroup;
  customerDetails!: FormGroup;
  financialInterest!: FormGroup;
  combinesNamesArray!: FormArray;
  hsbcCardChecking!: FormGroup;

  /*---- Array Lengths ----*/
  financialArrayLength: any = 0;
  combineArrayLength: any = 0;
  combineNamesDetails: any = [];

  /** Edit Check use for renewal */
  financialEdit: boolean = false;
  combinesNamesEdit: boolean = false;
  showEmailConditionFI: boolean = false;

  /*---- From Store ----*/
  @Select(GeneralSelectors.selectLov('BUILDSTOREY')) buildStorey$: any;
  @Select(GeneralSelectors.selectLov('NATIONALITY')) nationality$: any;
  @Select(GeneralSelectors.selectLov('STATE')) states$: any;
  @Select(GeneralSelectors.selectLov('CITY')) cities$: any;
  @Select(GeneralSelectors.selectLov('MOBILEPREFIX')) mobilePrefix$: any;
  @Select(GeneralSelectors.selectLov('CUSTIDTYPE')) custIDType$: any;
  @Select(GeneralSelectors.selectLov('GENDER')) gender$: any;
  @Select(GeneralSelectors.selectLov('COMBROLE')) combrole$: any;
  @Select(GeneralSelectors.selectLov('FINANCIALTYPE')) financialTypes$: any;
  @Select(GeneralSelectors.selectLov('BANKCODE')) bankCodes$: any;
  @Select(GeneralSelectors.selectBankWithOther('BANKCODE')) bankCodeWithOther$: any;
  @Select(UserInputState.epolicyInquiry) epolicyInquiry$: any;
  @Select(UserInputState.coverageType) coverageType$: any;
  @Select(GeneralSelectors.flowType) flowType$: any;

  step1Data$: any;
  step2Data$: any;
  renewal$: any;
  postCodeList$: any;
  productConfig$: any;
  sourceSystem$: any;

  minDate = moment().add(1, 'day');
  maxDate = moment().add(3, 'month').subtract(1, 'day');
  maxDateDOB = moment().subtract(17, 'years');
  minDateDOB = moment().subtract(80, 'years');
  private ngUnsubscribe = new Subject<void>();

  /** customFieldsData */
  customFieldsData: any = {
    cardNo1: '',
    cardNo2: '',
    cardNo3: '',
    staffId: '',
  };

  /*---- Modal Dialog ----*/
  commonErrorDialogHeader = '';
  commonErrorDescription = '';

  /*-- GEO Code --*/
  geoLabel = '';
  showAddress = false;

  constructor(
    private _store: Store,
    public formService: FormService,
    public renewalPolicyService: RenewalPolicyService,
    public changeDetectionRef: ChangeDetectorRef,
    public dialogService: NxDialogService,
    private router: Router,
    private action$: Actions,
    private spinnerOverlayService: SpinnerOverlayService,
    private changeDetectorRef: ChangeDetectorRef,
    private zone: NgZone,
  ) {
    this.step1Data$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.step1);
    this.step2Data$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.step2.mainData);
    this.renewal$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.renewal);
    this.postCodeList$ = this._store.selectSnapshot((state) => state.GeneralState.postcodeList);
    this.productConfig$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig);
    this.sourceSystem$ = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
    this.dynamicContent = this._store.selectSnapshot((state) => state.GeneralState.dynamicContent);
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit(): void {
    hideChatBot();
    this.mobileMode = window.matchMedia('(max-width: 800px)').matches;

    window.matchMedia('(max-width: 800px)').addEventListener('change', () => {
      this.mobileMode = window.matchMedia('(max-width: 800px)').matches;
    });

    const formValues = this.formService.getForms();
    if (!formValues) return;
    Object.keys(formValues).forEach((formValue: any) => {
      let formGroup = this.formService.generateControls(formValues[formValue]);
      this.smartHomeCoverForm.addControl(formValue, formGroup);
    });

    this.policyForm = this.smartHomeCoverForm.get('policyForm') as FormGroup;
    this.policyDetailsForm = this.smartHomeCoverForm.get('policyDetailsForm') as FormGroup;
    this.propertyDetails = this.policyDetailsForm.get('propertyDetails') as FormGroup;
    this.coverageForm = this.smartHomeCoverForm.get('coverageForm') as FormGroup;
    this.propertyDetails.get('endDate')?.disable();
    this.propertyDetails.get('startDate')?.setValidators([Validators.required]);

    this.customerDetails = this.policyDetailsForm.get('customerDetails') as FormGroup;

    this.customerDetails.get('dob')?.setValidators([Validators.required]);
    this.customerDetails.get('idNo')?.setValidators(nricValidator.bind(this.customerDetails, 17, 80));

    this.correspondenceDetails = this.customerDetails.get('correspondenceDetails') as FormGroup;

    this.hsbcCardChecking = this.policyDetailsForm.get('hsbcCardChecking') as FormGroup;
    if (this.sourceSystem$ == 'HSBCBN') {
      this.policyDetailsForm.get('hsbcCardChecking')?.enable();
    } else {
      this.policyDetailsForm.get('hsbcCardChecking')?.disable();
    }

    this.combinesNamesArray = this.policyDetailsForm.get('combinesNamesArray') as FormArray;
    for (let i = 0; i < this.combinesNamesArray.length; i++) {
      this.checkCombinesName(i);
    }

    if (this.productConfig$?.voucherEmailDomain != undefined) {
      this.hasStaffEmail = true;
      this.customerDetails.get('email')
        ?.setValidators([Validators.required, this.validateEmailWithoutDomain.bind(this)]);
    } else {
      this.customerDetails
        .get('email')?.setValidators([Validators.required, emailRequiredValidator]);
    }

    if (this.step1Data$?.ExistingLoan && this.coverageForm.get('houseOwner')?.get('coverBuildingDamage')?.value) {
      this.financialInterest = this.policyDetailsForm.get('financialInterest') as FormGroup;
      this.financialInterest.get('loanReferenceNo')?.setValidators([Validators.required]);

      var banksEmail = this.financialInterest?.get('banksEmail')?.value;
      var consentBankDetailsCheckBox = this.financialInterest?.get('consentBankDetailsCheckBox')?.value;

      this.financialInterest.get('banksEmail')?.setValidators([emailValidator, bankEmailValidator.match(this.customerDetails.get('email'), this.financialInterest?.get('banksEmail'), this.hasStaffEmail, this.productConfig$?.voucherEmailDomain)]);
      this.financialInterest?.updateValueAndValidity();
      this.changeDetectionRef.detectChanges();

      if (banksEmail != '') {
        var pattern = new RegExp('(^$|^.*@.*\..*$)');
        var error = this.financialInterest?.get('banksEmail')?.errors;
        var result = pattern.test(banksEmail);

        if (result && error == null) {
          if (consentBankDetailsCheckBox == undefined) {
            this.showEmailConditionFI = false;
          } else {
            this.showEmailConditionFI = true;
            this.financialInterest?.get('consentBankDetailsCheckBox')?.setValidators(Validators.requiredTrue);
            this.financialInterest?.get('consentBankDetailsCheckBox')?.setValue(consentBankDetailsCheckBox ? consentBankDetailsCheckBox : false);
            this.financialInterest?.get('consentBankDetailsCheckBox')?.markAsTouched();
            this.financialInterest.updateValueAndValidity();
          }
        }
      } else {
        var financialInterestName = this.financialInterest?.get('financialInterestName')?.value;
        this.bankCodeChange(financialInterestName)
      }
    }

    this.smartHomeCoverForm.valueChanges.subscribe((value) => {
      this.formService.updateForms(this.smartHomeCoverForm);
    });


    this.financialArrayLength = this.financialArrayValue;
    this.combineArrayLength = this.combineArrayValue;

    //Reload data into custom fields if any
    this.customFieldsData = {
      cardNo1: this.customerDetails.get('cardNo1')?.value ? this.customerDetails.get('cardNo1')?.value : '',
      cardNo2: this.customerDetails.get('cardNo2')?.value ? this.customerDetails.get('cardNo2')?.value : '',
      cardNo3: this.customerDetails.get('cardNo3')?.value ? this.customerDetails.get('cardNo3')?.value : '',
      staffId: this.customerDetails.get('staffId')?.value ? this.customerDetails.get('staffId')?.value : '',
    };

    this.correspondenceDetails.get('viewport')?.valueChanges.subscribe(async () => {
      if (this.correspondenceDetails.get('viewport')?.value !== '' &&
        this.correspondenceDetails.get('viewport')?.value !== null) {
        this.showAddress = true;
        this.zone.run(() => { // <== added
          this.changeDetectorRef.detectChanges();
        });

        this.correspondenceDetails.updateValueAndValidity();
      }
    });

    //hanlde refresh and next screen back
    this.valueChangesIdType();
    this.handleEligibility();
    this.checkStartDate();
    this.valueChangesStartDate();
    if (this.correspondenceDetails.get('viewport')?.value != '') {
      this.showAddress = true;
    }

    if (this.correspondenceCheckbox) {
      this.correspondenceDetails?.get('addressnumber')?.disable();
      this.correspondenceDetails?.get('address1')?.disable();
      this.correspondenceDetails?.get('address2')?.disable();
      this.correspondenceDetails?.get('address3')?.disable();
    }
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).select();
    this.changeDetectionRef.detectChanges();
  }

  /*--- Get ---*/
  get getIdType() {
    return this.customerDetails.get('idType') as FormControl;
  }

  get getIdNo() {
    return this.customerDetails.get('idNo') as FormControl;
  }

  get startDate() {
    return this.propertyDetails.get('startDate') as FormControl;
  }

  get endDate() {
    return this.propertyDetails.get('endDate') as FormControl;
  }

  get correspondenceCheckbox(): string {
    return this.customerDetails?.get('correspondenceCheckbox')?.value
  }

  get financialArrayValue() {
    return this.policyDetailsForm?.get('financialInterest')?.value;
  }

  get combineArrayValue() {
    return this.policyDetailsForm?.get('combinesNamesArray')?.value;
  }

  combinesNamesArrayFormGroupControl(i: number) {
    return this.combinesNamesArray.at(i) as FormGroup
  }

  getPostCodeDetails() {
    const value = this.customerDetails.get('correspondenceDetails')?.get('postCode')?.value;
    let postcode = this.customerDetails.get('correspondenceDetails')?.get('postCode')?.errors;

    if (postcode == null) {
      const lov = this._store.selectSnapshot(state => state.GeneralState.postcodeList);
      const postCodeDetail = lov.find((item: any) => item.Postcode == value);

      if (postCodeDetail != undefined) {
        let addressObj = postCodeDetail;
        this.customerDetails.get('correspondenceDetails')?.get('city')?.setValue(addressObj.CityDescp);
        this.customerDetails.get('correspondenceDetails')?.get('state')?.setValue(addressObj.StateDescp);
      }
    } else {
      this.customerDetails.get('correspondenceDetails')?.get('city')?.setValue('');
      this.customerDetails.get('correspondenceDetails')?.get('state')?.setValue('');
    }
  }

  getCustomFields(event: any) {
    const isCustomFieldNotEmpty =
      this.checkEmpty(event.cardNo) ||
      this.checkEmpty(event.cardNoSecond) ||
      this.checkEmpty(event.cardNoThird) ||
      this.checkEmpty(event.staffId);
    if (isCustomFieldNotEmpty) {
      this.customFieldsData = {
        cardNo1: event.cardNo,
        cardNo2: event.cardNoSecond,
        cardNo3: event.cardNoThird,
        staffId: event.staffId,
      };

      if (event.cardNo) {
        this.customerDetails.addControl('cardNo1', new FormControl());
        this.customerDetails.get('cardNo1')?.setValue(event.cardNo.toUpperCase());
      }

      if (event.cardNoSecond) {
        this.customerDetails.addControl('cardNo2', new FormControl());
        this.customerDetails.get('cardNo2')?.setValue(event.cardNoSecond.toUpperCase());
      }

      if (event.cardNoThird) {
        this.customerDetails.addControl('cardNo3', new FormControl());
        this.customerDetails.get('cardNo3')?.setValue(event.cardNoThird.toUpperCase());
      }

      if (event.staffId) {
        this.customerDetails.addControl('staffId', new FormControl());
        this.customerDetails.get('staffId')?.setValue(event.staffId.toUpperCase());
      }
    }
  }

  handleEligibility() {

    const epolicyInquiry = this._store.selectSnapshot(state => state.UserInputState.userInput.step2.epolicyInquiry);
    const alimPolicyInquiry = this._store.selectSnapshot(state => state.UserInputState.userInput.step2.alimPolicyInquiry)
    if (this.customerDetails.get('idType')?.value) {
      this.handleIdType(this.customerDetails.get('idType')?.value)
    }
    if (epolicyInquiry.eligibleDiscount || alimPolicyInquiry.alimCustomerInd) {
      this.customerDetails.get('idNo')?.disable();
      this.customerDetails.get('idType')?.disable();
      this.propertyDetails.get('startDate')?.disable();
      this.customerDetails.get('nationality')?.disable();
    }
  }

  idTypeChange(selectedValue: any) {
    const formValue = this.customerDetails.get('idType')?.value;
    if (selectedValue.value != formValue) {
      this.customerDetails.get('idNo')?.setValue(null);
      this.customerDetails.get('idNo')?.markAsUntouched();
      this.customerDetails.get('dob')?.setValue(null);
      this.customerDetails.get('dob')?.markAsUntouched();
    }
  }

  onClickCorrespondence(event: any) {
    if (event) {
      this.correspondenceDetails.patchValue({
        address1: this.step1Data$.address.address1,
        address2: this.step1Data$.address.address2,
        address3: this.step1Data$.address.address3,
        addressType: "C",
        addressnumber: this.step1Data$.address.addressnumber,
        placeId: this.step1Data$.address.placeId,
        plusCode: this.step1Data$.address.plusCode,
        searchControl: "",
        viewport: this.step1Data$.address.viewport,
        city: this.step1Data$.address.city,
        state: this.step1Data$.address.state,
        postCode: this.step1Data$.address.postCode,
      });
      this.correspondenceDetails?.disable();
    } else {
      this.correspondenceDetails.patchValue({
        address1: "",
        address2: "",
        address3: "",
        addressType: "C",
        addressnumber: "",
        placeId: "",
        plusCode: "",
        searchControl: "",
        viewport: "",
        city: "",
        state: "",
        postCode: "",
      });
      this.correspondenceDetails?.get('address1')?.enable();
      this.correspondenceDetails?.get('address2')?.enable();
      this.correspondenceDetails?.get('address3')?.enable();
      this.correspondenceDetails?.get('addressnumber')?.enable();
      this.correspondenceDetails?.get('searchControl')?.enable();
      this.showAddress = false;
    }
  }

  valueChangesIdType() {
    this.getIdType.valueChanges.subscribe(async (value) => {
      this.handleIdType(value);
    });
  }

  handleIdType(value: string) {
    if (value === 'NRIC') {
      this.customerDetails.get('dob')?.disable();
      this.customerDetails.get('nationality')?.setValue('MAL', { emitEvent: false });
      this.customerDetails.get('nationality')?.disable();
    } else {
      this.customerDetails.get('dob')?.enable();
      this.customerDetails.get('nationality')?.enable();
    }
    this.changeDetectionRef.detectChanges();
  }

  valueChangesStartDate() {
    var year = 1
    if (this.step1Data$.CoverageType !== 'AN') {
      year = 3;
    }
    this.startDate.valueChanges.subscribe(async (value) => {
      let startDate = moment(value);
      this.propertyDetails.get('endDate')?.setValue(startDate.add(year, 'year').subtract(1, 'day'));
    });
  }

  checkStartDate() {
    var startDate = this.propertyDetails?.get('startDate')?.value
    if (startDate) {
      let value = moment(startDate);
      if (this.step1Data$.CoverageType === 'AN') {
        this.propertyDetails.get('endDate')?.setValue(value.add(1, 'year').subtract(1, 'day'));
      } else {
        this.propertyDetails.get('endDate')?.setValue(value.add(3, 'year').subtract(1, 'day'));
      }
    }
  }

  addCombinesName() {
    this.combinesNamesArray.push(
      new FormGroup({
        fullName: new FormControl(''),
        idType: new FormControl(''),
        idNo: new FormControl(''),
        role: new FormControl(''),
        nationality: new FormControl(''),
      })
    );
    this.combinesNamesArray.at(this.combinesNamesArray.length - 1).get('idType')?.disable();
    this.combinesNamesArray.at(this.combinesNamesArray.length - 1).get('idNo')?.disable();
    this.combinesNamesArray.at(this.combinesNamesArray.length - 1).get('role')?.disable();
    this.combinesNamesArray.at(this.combinesNamesArray.length - 1).get('nationality')?.disable();
    /** To update array length */
    this.combineArrayLength = this.combineArrayValue;
    this.changeDetectionRef.detectChanges();
    this.combinesNamesArray.updateValueAndValidity();
  }

  removeCombinesName(index: number) {
    const combineArray = this.policyDetailsForm?.get('combinesNamesArray') as FormArray;
    combineArray.removeAt(index);

    /** To update array length */
    this.combineArrayLength = this.combineArrayValue;
    this.changeDetectionRef.detectChanges();
    this.combinesNamesArray.updateValueAndValidity();
  }

  handleAddCorrDetails(item: any, event: any) {
    const newVal = event.target.value;
    const correspondEnable = this.customerDetails.get('correspondenceCheckbox')?.value;

    if (correspondEnable) {
      this.customerDetails.get('correspondenceDetails')?.get(item)?.setValue(newVal);
    }
  }

  /* Validation handler */
  async checkUserInfo(info: any) {
    const productConfig = this._store.selectSnapshot<any>(
      (state) => state.GeneralState.productConfig
    );
    let payload: any;

    if (info == 'email' || info == 'staffEmail') {
      const customerEmail = info == 'email' ? this.customerDetails.get('email')?.value : `${this.customerDetails.get('email')?.value}${this.productConfig$?.voucherEmailDomain}`

      if (this.customerDetails.get('email')?.valid) {
        payload = {
          ...payload,
          agentCode: productConfig.AgentCode,
          email: customerEmail,
        };
      }
    } else {
      payload = {
        ...payload,
        agentCode: productConfig.AgentCode,
        mobileNo:
          this.customerDetails.get('phoneCountryCode')?.value.replace('+', '') +
          this.customerDetails.get('phoneNo')?.value,
      };
    }

    if (this.customerDetails.get('email')?.valid || this.customerDetails.get('mobile')?.valid) {
      this._store.dispatch(new CHECK_USER_INFO(payload)).subscribe((res) => {
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

  checkCombinesName(i: number) {
    if (this.combinesNamesArray.at(i).get('eligible')?.value) {
      this.combinesNamesArray.at(i).get('idType')?.setValue(this.combinesNamesArray.at(i).get('idType')?.value);
      this.combinesNamesArray.at(i).get('idNo')?.setValue(this.combinesNamesArray.at(i).get('idNo')?.value);
      this.combinesNamesArray.at(i).get('idType')?.disable();
      this.combinesNamesArray.at(i).get('idNo')?.disable();
      this.combinesNamesArray.at(i).get('fullName')?.setValidators(Validators.required);
      if (this.combinesNamesArray.at(i).get('idType')?.value === 'NRIC') {
        this.combinesNamesArray.at(i).get('nationality')?.setValue('MAL');
        this.combinesNamesArray.at(i).get('nationality')?.disable();
      } else {
        this.combinesNamesArray.at(i).get('nationality')?.enable();
      }
    } else {
      if (this.combinesNamesArray.at(i).get('fullName')?.value === '' || this.combinesNamesArray.at(i).get('fullName')?.value === null) {
        this.combinesNamesArray.at(i).get('idType')?.setValue('');
        this.combinesNamesArray.at(i).get('idNo')?.setValue('');
        this.combinesNamesArray.at(i).get('role')?.setValue('');
        this.combinesNamesArray.at(i).get('nationality')?.setValue('');
        this.combinesNamesArray.at(i).get('idType')?.disable();
        this.combinesNamesArray.at(i).get('idNo')?.disable();
        this.combinesNamesArray.at(i).get('role')?.disable();
        this.combinesNamesArray.at(i).get('nationality')?.disable();
      } else if (this.combinesNamesArray.at(i).get('idType')?.value !== '' || this.combinesNamesArray.at(i).get('idType')?.value !== null) {
        this.idTypeCombinesNameChange(this.combinesNamesArray.at(i).get('idType')?.value, i);
      }
      else {
        this.combinesNamesArray.at(i).get('idNo')?.setValidators(nricValidator.bind(this.combinesNamesArray.at(i), 17, 80));
        this.combinesNamesArray.at(i).get('idType')?.enable();
        this.combinesNamesArray.at(i).get('idNo')?.enable();
        this.combinesNamesArray.at(i).get('role')?.enable();
        this.combinesNamesArray.at(i).get('nationality')?.enable();
      }
    }
  }

  idTypeCombinesNameChange(event: any, i: number) {
    if (event === 'NRIC' || event.value === 'NRIC') {
      this.combinesNamesArray.at(i).get('nationality')?.setValue('MAL');
      this.combinesNamesArray.at(i).get('nationality')?.disable();
    } else {
      this.combinesNamesArray.at(i).get('nationality')?.enable();
    }
  }

  validateCombinesName(i: number) {
    if (!this.combinesNamesArray.at(i).get('eligible')?.value) {
      if (this.combinesNamesArray.at(i).get('fullName')?.value !== '') {
        this.combinesNamesArray.at(i).get('idNo')?.setValidators(nricValidator.bind(this.combinesNamesArray.at(i), 17, 80));
        this.combinesNamesArray.at(i).get('nationality')?.setValue('MAL');
        this.combinesNamesArray.at(i).get('idType')?.setValue('NRIC');
        this.combinesNamesArray.at(i).get('idType')?.enable();
        this.combinesNamesArray.at(i).get('idNo')?.enable();
        this.combinesNamesArray.at(i).get('role')?.enable();
        this.combinesNamesArray.at(i).get('nationality')?.disable();
      } else {
        this.combinesNamesArray.at(i).get('idType')?.setValue('');
        this.combinesNamesArray.at(i).get('idNo')?.setValue('');
        this.combinesNamesArray.at(i).get('role')?.setValue('');
        this.combinesNamesArray.at(i).get('nationality')?.setValue('');
        this.combinesNamesArray.at(i).get('idType')?.disable();
        this.combinesNamesArray.at(i).get('idNo')?.disable();
        this.combinesNamesArray.at(i).get('role')?.disable();
        this.combinesNamesArray.at(i).get('nationality')?.disable();
      }
    }
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

  hsbcCardHolderHeader = '';
  hsbcCardHolderDescription = 'Sorry, this application is open to HSBC Malaysia Debit/Credit cardholders who is currently in Malaysia only. To apply, ';

  hsbcCardHolderError() {
    this.hsbcCardHolderDialog.open();
  }

  checkHsbcCardHolderNumber() {
    const value = this.policyDetailsForm
      .get('hsbcCardChecking')
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
      var hsbcCardHolder = this.policyDetailsForm.get('hsbcCardChecking')?.get('hsbcCardHolder')?.value;
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

  bankEmailKeyup() {
    this.showEmailConditionFI = false
    var value = this.financialInterest?.get('banksEmail')?.value;
    var error = this.financialInterest?.get('banksEmail')?.errors;
    var pattern = new RegExp('(^$|^.*@.*\..*$)');
    var result = pattern.test(value);

    if (value != '') {
      if (result && error == null) {
        this.showEmailConditionFI = true
        this.financialInterest.addControl('consentBankDetailsCheckBox', new FormControl(false, Validators.requiredTrue));
        this.financialInterest?.updateValueAndValidity();
      }
      else if (!result && error == null) {
        this.showEmailConditionFI = false;
        this.financialInterest.get('consentBankDetailsCheckBox')?.setValue(false);
        this.financialInterest.removeControl('consentBankDetailsCheckBox');
        this.financialInterest?.updateValueAndValidity();
      }
    } else {
      this.showEmailConditionFI = false;
      this.financialInterest.get('consentBankDetailsCheckBox')?.setValue(false);
      this.financialInterest.removeControl('consentBankDetailsCheckBox');
      this.financialInterest?.updateValueAndValidity();
    }
  }

  onClickConset() {
    var value = this.financialInterest.get('consentBankDetailsCheckBox')?.value;
    this.financialInterest?.updateValueAndValidity();
    if (value) {
      this.customerDetails.get('email')?.setValidators([emailRequiredValidator, bankEmailValidator.match(this.financialInterest?.get('banksEmail'), this.customerDetails.get('email'), this.hasStaffEmail, this.productConfig$?.voucherEmailDomain)]);
    }
  }

  bankCodeChange(event: any) {
    switch (event.value || event) {
      case 'other':
        this.showEmailConditionFI = false;
        this.financialInterest.get('banksEmail')?.enable();
        this.financialInterest.get('banksEmail')?.setValue("");
        this.financialInterest.removeControl('consentBankDetailsCheckBox');
        this.financialInterest.addControl('financialInterestText', new FormControl('', Validators.required));
        this.financialInterest.get('banksEmail')?.setValidators([emailValidator, bankEmailValidator.match(this.customerDetails.get('email'), this.financialInterest?.get('banksEmail'), this.hasStaffEmail, this.productConfig$?.voucherEmailDomain)]);
        this.financialInterest?.updateValueAndValidity();
        break;
      case 'HBMB': case 'SCBL':
        this.showEmailConditionFI = false;
        this.financialInterest.removeControl('financialInterestText');
        this.financialInterest.get('banksEmail')?.setValue("");
        this.financialInterest.get('banksEmail')?.clearValidators();
        this.financialInterest.get('banksEmail')?.disable();
        this.financialInterest.removeControl('consentBankDetailsCheckBox');
        this.policyDetailsForm?.updateValueAndValidity();
        break;

      default:
        this.showEmailConditionFI = false;
        this.financialInterest.removeControl('financialInterestText');
        this.financialInterest.get('banksEmail')?.setValue("");
        this.financialInterest.get('banksEmail')?.enable();
        this.financialInterest.removeControl('consentBankDetailsCheckBox');
        this.financialInterest.get('banksEmail')?.setValidators([emailValidator, bankEmailValidator.match(this.customerDetails.get('email'), this.financialInterest?.get('banksEmail'), this.hasStaffEmail, this.productConfig$?.voucherEmailDomain)]);
        this.financialInterest?.updateValueAndValidity();
        break;
    }
  }

  /*---- Functions ----*/
  async nextQuestion() {
    this.spinnerOverlayService.showLoadOverlay();
    var checkHSBCHolder =
      await this.checkHSBCHolder();
    if (!checkHSBCHolder) { return this.spinnerOverlayService.hideLoadOverlay(); }


    let propertyDetailsValues = this.propertyDetails.getRawValue();
    let customerDetailsValues = this.customerDetails.getRawValue();
    let combineNames = this.combinesNamesArray.getRawValue();
    let financialDetailsValues = this.financialInterest?.getRawValue();
    let quotationNumber = this._store.selectSnapshot(QuoteProgessState.quotationNumber);

    for (var i = 0; i < combineNames.length; i++) {
      if (combineNames[i].fullName == '') {
        combineNames.pop();
      }
    }

    propertyDetailsValues = {
      ...propertyDetailsValues,
      postCode: this.step1Data$.address.postCode,
      city: this.step1Data$.address.CityDescp,
      state: this.step1Data$.address.StateDescp,
      cityCode: this.step1Data$.address.CityCode,
      stateCode: this.step1Data$.address.StateCode,
      country: 'MAL',
    };

    const value = customerDetailsValues.correspondenceDetails.postCode;
    var newEmail = customerDetailsValues.email;
    if (this.productConfig$?.voucherEmailDomain != undefined) {
      newEmail = customerDetailsValues.email + this.productConfig$?.voucherEmailDomain;
    }
    let addressObj = this.postCodeList$.filter((item: any) => item.Postcode == value);

    customerDetailsValues = {
      ...customerDetailsValues,
      cardNo: this.customFieldsData.cardNo1,
      cardNoSecond: this.customFieldsData.cardNo2,
      cardNoThird: this.customFieldsData.cardNo3,
      staffId: this.customFieldsData.staffId,
      correspondenceDetails: {
        ...customerDetailsValues.correspondenceDetails,
        city: addressObj[0].CityDescp,
        state: addressObj[0].StateDescp,
        cityCode: addressObj[0].CityCode,
        stateCode: addressObj[0].StateCode,
      },
      email: newEmail,
    };


    this.action$
      .pipe(
        ofActionCompleted(PUT_CUSTOMER_DETAILS, DO_SANCTION_CHECKING),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data: ActionCompletion) => {
        this.spinnerOverlayService.hideLoadOverlay();
        if (data.result.error) {
          if (this.activeDialogRef == undefined) {
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: false },
            });
          } else {
            if (this.activeDialogRef.getState() == 2) {
              this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
                showCloseIcon: true,
                data: { refreshPage: false },
              });
            }
          }
        }
      });

    var scanctionCheck = await this.checkSanction(customerDetailsValues, combineNames, quotationNumber);
    if (!scanctionCheck) return;

    firstValueFrom(
      this._store.dispatch(
        new SET_STEP_3(
          propertyDetailsValues,
          customerDetailsValues,
          combineNames,
          financialDetailsValues
        )
      )
    ).then((_) => {
      this._store.dispatch(new PUT_CUSTOMER_DETAILS());
    });

    this.action$.pipe(ofActionSuccessful(PUT_CUSTOMER_DETAILS)).subscribe(() => {
      const sanctionCheck = this._store.selectSnapshot((state) => state.QuoteProgessState.sanction);
      if (!sanctionCheck) {
        this.router.navigate(['/checkout'], { queryParamsHandling: 'preserve' });
      }
    });
  }

  leaveMyDetailsDialogHeader = '';
  leaveMyDetailsDialogDescription = 'Oops! We are sorry that we are unable to process your request due to our online ' +
    'risk acceptance controls. Please leave your details and our representative will ' +
    'contact you to assist you further.'


  async checkSanction(customerDetailsValues: any, combineNames: any, quotationNumber: any) {
    var result = false;
    if (this.customerDetails.valid) {
      await firstValueFrom(
        this._store.dispatch(new DO_SANCTION_CHECKING(customerDetailsValues, combineNames, quotationNumber))
      ).then((_) => {
        if (_.QuoteProgessState.sanction) {
          //flowType = 'DIRECT';'STAFFR'; 'REFERRAL'; 'BANK';'AGENT';
          this.flowType$?.subscribe((res: any) => {
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
}