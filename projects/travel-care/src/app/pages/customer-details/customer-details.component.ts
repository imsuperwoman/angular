import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

import { GeneralService } from '../../services/general.service';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FormService } from '@services/form.service';
import { ADULT_RELATIONSHIP_DROPDOWN, AgeRange, CHILD_RELATIONSHIP_DROPDOWN, TrgrpCode, Type } from '../../constants/customer-details.constants';
import * as moment from 'moment';
import {
  Store,
  Select,
  Actions
} from '@ngxs/store';
import { GeneralSelectors } from 'module/store/general.selectors';
import { nricValidator } from '@functions/validator-nric.function';
import { emailRequiredValidator, emailValidator, postCodeValidatorWithoutFloodProne, validateEmailWithoutDomain } from '@functions/validator.function';
import { CHECK_HSBC_CARD, CHECK_USER_INFO, DO_SANCTION_CHECKING, JOURNEY_TRAVELLER_DETAILS, PROMO_LIST } from '../../store/actions/quote-progress.action';
import { CustomFieldsService } from '@services/customFields.service';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { SET_STEP_3 } from '../../store/actions/user-input.action';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import checkoutForm from '../../constants/checkout-form.contants';
import { nricValidatorWithMinDays } from '@functions/validator-nric-withmindays.function';
import { ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-customer-details',
  templateUrl: 'customer-details.component.html',
  styleUrls: ['customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit, OnDestroy {
  LOGO: any;
  HEADER: any;
  SUBHEADER: any;
  NOTE: any;

  travelCareForm: UntypedFormGroup = new UntypedFormGroup({});
  quoteForm!: UntypedFormGroup;
  coverageForm!: UntypedFormGroup;
  customerDetailsForm!: UntypedFormGroup;
  mountaineeringForm!: UntypedFormGroup;
  mainPolicyHolder!: UntypedFormGroup;
  hsbcCardChecking!: UntypedFormGroup;
  travellerArrayLength: any = 0;
  travellerArrayForm = new UntypedFormArray([]);

  minDate = moment().add(1, 'day');
  maxDate = moment().add(3, 'month').subtract(1, 'day');
  endDateMinDate = moment().add(1, 'day');
  endDateMaxDate = moment().add(3, 'month').subtract(1, 'day');
  maxDateDOB: any
  minDateDOB: any
  //  maxDateDOB = moment().subtract(17, 'years');
  // minDateDOB = moment().subtract(80, 'years');

  private ngUnsubscribe = new Subject<void>();

  userInput$: any;
  quoteProgress$: any;
  postCodeList$: any;
  productConfig$: any;
  sourceSystem$: any;
  hasStaffEmail: boolean = false;
  fields: any = [];
  dynamicContent: any;
  trgrpcode: any;
  DOBSelectedTrIndex = 0;

  ADULT_RELATIONSHIP = ADULT_RELATIONSHIP_DROPDOWN;
  CHILD_RELATIONSHIP = CHILD_RELATIONSHIP_DROPDOWN;
  /*---- Error ----*/
  validhsbcCard: boolean = false;

  /*---- Modal Dialog ----*/
  commonErrorDialogHeader = '';
  commonErrorDescription = '';

  /*---- From Store ----*/
  @Select(GeneralSelectors.selectLov('NEWCUSTIDTYPE')) custIDType$: any;
  @Select(GeneralSelectors.selectLov('GENDER')) gender$: any;
  @Select(GeneralSelectors.selectLov('NATIONALITY')) nationality$: any;
  @Select(GeneralSelectors.selectLov('MOBILEPREFIX')) mobilePrefix$: any;
  @Select(GeneralSelectors.flowType) flowType$: any;
  @ViewChild('hsbcCardHolderDialog') hsbcCardHolderDialog: any;
  @ViewChild('leaveMyDetailsDialog') leaveMyDetailsDialog: any;

  @ViewChild('commonErrorDialog') commonErrorDialog: any;
  @ViewChild('stepper') stepper: any;
  @ViewChild('notificationModal') notificationModal: any;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    public generalService: GeneralService,
    private _store: Store,
    private customFieldsService: CustomFieldsService,
    public spinnerOverlayService: SpinnerOverlayService,
    private action$: Actions,
    private router: Router,
    public dialogService: NxDialogService,
    public formService: FormService) {
    this.LOGO = generalService.getConfig().LOGO;
    this.HEADER = generalService.getConfig().HEADER;
    this.SUBHEADER = generalService.getConfig().SUBHEADER;
    this.NOTE = generalService.getConfig().NOTE;

    this.userInput$ = this._store.selectSnapshot((state: any) => state.UserInputState.userInput);
    this.quoteProgress$ = this._store.selectSnapshot((state) => state.QuoteProgessState.quoteProgress.Result);
    this.postCodeList$ = this._store.selectSnapshot((state) => state.GeneralState.postcodeList);
    this.productConfig$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig);
    this.dynamicContent = this._store.selectSnapshot((state) => state.GeneralState.dynamicContent);
    this.sourceSystem$ = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
    this.trgrpcode = this.userInput$.step1.trgrpcode
  }

  ngOnInit() {
    const formValues = this.formService.getForms();
    if (!formValues) return;
    Object.keys(formValues).forEach((formValue: any) => {
      let formGroup = this.formService.generateControls(formValues[formValue]);
      this.travelCareForm.addControl(formValue, formGroup);
    });

    this.quoteForm = this.travelCareForm?.get('quoteForm') as UntypedFormGroup;
    this.coverageForm = this.travelCareForm?.get('coverageForm') as UntypedFormGroup;

    this.customerDetailsForm = this.travelCareForm?.get('customerDetailsForm') as UntypedFormGroup;
    this.mainPolicyHolder = this.customerDetailsForm?.get('mainPolicyHolder') as UntypedFormGroup;
    this.travellerArrayForm = this.customerDetailsForm.get('travellerArrayForm') as UntypedFormArray;

    if (this.travellerArrayForm) {
      this.travellerArrayLength = this.travellerArrayValue;
      for (let i = 0; i < this.travellerArrayValue.length; i++) {
        this.travellerArrayName(i, this.travellerArrayForm.value[i]);
      }
    } else {
      this.travellerArrayForm = new UntypedFormArray([])
    }

    this.initialMaincustomerDetailsForm();
    this.initialMountForm();
    this.valueChangesIdType();


    this.mainPolicyHolder = this.customerDetailsForm?.get('mainPolicyHolder') as UntypedFormGroup;

    if (this.dynamicContent.Header.contents) {
      this.customFieldsService.customFieldsService(this.dynamicContent.Header.contents, this.mainPolicyHolder, this.fields)
    }

    this.hsbcCardChecking = this.customerDetailsForm.get('hsbcCardChecking') as UntypedFormGroup;
    if (this.sourceSystem$ == 'HSBCBN') {
      this.customerDetailsForm.get('hsbcCardChecking')?.enable();
    } else {
      this.customerDetailsForm.get('hsbcCardChecking')?.disable();
    }
    //  Update form service when there is changes in value
    this.travelCareForm.valueChanges.subscribe(() => {
      this.formService.updateForms(this.travelCareForm);
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(0).completed = true;
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).select();
    this.changeDetectionRef.detectChanges();
  }

  initialMountForm() {
    if (this.userInput$.step2?.mountaineeringCoverage?.mountaineeringCoverageCheck) {
      this.mountaineeringForm = this.customerDetailsForm.get('mountaineeringForm') as UntypedFormGroup;
      this.mountaineeringForm.get('startDate')?.setValidators([Validators.required]);
      this.mountaineeringForm.get('endDate')?.setValidators([Validators.required]);
      var startDate = moment(this.userInput$.step1?.startDate);
      var endDate = moment(this.userInput$.step1?.endDate);
      const diffInDays = moment(endDate).diff(moment(startDate), 'days');

      if (diffInDays < 29) {
        var startDt = moment(this.userInput$.step1?.startDate);
        var endDt = moment(this.userInput$.step1?.endDate);
        this.mountaineeringForm.get('startDate')?.clearValidators();
        this.mountaineeringForm.get('endDate')?.clearValidators();
        this.mountaineeringForm.get('startDate')?.setValue(startDt);
        this.mountaineeringForm.get('endDate')?.setValue(endDt);
        this.mountaineeringForm.get('startDate')?.disable();
        this.mountaineeringForm.get('endDate')?.disable();
      }
      else {
        this.mountaineeringForm = this.customerDetailsForm.get('mountaineeringForm') as UntypedFormGroup;
        this.mountaineeringForm.get('endDate')?.disable();
        this.mountaineeringForm.get('startDate')?.setValidators([Validators.required]);

        this.minDate = moment(this.userInput$.step1?.startDate);
        this.maxDate = moment(this.userInput$.step1?.endDate)
        this.mountaineeringForm.get('startDate')?.valueChanges.subscribe(() => {
          this.mountEndDate();
        });

        //refresh
        this.mountEndDate();
      }
    }
  }

  mountEndDate() {
    if (this.mountaineeringForm.get('endDate')?.value == '') {
      this.mountaineeringForm.get('endDate')?.setValue('');
    }

    var startDate = this.mountaineeringForm.get('startDate')?.value;
    var endDate = moment(this.userInput$.step1?.endDate);
    var startEndDateDiff = moment(endDate).diff(moment(startDate), 'days');
    if (startDate) {
      this.mountaineeringForm.get('endDate')?.enable();
      this.endDateMinDate = moment(startDate);
      //to restrict the endDate 
      this.endDateMaxDate = startEndDateDiff < 29 ? moment(startDate).add(startEndDateDiff, 'day') : moment(startDate).add(29, 'day');

    }
    else {
      this.mountaineeringForm.get('endDate')?.disable();
      this.mountaineeringForm.get('endDate')?.setValue('');
    }
  }

  initialMaincustomerDetailsForm() {
    var riskGrpSorted = this.generalService.sortTravelerSequence(this.quoteProgress$.Risk.RiskGrp);
    var ageRange = riskGrpSorted[0].RiskPerson.AgeRange
    if (this.quoteProgress$.Risk.RiskGrp) {
      //var ageRange = riskGrpSorted[0].RiskPerson.AgeRange
      if (ageRange == 'C') {
        this.mainPolicyHolder.get('idNo')?.setValidators(nricValidatorWithMinDays.bind(this.mainPolicyHolder,
          this.generalService.getAgeRangeMin(ageRange, true), this.generalService.getAgeRangeMin(ageRange, false)));
      } else {
        this.mainPolicyHolder.get('idNo')?.setValidators(nricValidator.bind(this.mainPolicyHolder,
          this.generalService.getAgeRangeMin(ageRange, true), this.generalService.getAgeRangeMin(ageRange, false)));
      }

      // Handle mounters
      var adultGroup = this.userInput$.step2?.mountaineeringCoverage?.mountaineerArray[0].adultGroup;
      if (adultGroup && ageRange == 'A') {
        this.mainPolicyHolder.get('idNo')?.setValidators(nricValidator.bind(this.mainPolicyHolder,
          this.generalService.getAgeRangeMin(adultGroup, true), this.generalService.getAgeRangeMin(adultGroup, false)));
      }

      this.mainPolicyHolder?.get('fullname')?.setValidators(Validators.required);
      this.mainPolicyHolder?.get('address')?.get('postcode')?.setValidators([Validators.required, Validators.minLength(5),
      Validators.maxLength(5), postCodeValidatorWithoutFloodProne.bind(this, this.postCodeList$)]);

      if (this.productConfig$?.voucherEmailDomain != undefined) {
        this.hasStaffEmail = true;
        this.mainPolicyHolder.get('email')
          ?.setValidators([Validators.required, validateEmailWithoutDomain]);
      } else {
        this.mainPolicyHolder
          .get('email')?.setValidators([Validators.required, emailRequiredValidator]);
      }

      if (this.mainPolicyHolder.get('idType')?.value === 'NRIC') {
        this.mainPolicyHolder.get('dob')?.disable();
        this.mainPolicyHolder.get('nationality')?.setValue('MAL', { emitEvent: false });
        this.mainPolicyHolder.get('nationality')?.disable();
      } else {
        this.mainPolicyHolder.get('dob')?.setValidators(Validators.required);
        this.handleDOB()
        this.mainPolicyHolder.get('dob')?.enable();
        this.mainPolicyHolder.get('nationality')?.enable();

      }

      this.mainPolicyHolder.get('address')?.get('city')?.disable();
      this.mainPolicyHolder.get('address')?.get('state')?.disable();
      this.mainPolicyHolder.get('address')?.get('line1')?.setValidators([Validators.required]);
      this.mainPolicyHolder.get('guardianName')?.disable();
    }
  }

  get travellerArrayValue() {
    return this.customerDetailsForm?.get('travellerArrayForm')?.value;
  }

  get getAge() {
    return this.mainPolicyHolder.get('age') as UntypedFormControl;
  }

  get getIdNo() {
    return this.mainPolicyHolder.get('idNo') as UntypedFormControl;
  }

  get getIdType() {
    return this.mainPolicyHolder.get('idType') as UntypedFormControl;
  }
  get getDOBMainControl() {
    return this.mainPolicyHolder.get('dob') as UntypedFormControl;
  }
  get getDOBMain() {
    return this.mainPolicyHolder.get('dob')?.value;;
  }
  get getGuardianIdNo() {
    return this.mainPolicyHolder.get('guardianIdNo') as UntypedFormControl;
  }


  hsbcCardHolderHeader = '';
  hsbcCardHolderDescription = 'Sorry, this application is open to HSBC Malaysia Debit/Credit cardholders who is currently in Malaysia only. To apply, ';

  hsbcCardHolderError() {
    this.hsbcCardHolderDialog.open();
  }

  checkHsbcCardHolderNumber() {
    const value = this.customerDetailsForm
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

  idTypeChange(selectedValue: any) {
    const formValue = this.mainPolicyHolder.get('idType')?.value;
    if (selectedValue.value != formValue) {
      this.mainPolicyHolder.get('idNo')?.setValue(null);
      this.mainPolicyHolder.get('idNo')?.markAsUntouched();
      this.mainPolicyHolder.get('dob')?.setValue(null);
      this.mainPolicyHolder.get('dob')?.markAsUntouched();
    }
  }

  valueChangesIdType() {
    this.getIdType.valueChanges.subscribe(async (value) => {
      this.handleIdType(value);
    });

    this.getAge.valueChanges.subscribe(async (value) => {
      this.handleIdNo(value);
    });
    //if IDType other than NRIC
    if (this.mainPolicyHolder) {
      this.getDOBMainControl.valueChanges.subscribe(() => {
        this.mainPolicyHolderAgeCal();
      })
    }
    //if IDType of traveller other tahn NRIC
    if (this.travellerArrayForm) {
      for (var i = 0; i < this.travellerArrayForm.length; i++) {
        this.travellerArrayForm.at(i).get('dob')?.valueChanges.subscribe(() => {
          this.TravellerAgeCal();
        });
      }
    }
  }

  handleIdType(value: string) {
    if (value === 'NRIC') {
      this.mainPolicyHolder.get('idNo')?.setValue(null);
      this.mainPolicyHolder.get('dob')?.disable();
      this.mainPolicyHolder.get('nationality')?.setValue('MAL', { emitEvent: false });
      this.mainPolicyHolder.get('nationality')?.disable();
    } else {
      this.mainPolicyHolder.get('dob')?.setValue(null);
      this.mainPolicyHolder.get('idNo')?.setValue(null);
      this.mainPolicyHolder.get('dob')?.setValidators(Validators.required);
      this.handleDOB()
      this.mainPolicyHolder.get('dob')?.enable();
      this.mainPolicyHolder.get('nationality')?.enable();
    }
    this.changeDetectionRef.detectChanges();
  }

  handleIdNo(value: number) {
    if (value <= 17) {
      this.mainPolicyHolder.get('guardianName')?.enable();
      this.mainPolicyHolder.get('guardianIdType')?.enable();
      this.mainPolicyHolder.get('guardianIdNo')?.enable();
      this.gaurdianIdNochanges();
    } else {
      this.mainPolicyHolder.get('guardianName')?.disable();
      this.mainPolicyHolder.get('guardianIdType')?.disable();
      this.mainPolicyHolder.get('guardianIdNo')?.disable();
    }
    this.changeDetectionRef.detectChanges();
  }

  /* Validation handler */
  async checkUserInfo(info: any) {
    const productConfig = this._store.selectSnapshot<any>(
      (state) => state.GeneralState.productConfig
    );
    let payload: any;

    if (info == 'email' || info == 'staffEmail') {
      const customerEmail = info == 'email' ? this.mainPolicyHolder.get('email')?.value : `${this.mainPolicyHolder.get('email')?.value}${this.productConfig$?.voucherEmailDomain}`;
 this.mainPolicyHolder.get('customerEmail')?.setValue(customerEmail)  ;

      if (this.mainPolicyHolder.get('email')?.valid) {
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
          this.mainPolicyHolder.get('phonePrefix')?.value.replace('+', '') +
          this.mainPolicyHolder.get('phoneNo')?.value,
      };
    }

    if (this.mainPolicyHolder.get('email')?.valid || this.mainPolicyHolder.get('mobile')?.valid) {
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

  getPostCodeDetails() {
    const value = this.mainPolicyHolder.get('address')?.get('postcode')?.value;
    let postcode = this.mainPolicyHolder.get('address')?.get('postcode')?.errors;
    if (postcode == null) {
      const lov = this._store.selectSnapshot(state => state.GeneralState.postcodeList);
      const postCodeDetail = lov.find((item: any) => item.Postcode == value);

      if (postCodeDetail != undefined) {
        let addressObj = postCodeDetail;
        this.mainPolicyHolder.get('address')?.get('city')?.setValue(addressObj.CityDescp);
        this.mainPolicyHolder.get('address')?.get('state')?.setValue(addressObj.StateDescp);
      }
    } else {
      this.mainPolicyHolder.get('address')?.get('city')?.setValue('');
      this.mainPolicyHolder.get('address')?.get('state')?.setValue('');
    }
  }

  travellerArrayName(i: number, travellerArrayObject: any) {
    this.travellerArrayForm.at(i).get('fullname')?.setValidators(Validators.required);
    this.travellerArrayForm.at(i).get('email')?.setValidators(emailValidator);
    if (this.travellerArrayForm.at(i).get('idType')?.value === 'NRIC') {
      this.travellerArrayForm.at(i).get('nationality')?.setValue('MAL');
      this.travellerArrayForm.at(i).get('nationality')?.disable();
      this.travellerArrayForm.at(i).get('dob')?.disable();
    } else {
      this.travellerArrayForm.at(i).get('dob')?.enable();
      this.travellerArrayForm.at(i).get('dob')?.setValidators(Validators.required);
      this.handleTravellerDOB(i);
      this.travellerArrayForm.at(i).get('nationality')?.enable();

    }
    //idtype value changes
    this.travellerArrayForm.at(i).get('idType')?.valueChanges.subscribe(value => {
      this.idTypeTravellerArrayChange(value, i)
    })

    if (travellerArrayObject.ageRange == 'C') {
      this.travellerArrayForm.at(i).get('idNo')?.setValidators(nricValidatorWithMinDays.bind(this.travellerArrayForm.at(i),
        this.travellerArrayForm.at(i).get('ageMin')?.value, this.travellerArrayForm.at(i).get('ageMax')?.value));
    } else {
      // Handle mounters
      var result = this.userInput$.step2?.mountaineeringCoverage?.mountaineerArray.find((o: any) => o.TravelerSequence === travellerArrayObject.TravelerSequence);
      if (result?.adultGroup) {
        var step1 = this.userInput$.step1;
        var label = Type[step1.trgrpcode + travellerArrayObject.ageRange] + " (" + AgeRange[result.adultGroup] + ")";
        this.travellerArrayForm.at(i).get('travellerLabel')?.setValue(label);
        this.travellerArrayForm.at(i).get('travellerMount')?.setValue(true);
        this.travellerArrayForm.at(i).get('idNo')?.setValidators(nricValidator.bind(this.travellerArrayForm.at(i),
          this.generalService.getAgeRangeMin(result.adultGroup, true), this.generalService.getAgeRangeMin(result.adultGroup, false)));

      } else {
        this.travellerArrayForm.at(i).get('idNo')?.setValidators(nricValidator.bind(this.travellerArrayForm.at(i),
          this.travellerArrayForm.at(i).get('ageMin')?.value, this.travellerArrayForm.at(i).get('ageMax')?.value));

      }
    }

    if (this.trgrpcode === 'FM') {
      this.travellerArrayForm.at(i).get('relationship')?.setValidators(Validators.required)
    }
  }

  idTypeTravellerArrayChange(event: any, i: any) {
    if (event === 'NRIC' || event.value === 'NRIC') {
      this.travellerArrayForm.at(i).get('nationality')?.setValue('MAL');
      this.travellerArrayForm.at(i).get('nationality')?.disable();
      this.travellerArrayForm.at(i).get('dob')?.disable();
      this.travellerArrayForm.at(i).get('gender')?.disable();
    } else {
      this.travellerArrayForm.at(i).get('dob')?.enable();
      this.travellerArrayForm.at(i).get('dob')?.setValidators(Validators.required);
      this.handleTravellerDOB(i)
      this.travellerArrayForm.at(i).get('nationality')?.enable();
      this.travellerArrayForm.at(i).get('gender')?.enable();

    }
  }
  async proceedNext(): Promise<void> {
    this.spinnerOverlayService.showLoadOverlay();
    var checkHSBCHolder =
      await this.checkHSBCHolder();
    if (!checkHSBCHolder) { return this.spinnerOverlayService.hideLoadOverlay(); }
    const formValue = this.customerDetailsForm.getRawValue();
    this._store.dispatch(new SET_STEP_3(formValue));
    var scanctionCheck = this.checkSanction(formValue.mainPolicyHolder, formValue.travellerArrayForm,
      this.quoteProgress$.QuotationNumber, "TRAVELLER");
    if (!scanctionCheck) return;

    if (formValue.nomineeArrayForm) {
      var nominee = [];

      for (var p = 0; p < formValue.nomineeArrayForm.length; p++) {
        for (var c = 0; c < formValue.nomineeArrayForm[p].nomineeArrayName.length; c++) {
          if (formValue.nomineeArrayForm[p].nomineeArrayName[c].fullname !== "") {
            nominee.push(formValue.nomineeArrayForm[p].nomineeArrayName[c])
          }
        }
      }
      if (nominee.length > 0) {
        var scanctionCheck = this.checkSanction(formValue.mainPolicyHolder, nominee,
          this.quoteProgress$.QuotationNumber, "NOMINEE");
        if (!scanctionCheck) return;
      }
    }
    this._store.dispatch(new JOURNEY_TRAVELLER_DETAILS('USERDETAILS', 4)).subscribe((_) => {
      var journeyTravellerDetails = _.QuoteProgessState.journeyTravellerDetails;
      if (journeyTravellerDetails?.duplicateCheck.Status == "Success" && journeyTravellerDetails?.duplicateCheck.Result.IsCustomerDuplicate != "false") {
        this.commonErrorDialogHeader = '';
        this.commonErrorDescription = 'You have a pending transaction with the details provided, Please try again in 30 minutes';
        this.commonErrorDialog.open();
        this.spinnerOverlayService.hideLoadOverlay();
      } else if (journeyTravellerDetails.UBBStatus.referRisks && journeyTravellerDetails.UBBStatus.referRisks.length > 0) {
        if (journeyTravellerDetails.UBBStatus.referRisks[0].code == 'RP010') {
          this.commonErrorDialogHeader = "Oops!! You already have an active policy."
          this.commonErrorDescription = "For annual plan, please come back when your policy is ready for renewal. " +
            'Do take note that renewals are allowed two months ahead of expiry.';
          this.dialogError();
        } else if (journeyTravellerDetails.UBBStatus.referRisks[0].code == 'RP007') {
          this.dialogError();
        }
        this.spinnerOverlayService.hideLoadOverlay();
      } else {
        this._store.dispatch(new PROMO_LIST()).subscribe((_) => {
          this.travelCareForm.removeControl('checkoutForm');
          this.travelCareForm.addControl('checkoutForm', checkoutForm);
          const sanctionCheck = this._store.selectSnapshot((state) => state.QuoteProgessState.sanction);
          if (!sanctionCheck) {
            this.spinnerOverlayService.hideLoadOverlay();
            this.router.navigate(['/checkout'], { queryParamsHandling: 'preserve' });
          }
        })
      }
    })
  }

  checkSanction(customerDetailsValues: any, combineNames: any, quotationNumber: any, role: any) {
    if (this.customerDetailsForm.valid) {
      this._store.dispatch(new DO_SANCTION_CHECKING(customerDetailsValues, combineNames, quotationNumber, role))
        .subscribe((_) => {
          if (_.QuoteProgessState.sanction) {
            this.dialogError();
            return false;
          }
          return true;
        });
    }
    return true;
  }

  dialogError() {
    //flowType = 'DIRECT';'STAFFR'; 'REFERRAL'; 'BANK';'AGENT';
    this.flowType$?.subscribe((res: any) => {
      if (res == 'DIRECT') {
        this.commonErrorDialogHeader = '';
        this.commonErrorDescription = 'Oops! We are sorry that we are unable to process your request due to our online ' +
          'risk acceptance controls. Please contact an Allianz representative for assistance.';
        this.commonErrorDialog.open();
      } else {
        this.commonErrorDialogHeader = '';
        this.commonErrorDescription = "Oops! We are sorry that we are unable to process your request due to our online risk acceptance controls. Please leave your details and our representative will contact you to assist you further."
        this.leaveMyDetailsDialog.open();
      }
    });
  }
  // to set the max DOB and min Dob of mian policy holder
  handleDOB() {
    var riskGrpSorted = this.generalService.sortTravelerSequence(this.quoteProgress$.Risk.RiskGrp);
    var ageRange = riskGrpSorted[0].RiskPerson.AgeRange
    var adultGroup = this.userInput$.step2?.mountaineeringCoverage?.mountaineerArray[0].adultGroup;
    if (adultGroup && ageRange == 'A') {
      var minAge = this.generalService.getAgeRangeMin(adultGroup, true)
      var maxAge = this.generalService.getAgeRangeMin(adultGroup, false)
    } else {
      var minAge = this.generalService.getAgeRangeMin(ageRange, true)
      var maxAge = this.generalService.getAgeRangeMin(ageRange, false)
    }
    if (ageRange != 'C') {
      this.maxDateDOB = moment().subtract(minAge, 'years');
      this.minDateDOB = moment().subtract(maxAge, 'years');
    } else {
      //for childern 
      this.maxDateDOB = moment().subtract(minAge, 'days');
      this.minDateDOB = moment().subtract(maxAge, 'years');
    }

  }
  handleTravellerDOB(index: any) {
    if (this.travellerArrayForm.at(index).get('travellerMount')?.value) {
      var ageRange = this.travellerArrayForm.at(index).get('mountAdultGroup')?.value;
    } else {
      var ageRange = this.travellerArrayForm.at(index).get('ageRange')?.value;
    }
    var minAge = this.generalService.getAgeRangeMin(ageRange, true)
    var maxAge = this.generalService.getAgeRangeMin(ageRange, false)

    if (ageRange != 'C') {
      this.travellerArrayForm.at(index).get('ageMinTrPass')?.setValue(moment().subtract(maxAge, 'years'));
      this.travellerArrayForm.at(index).get('ageMaxTrPass')?.setValue(moment().subtract(minAge, 'years'));
    } else {
      this.travellerArrayForm.at(index).get('ageMinTrPass')?.setValue(moment().subtract(maxAge, 'years'));
      this.travellerArrayForm.at(index).get('ageMaxTrPass')?.setValue(moment().subtract(minAge, 'days'));
    }
  }

  mainPolicyHolderAgeCal() {
    let age: any
    let year: any;
    if ((this.mainPolicyHolder?.get('dob')?.value != null && this.mainPolicyHolder?.get('dob')?.value != '') && this.mainPolicyHolder?.get('idType')?.value != 'NRIC') {
      year = this.getDOBMain.get('year')
      age = moment().get('year') - year;
      this.mainPolicyHolder?.get('age')?.setValue(age);
    }
  }

  TravellerAgeCal() {
    let age: any
    let year: any;
    if (this.travellerArrayForm) {
      for (let i = 0; i < this.travellerArrayForm?.length; i++) {
        if ((this.travellerArrayForm?.at(i)?.get('dob')?.value != null && this.travellerArrayForm?.at(i)?.get('dob')?.value != '') && this.travellerArrayForm?.at(i)?.get('idType')?.value != 'NRIC') {
          this.DOBSelectedTrIndex = i;
          year = this.getDOBTraveller.get('year')
          age = moment().get('year') - year;
          this.travellerArrayForm.at(i)?.get('age')?.setValue(age);
        }
      }

    }
  }


  get getDOBTraveller() {
    for (let c = 0; c < this.travellerArrayValue.length; c++) {
      if (c == this.DOBSelectedTrIndex) {
        return this.travellerArrayForm.at(c).get('dob')?.value
      }
    }
  }
  // gaurdianIdNocahnges nric validation
  gaurdianIdNochanges() {
    this.getGuardianIdNo?.valueChanges?.subscribe(async (value) =>
      this.getGuardianIdNo?.setValidators(nricValidatorForGaurdian.bind(this.mainPolicyHolder)))
  }

}


export function nricValidatorForGaurdian(groupControl: any): ValidationErrors | null {
  let idTypeControl = groupControl?._parent?.controls.guardianIdType;
  let idNoControl = groupControl?._parent?.controls.guardianIdNo;

  let idTypeValue = idTypeControl?.value;
  let idNoValue = idNoControl?.value;
  if (!idTypeControl && !idNoControl) {
    idTypeControl = groupControl.controls.idType;
    idNoControl = groupControl.controls.idNo;
    idTypeValue = idTypeControl?.value;
    idNoValue = idNoControl?.value;
  }

  if (!idNoValue) {
    return ({ type: "required", message: 'Please enter ID no.' });
  }
  if (idTypeValue == 'NRIC') {
    idNoValue = idNoValue.replace(/-/g, '');

    if (idNoValue.length == 0) {
      idNoControl?.setErrors({ required: true });
    }
    else
      if (idNoValue.length < 12) {
        idNoControl?.setErrors({ invalidId: true });
      }
      else {
        let myIcFormat =
          /(([[0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01]))([0-9]{2})([0-9]{4})/g;
        let isValid: boolean = myIcFormat.test(idNoValue);

        if (!isValid) {
          idNoControl?.setErrors({ invalidId: true });
        }
      }
  }

  if (idNoControl?.getError("required")) {
    return ({ type: "required", message: 'Please enter ID no.' });
  } else if (idNoControl?.getError("invalidId")) {
    return ({ type: "invalidId", message: 'Please enter a valid NRIC.' });
  }

  return null;
}
