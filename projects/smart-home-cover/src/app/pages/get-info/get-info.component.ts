import {
  ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, HostListener, Renderer2, Injector, ElementRef,
  OnDestroy,
} from '@angular/core';
import {
  FormGroup, FormControl, FormArray, Validators, AbstractControl, ValidationErrors,
} from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import {
  ActionCompletion, Actions, ofActionCompleted, ofActionSuccessful, Select, Store,
} from '@ngxs/store';
import { RESET_SET_STEP_1, RESET_SET_STEP_2, SET_STEP_1 } from '../../store/actions/user-input.action';
import {
  PLAN_RECOMMENDATION, CALCULATOR, BASIC_PROPERTY_DETAILS, RESET_CALCULATOR, GET_BUNDLE_CONFIG
} from '../../store/actions/quote-progess.action';
import * as CONS_GET_INFO from '../../constants/get-info-constants';
import { filter, map, Observable, Subject, takeUntil } from 'rxjs';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { PRODUCT_CONFIG } from '../../../../../../module/store/general.class';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { GeneralSelectors } from 'module/store/general.selectors';
import { NavigationService } from '@services/navigation.service';
import { ServerTimeoutDialogComponent } from 'module/server-timeout-dialog/server-timeout-dialog.component';
import { QuoteProgessState } from '../../store/states';
import { showChatBot } from '@functions/chatBot.function';
import { PARTNER_COVERAGE_TYPE_AN, PRODUCT_CAT } from '../../constants/shc-constants';
import { FormService } from '@services/form.service';
import smoothScroll from '@functions/smooth-scroll.function';
import { BUILDING_AGE } from '../../constants/property-details-constants';

@Component({
  selector: 'get-info',
  templateUrl: './get-info.component.html',
  styleUrls: ['./get-info.component.scss'],
  providers: [DecimalPipe],
})
export class GetInfoComponent implements OnInit, OnDestroy {
  @ViewChild('sumInsured') sumInsured: any;
  @ViewChild('sumInsuredValue') sumInsuredValue!: ElementRef;
  @ViewChild('sumInsuredHolder') sumInsuredHolder: any;
  @ViewChild('agentRequiredDialog') agentRequiredDialog: any;
  @ViewChild('leaveMyDetailsDialog') leaveMyDetailsDialog: any;
  @ViewChild('commonErrorDialog') commonErrorDialog: any;
  @ViewChild('addressDialog') addressDialog: any;
  @ViewChild('main') main: any;

  @ViewChild('insuredCalculatorDialog')
  insuredCalculatorDialog!: TemplateRef<any>;
  currentformValue: any;
  sumInsuredReadonly: boolean = false;

  agentRequiredDialogHeader = 'Agent required to proceed';
  agentRequiredDialogDescription = `We're unable to process your request due to our online risk acceptance controls. Please use our Agent Finder to find an agent nearest to you that can assist you further.`;
  leaveMyDetailsDialogHeader = '';
  leaveMyDetailsDialogDescription = `We're unable to process your request due to our online risk acceptance controls. \nPlease leave your details and our agent will be in touch to assist you further.`;

  @HostListener('window:scroll', ['$event'])
  isScrolledIntoView() {
    if (this.sumInsuredHolder && this.sumInsuredHolder?.nativeElement?.getBoundingClientRect) {
      const rect = this.sumInsuredHolder?.nativeElement?.getBoundingClientRect();
      const topShown = rect.top >= 0;
      const bottomShown = rect.top <= window.innerHeight;

      this.isSumInsuredScrolledIntoView = topShown && bottomShown;
      if (this.isSumInsuredScrolledIntoView && this.sumInsuredHasError) {
        setTimeout(() => {
          this.quoteForm.markAllAsTouched();
          this.changeDetectorRef.detectChanges();
        }, 100);
      }
    }
  }
  imageFolder: string = IMAGE_FOLDER;
  coverageData: any;
  renewalPolicyData: any;
  isLoading: boolean = true;
  selectedPolicy: any = 0;
  unpaidPolicy: number = 0;
  isSelected: boolean = false;
  repay: boolean = false;
  BUILDING_AGE = BUILDING_AGE;
  KNOW = CONS_GET_INFO.KNOW;
  LEASE_TYPES = CONS_GET_INFO.LEASE_TYPES;
  BUILT_USING_BRICK = CONS_GET_INFO.BUILT_USING_BRICK;
  DO_STATE_TYPES = CONS_GET_INFO.DO_STATE_TYPES;
  INSURED_QUESTIONS_CHOICES = CONS_GET_INFO.INSURED_QUESTIONS_CHOICES;
  INSURED_QUESTIONS_ERROR = CONS_GET_INFO.INSURED_QUESTIONS_ERROR;
  MEASUREMENT = CONS_GET_INFO.MEASUREMENT_SQFT;
  maxInsured = 1000000;
  isSumInsuredScrolledIntoView: boolean = false;
  sumInsuredHasError: boolean = false;
  decimalPipe?: DecimalPipe;
  calculatorInd: boolean = false;
  coverageTypeLabel = "I am looking for a";
  yearOfLabel = 'the year my home was built.';
  yearOfLabel2 = 'My home';

  /*---- From Store ----*/
  @Select(GeneralSelectors.selectLov('OWNERTYPE')) ownerType$: any;
  @Select(GeneralSelectors.selectLov('BUILDSTOREYCODE')) BUILDSTOREYCODE$: any;
  @Select(GeneralSelectors.productConfig) productConfig$: Observable<PRODUCT_CONFIG> | undefined;
  @Select(GeneralSelectors.flowType) flowType$: any;
  @Select(GeneralSelectors.utmSource) utmSource$: any;
  @Select(QuoteProgessState.documentData) documentData$: any;
  @Select(GeneralSelectors.selectLov('COVERAGETYPE')) coverageType$: any;
  @Select(GeneralSelectors.questions) underWritingConfig$!: Observable<any>;

  //renewal$: any;

  /*---- Error ----*/
  showMaxInsuredError?: boolean;
  invalidSumInsured: boolean = false;

  /*-- Form --*/
  smartHomeCoverForm = CONS_GET_INFO.FORMGROUP;

  policyForm = this.smartHomeCoverForm.get('policyForm') as FormGroup;
  cardsArray = this.policyForm.get('cardsFormArray') as FormArray;
  quoteForm = this.smartHomeCoverForm.get('quoteForm') as FormGroup;
  addressForm = this.quoteForm.get('address') as FormGroup;
  insuredDialogForm = this.smartHomeCoverForm.get('insuredDialogForm') as FormGroup;
  coverageForm = this.smartHomeCoverForm.get('coverageForm') as FormGroup;
  policyDetailsForm = this.smartHomeCoverForm.get('policyDetailsForm') as FormGroup;
  customerDetails!: FormGroup;

  /*---- Modal Dialog ----*/
  activeDialogRef!: NxModalRef<any>;
  insuredDialogQuestionNo: number = 1;
  insuranceCoverageAmount = false;

  private ngUnsubscribe = new Subject<void>();

  //BUNDLE CONFIG
  bundleOwnerType: any = [];
  bundlePropType: any = [];
  bundleCoverageType: any = [];
  bundleHouseOwnerDisplayInd: boolean = true;
  screenRefresh = false;
  is_PARTNER_COVERAGE_TYPE_AN = false;
  coverageTypeUntouch: any = [];

  /*-- GEO Code --*/
  geoCode = true;
  geoLabel = 'My home address is :';
  showAddress = false;

  constructor(
    private formService: FormService,
    private route: Router,
    private _store: Store,
    public dialogService: NxDialogService,
    public spinnerOverlayService: SpinnerOverlayService,
    public navigation: NavigationService,
    private changeDetectorRef: ChangeDetectorRef,
    private action$: Actions,
    private injector: Injector,
    private renderer: Renderer2,
    private router: Router,
  ) {
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          this.screenRefresh = true;
          window.localStorage.clear();
          this._store.dispatch(new RESET_SET_STEP_1());
        }
      })
  }

  ngOnInit() {
    var history = this.navigation.getHistory();
    var result = history.map((s: any) => s.startsWith("/quotation"));

    if (!result.includes(true)) {
      if (
        !window.performance
          .getEntriesByType('navigation')
          .map((nav) => (nav as any).type)
          .includes('reload')
      ) {
        window.localStorage.clear();
      }
    }

    var getPreviousUrl = this.navigation.getPreviousUrl();
    if (getPreviousUrl) {
      if (getPreviousUrl.includes("/quotation")) {
        this.geoCode = false;
      }
      if (getPreviousUrl.includes("/customer-details")) {
        this.geoCode = true;
      }
    }

    const formValues = this.formService.getForms();
    if (formValues) {
      this.smartHomeCoverForm
        .get('quoteForm')
        ?.get('CustomerType')
        ?.setValue(formValues.quoteForm.CustomerType);
      this.smartHomeCoverForm.patchValue(formValues);
    }

    this.quoteForm = this.smartHomeCoverForm.get('quoteForm') as FormGroup;
    this.addressForm = this.quoteForm.get('address') as FormGroup;
    this.insuredDialogForm = this.smartHomeCoverForm.get('insuredDialogForm') as FormGroup;
    this.policyForm = this.smartHomeCoverForm.get('policyForm') as FormGroup;
    this.coverageForm = this.smartHomeCoverForm.get('coverageForm') as FormGroup;
    this.policyDetailsForm = this.smartHomeCoverForm.get('policyDetailsForm') as FormGroup;
    this.customerDetails = this.policyDetailsForm.get('customerDetails') as FormGroup;

    if (this.quoteForm.get('SumInsured')?.value) {
      this.checkSumInsured(this.quoteForm.get('SumInsured')?.value);
    }

    this.smartHomeCoverForm.valueChanges.subscribe(() => {
      this.formService.updateForms(this.smartHomeCoverForm);
    });

    this.addressForm.valueChanges.subscribe(async () => {
      if (this.addressForm.get('viewport')?.value !== '' && this.addressForm.get('viewport')?.value !== null) {
        this.showAddress = true;
        //CoverageType:MY handling for postcode change
        if (this.CustomerType === 'HO'
          && this.insuredDialogForm.get('agreedValue')?.value !== '') {
          this.insuredDialogForm.get('agreedValue')?.setValue('0000');
        }
        if (this.customerDetails.get('correspondenceCheckbox')?.value) {
          this.customerDetails?.get('correspondenceDetails')?.patchValue({
            address1: this.addressForm.value.address1,
            address2: this.addressForm.value.address2,
            address3: this.addressForm.value.address3,
            addressType: "C",
            addressnumber: this.addressForm.value.addressnumber,
            placeId: this.addressForm.value.placeId,
            plusCode: this.addressForm.value.plusCode,
            searchControl: "",
            viewport: this.addressForm.value.viewport,
            city: this.addressForm.value.city,
            state: this.addressForm.value.state,
            postCode: this.addressForm.value.postCode,
          });
        }
        this.changeDetectorRef.detectChanges();
        this.quoteForm.updateValueAndValidity();
      }
    });

    this.quoteForm.get('CustomerType')?.valueChanges.subscribe(async () => {
      this.checkCustomerType();
    });

    this.decimalPipe = this.injector.get(DecimalPipe);

    this.insuredDialogForm
      .get('houseInfo')
      ?.get('unitOfMeasure')
      ?.valueChanges.subscribe((value: string) => {
        value == 'SQFT'
          ? (this.MEASUREMENT = CONS_GET_INFO.MEASUREMENT_SQFT)
          : (this.MEASUREMENT = CONS_GET_INFO.MEASUREMENT_METER);
      });

    this.spinnerOverlayService.showLoadOverlay();
    this._store.dispatch(new GET_BUNDLE_CONFIG(PRODUCT_CAT)).subscribe((_) => {
      if (_.QuoteProgessState.bundle !== undefined) {
        this.checkBundle();
        this.checkCustomerType();
        this.checkCoverageLabel();
        var productConfig = this._store.selectSnapshot((state) => state.GeneralState.productConfig);
        showChatBot(productConfig?.chatbotInd);
      }
      if (this.screenRefresh) {
        this.isAutoPopulate();
      }
      this.spinnerOverlayService.hideLoadOverlay();
    });
    //handle back screen
    this.checkPreviousAgreedValue();
    this.yearOfConstructionValue(false);
    if (this.addressForm.get('viewport')?.value != '') {
      this.showAddress = true;
    }
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /*---- Get ----*/
  get PropertyType(): string {
    return this.quoteForm.get('PropertyType')?.value;
  }

  get yearOfConsUnsure(): string {
    return this.quoteForm.get('yearOfConsUnsure')?.value;
  }

  get SumInsured() {
    return this.quoteForm.get('SumInsured');
  }
  get SumInsuredValue() {
    var value = parseInt(this.quoteForm.get('SumInsured')?.value.toString().replaceAll(',', ''));
    return isNaN(value) ? '' : value;
  }
  get CustomerType(): string {
    return this.quoteForm.get('CustomerType')?.value;
  }
  get BuiltUsingBrickControlValue(): string {
    return this.quoteForm.get('BuiltUsingBrick')?.value.toString();
  }

  getFormControl(groupName: string, coverageDetails: any): any {
    const group: any = {};
    coverageDetails.find((data: any) => {
      if (data.parentFormGroupName == groupName) {
        group[data.coverCode] = new FormControl(false);
      }
    });
    return group;
  }

  /* Validation handler */
  isAutoPopulate() {
    let urlParameters = this._store.selectSnapshot((state) => state.GeneralState.customViewObj);

    if (urlParameters.hasOwnProperty('p_ownertype')) {
      this.autoPopulateForm(urlParameters);
    }
  }

  autoPopulateForm(urlParameters: any) {
    if (urlParameters.hasOwnProperty('p_ownertype')) {
      let ownertype = urlParameters['p_ownertype'];
      this.quoteForm.controls?.CustomerType.setValue(ownertype);

      if (ownertype == 'HO') {
        this.quoteForm.addControl('ExistingLoan', new FormControl('', Validators.required));
        this.quoteForm.addControl('HasTenant', new FormControl('', Validators.required));
        this.quoteForm.get('SumInsured')?.setValidators([this.SumInsuredValidator.bind(this)]);

        if (urlParameters.hasOwnProperty('p_propertytype')) {
          this.quoteForm.controls?.PropertyType.setValue(urlParameters['p_propertytype']);
        }
        if (urlParameters.hasOwnProperty('p_si')) {
          this.quoteForm.controls?.SumInsured.setValue(urlParameters['p_si']);
        }
        if (urlParameters.hasOwnProperty('p_bankloan')) {
          let bankLoadValue = Boolean(urlParameters['p_bankloan'] == 'Y');
          this.quoteForm.controls?.ExistingLoan.setValue(bankLoadValue);
        }
        if (urlParameters.hasOwnProperty('p_tenant')) {
          let tenantValue = Boolean(urlParameters['p_tenant'] == 'Y');
          this.quoteForm.controls?.HasTenant.setValue(tenantValue);
        }
        if (urlParameters.hasOwnProperty('p_covertype')) {
          const coverType = urlParameters['p_covertype'];
          this.quoteForm.controls?.CoverageType.setValue(coverType);
          if (coverType == 'MY' && urlParameters['p_propertytype'] == 'LD') {
            this.valueMultiYearChange(false);
          }
        }
      }
    }
    if (urlParameters.hasOwnProperty('p_postcode')) {
      this.addressForm.get('postCode')?.setValue(urlParameters['p_postcode']);
    }
    if (urlParameters.hasOwnProperty('p_materialtype')) {
      let materialTypeValue = Boolean(urlParameters['p_materialtype'] == 'Y');
      this.quoteForm.controls?.BuiltUsingBrick.setValue(materialTypeValue);
    }
    if (urlParameters.hasOwnProperty('p_covertype')) {
      const coverType = urlParameters['p_covertype'];
      this.quoteForm.controls?.CoverageType.setValue(coverType);
    }

    this.quoteForm.updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }

  valueChangeAgreed() {
    this.insuredDialogForm.get('agreedValue')?.setValue('');
  }

  checkPropertyType() {
    if (this.quoteForm.get('PropertyType')?.value == 'LD') {
      this.quoteForm.get('BuildingStorey')?.setValidators(Validators.required);
    } else {
      this.quoteForm.get('BuildingStorey')?.clearValidators();
      this.quoteForm.get('BuildingStorey')?.updateValueAndValidity();
    }
  }
  /*-----
  If bundle API returns only "AN" for coverage type, always default to Annual 
  only regardless Tenant|Owner and Landed|Non-landed.
    If bundle API returns both "AN" and "MY", then the following logics will apply.
      1) Tenant + Landed can choose Annual / Multi-year. 
      2) Tenant + Non-landed can choose Annual / Multi-year.
      3) Owner + Landed can choose Annual / Multi-year.
      4) Owner + Non-landed is defaulted to Annual only.-----*/
  checkCoverageType() {
    if (!this.is_PARTNER_COVERAGE_TYPE_AN) {
      if (this.coverageTypeUntouch.length == 2) {
        if (this.quoteForm.get('CustomerType')?.value == 'HO' && this.quoteForm.get('PropertyType')?.value == 'NL') {
          this.bundleCoverageType = []
          this.coverageType$?.subscribe((coverageType: any) => {
            this.bundleCoverageType = [coverageType.find((coverageType: any) => coverageType.Code == 'AN')];
            this.quoteForm?.get('CoverageType')?.setValue(this.bundleCoverageType[0].Code);
          })
        } else {
          this.bundleCoverageType = []
          this.coverageType$?.subscribe((coverageType: any) => {
            coverageType.forEach((element: any) => {
              this.bundleCoverageType.push(element);
            });
            this.quoteForm?.get('CoverageType')?.setValue('');
          })
        }
      }
      this.checkCoverageLabel();
    }
  }

  valueCheckChange(onRefresh?: boolean) {
    const multiYear = Boolean(this.quoteForm.get('CoverageType')?.value == 'MY');
    const houseOwner = Boolean(this.quoteForm.get('CustomerType')?.value == 'HO');
    const landed = Boolean(this.quoteForm.get('PropertyType')?.value == 'LD');

    if (landed && multiYear && houseOwner) {
      this.valueMultiYearChange(onRefresh);
    }
    else {
      this.valueAnnualChange();
    }
  }

  valueMultiYearChange(onRefresh?: boolean) {
    const userInputValue = this.quoteForm.get('SumInsured')?.value.replaceAll(',', '');
    const agreedValue = this._store.selectSnapshot(state => state.QuoteProgessState.calculator.estimatedSumInsured);
    const sameValue = Boolean(Number(userInputValue) == Number(agreedValue));

    if (onRefresh || !sameValue) {
      this.quoteForm.get('SumInsured')?.setValue('');
      this.openDialog(this.insuredCalculatorDialog, 'full')
    }
    this.sumInsuredReadonly = true;
  }

  valueAnnualChange() {
    const userInputValue = this.quoteForm.get('SumInsured')?.value.replaceAll(',', '');
    const agreedValue = this._store.selectSnapshot(state => state.QuoteProgessState.calculator.estimatedSumInsured);
    const valueSumInsured = Number(userInputValue) == Number(agreedValue) ? '' : userInputValue;

    this.sumInsuredReadonly = false;
    this.quoteForm.get('SumInsured')?.setValue(valueSumInsured != '' || valueSumInsured != 0 ? valueSumInsured.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '')
    this.quoteForm.get('SumInsured')?.updateValueAndValidity();
  }

  checkCoverageLabel() {
    if (this.quoteForm.get('CoverageType')?.value == 'AN') { this.coverageTypeLabel = "I am looking for an" } else { this.coverageTypeLabel = "I am looking for a" }
  }

  checkPreviousAgreedValue() {
    if (this.quoteForm.get('CoverageType')?.value != 'MY') {
      this.sumInsuredReadonly = false;
    } else {
      this.sumInsuredReadonly = true;
    }

    var calcValue = this._store.selectSnapshot((state) => state.QuoteProgessState.calculator.estimatedSumInsured);
    if (calcValue) {
      var SIValue = Number(this.quoteForm.get('SumInsured')?.value?.replaceAll(',', ''))
      if (calcValue === SIValue) {
        this.insuranceCoverageAmount = true;
      }
    }
  }

  clearAgreedValue() {
    this.insuredDialogForm.get('agreedValue')?.setValue('');
    this.insuredDialogForm.get('buildingType')?.setValue('');
    this.insuredDialogForm.get('finishedCost')?.setValue('');
    this.insuredDialogForm.get('houseInfo')?.get('improvedFinishes')?.setValue('');
    this.insuredDialogForm.get('houseInfo')?.get('area')?.setValue('');
    this.insuredDialogForm.get('houseInfo')?.get('unitOfMeasure')?.setValue('SQFT');
    this.insuredDialogForm.get('agreedValue')?.setValue('');

    this.quoteForm.get('SumInsured')?.setValue('');
    this._store.dispatch(new RESET_CALCULATOR()).pipe(map(data => data));
  }

  commonErrorDialogHeader = '';
  commonErrorDescription = '';
  checkAgreedValue() {
    if (this.insuredDialogForm.get('agreedValue')?.value == '0000' && this.CustomerType === 'HO') {
      this.insuredDialogForm.get('agreedValue')?.setValue("");
      this.commonErrorDialogHeader = '';
      this.commonErrorDescription = 'Oops! You have changed your postcode. Please use the calculator to refresh your sum insured.';
      this.commonErrorDialog.open();
    }
  }

  yearOfConstructionValue(selected: any) {
    var value = this.quoteForm.get('yearOfConsUnsure')?.value;
    if (selected) {
      this.quoteForm.get('ageOfBuilding')?.setValue('');
      this.quoteForm.get('yearOfConstruction')?.setValue('');
    }
    if (value === 'know') {
      this.yearOfLabel = 'the year my home was built which was in the year';
      this.yearOfLabel2 = ' . My home';
      this.quoteForm.get('ageOfBuilding')?.setValidators(null);
      this.quoteForm.get('ageOfBuilding')?.updateValueAndValidity();
      this.quoteForm.get('yearOfConstruction')?.setValidators([Validators.required, this.validateYearOfConstrution.bind(this)]);
      this.quoteForm.get('yearOfConstruction')?.updateValueAndValidity();
    } else if ((value === 'donotknow')) {
      this.yearOfLabel = 'the year my home was built. The estimated age of my home is'
      this.yearOfLabel2 = 'old. My home'
      this.quoteForm.get('ageOfBuilding')?.setValidators(Validators.required);
      this.quoteForm.get('ageOfBuilding')?.updateValueAndValidity();
      this.quoteForm.get('yearOfConstruction')?.setErrors(null);
      this.quoteForm.get('yearOfConstruction')?.setValidators(null);
      this.quoteForm.get('yearOfConstruction')?.updateValueAndValidity();
    }
  }

  insuredCalculatorDialogOpen() {
    this.openDialog(this.insuredCalculatorDialog, 'full')
  }

  sumInsuredChange() {
    this.insuranceCoverageAmount = false;
    this._store.dispatch(new RESET_CALCULATOR());
  }

  checkCustomerType() {
    if (this.CustomerType === 'HO') {
      const bundleData = this._store.selectSnapshot((state) => state.QuoteProgessState.bundleConfig);
      if (bundleData?.houseOwnerDisplayInd) {
        this.quoteForm.addControl('SumInsured', new FormControl('', Validators.required));
        this.quoteForm.get('SumInsured')?.setValidators([this.SumInsuredValidator.bind(this)]);
      }

      if (bundleData?.existingLoanQuestionInd) {
        this.quoteForm.addControl('ExistingLoan', new FormControl('', Validators.required));
      }

      if (bundleData?.landlordInsuranceDisplayInd) {
        this.quoteForm.addControl('HasTenant', new FormControl('', Validators.required));
      }

      this.coverageForm?.addControl(
        'houseOwner',
        new FormGroup({
          coverBuildingDamage: new FormControl(true),
          discountForm: new FormGroup({
            policyDate: new FormControl(''),
            policyHolder: new FormGroup({
              idType: new FormControl('NRIC'),
              idNo: new FormControl(''),
              nationality: new FormControl('MAL')
            }),
            jointPolicyHolders: new FormArray([
              new FormGroup({
                idType: new FormControl('NRIC'),
                idNo: new FormControl(''),
              }),
            ]),
          }),
        })
      );

      this.coverageForm?.addControl(
        'mortgageLoanInstallmentProtection',
        new FormGroup({
          coverLoanTroubles: new FormControl(true),
        })
      );

      this.coverageForm?.addControl(
        'landlordInsurance',
        new FormGroup({
          coverFromTroublesomeTenants: new FormControl(true),
        })
      );

      this.coverageForm?.get('coverRepairsMaintenance')?.enable();
      this.policyDetailsForm.get('financialInterest')?.enable();
    } else {
      this.quoteForm.removeControl('ExistingLoan');
      this.quoteForm.removeControl('HasTenant');
      this.quoteForm.removeControl('SumInsured');
      this.policyDetailsForm.get('financialInterest')?.disable();
      this._store.dispatch(new RESET_CALCULATOR());
    }
    //Handle hsbc card holder checking
    this.policyDetailsForm.get('hsbcCardChecking')?.disable();
    this.quoteForm.updateValueAndValidity();
    this.changeDetectorRef.detectChanges();
  }

  SumInsuredValidator(control: AbstractControl): ValidationErrors | null {
    let stringValue;
    if (control.value === null || control.value === '') return { required: true };
    stringValue = control.value.toString().replaceAll(',', '');
    return parseInt(stringValue) > this.maxInsured ? { invalid: true } : null;
  }

  openDialog(dialog: any, size?: string, closeIcon?: any): void {
    if (size === 'full') {
      /*-----
        Requirement:
        Full width modal dialog at browser width 704px and
        under and back to usual size once above 704px.
        NDBX Documents:
        Unfortunate, that ndbx documents does not have a simpler approach to set
        ONLY full screen for 704px and below browser width.
        Solution:
        For the switch statement for case 'full' setting is provided as follows.
        However, when browser width is above 704px it does not revert back to the original sizing.
        To make sure it does revert back to regular sizing style is done in global
        styles.common-fixes.css to revert it back to original setting as ndbx intended.
      ----*/
      this.activeDialogRef = this.dialogService.open(dialog, {
        showCloseIcon: Boolean(closeIcon != 'n'),
        minHeight: '100vh',
        minWidth: '100vw',
        maxWidth: '100vw',
        disableClose: Boolean(closeIcon == 'n')
      });
    } else {
      this.activeDialogRef = this.dialogService.open(dialog, {
        showCloseIcon: Boolean(closeIcon != 'n'),
        width: 'calc(100vw - 16px)',
        disableClose: Boolean(closeIcon == 'n')
      });
    }
    this.activeDialogRef.afterClosed().subscribe((value) => {
      this.insuredDialogQuestionNo = 1;
    });
  }

  openAgentDialog(): void {
    const formValue = this.quoteForm.getRawValue();
    this._store.dispatch(new SET_STEP_1(formValue));
    //flowType = 'DIRECT';'STAFFR'; 'REFERRAL'; 'BANK';'AGENT';
    this.flowType$?.subscribe((res: any) => {
      if (res == 'DIRECT') {
        this.agentRequiredDialog.open();
      } else {
        this.leaveMyDetailsDialog.open();
      }
    });
  }

  validateSumInsured(control: any) {
    const valx = control.value?.toString();
    const valueParsed = parseFloat(valx.replace(/,/g, ''));

    if (valueParsed && (Number(valueParsed) > this.maxInsured)) {
      control.markAsDirty();
      control.markAsTouched();
      control.setErrors({ invalid: true });
      control.updateValueAndValidity();
      this.changeDetectorRef.detectChanges();
    }
    else {
      control.setErrors(null);
      control.markAsPristine();
      control.markAsUntouched();
      control.updateValueAndValidity();
      this.changeDetectorRef.detectChanges();
    }
  }

  checkSumInsured(value: any) {
    if (value) {
      const valx = value.toString();

      if (valx.indexOf(',') > 0) {
        const valueParsed = parseFloat(value.replace(/,/g, ''));

        //2. If, after comma, the value is more than 1 million
        if (
          Number(valueParsed) > this.maxInsured ||
          Number(valueParsed) == undefined
        ) {
          this.quoteForm.get('SumInsured')?.markAsDirty();
          this.quoteForm.get('SumInsured')?.markAsTouched();
          this.quoteForm.get('SumInsured')?.setErrors({ invalid: true });
          this.invalidSumInsured = true;
        }
        else if (Number(valueParsed) == 0) {
          this.invalidSumInsured = false;
        }
      }
    }
  }
  /*---- Functions ----*/
  checkBundle() {
    this.coverageTypeUntouch = [];
    const bundleData = this._store.selectSnapshot((state) => state.QuoteProgessState.bundleConfig);
    if (bundleData?.ownerType.length > 0) {
      this.ownerType$.subscribe((ownerType: any) => {
        const bundleOwnerType = bundleData.ownerType;
        let pack_data: any = [];
        if (bundleOwnerType.length > 0 && ownerType != undefined) {
          bundleOwnerType.forEach((ownerTypeB: any) => {
            const xyz = ownerType.find((item: any) => item.Code == ownerTypeB);
            pack_data.push(xyz);
          });

          this.bundleOwnerType = pack_data;
          if (this.bundleOwnerType.length == 1) {
            this.quoteForm?.get('CustomerType')?.setValue(this.bundleOwnerType[0].Code);
          }
        }
      });
    }

    if (bundleData?.propertyType.length > 0) {
      const bundlePropType = bundleData.propertyType;
      let pack_data: any = [];
      bundlePropType.forEach((propTypeB: any) => {
        const xyz = this.LEASE_TYPES.find((item: any) => item.value == propTypeB);
        pack_data.push(xyz);
      });

      this.bundlePropType = pack_data;

      if (bundlePropType.length == 1) {
        this.quoteForm?.get('PropertyType')?.setValue(this.bundlePropType[0].value);
      }
    }

    if (bundleData?.coverageTypes.length > 0) {
      this.coverageType$?.subscribe((coverageType: any) => {
        const bundleCoverageType = bundleData.coverageTypes;
        let pack_data: any = [];
        if (bundleCoverageType.length > 0 && coverageType != undefined) {
          bundleCoverageType.forEach((coverageTypeB: any) => {
            const xyz = coverageType.find((item: any) => item.Code == coverageTypeB);
            pack_data.push(xyz);
          });

          this.coverageTypeUntouch = pack_data;
          this.bundleCoverageType = pack_data;
          if (this.bundleCoverageType.length == 1) {
            this.quoteForm?.get('CoverageType')?.setValue(this.bundleCoverageType[0].Code);
          }
        }
      });
    }

    if (!bundleData?.existingLoanQuestionInd) {
      this.quoteForm.removeControl('ExistingLoan');
    }

    if (!bundleData?.landlordInsuranceDisplayInd) {
      this.quoteForm.removeControl('HasTenant');
    }

    if (!bundleData?.houseOwnerDisplayInd) {
      this.quoteForm.removeControl('SumInsured');
    }
    this.checkPropertyType();


    this.utmSource$.subscribe((utmSource: any) => {
      if (PARTNER_COVERAGE_TYPE_AN.includes(utmSource)) {
        this.coverageType$?.subscribe((coverageType: any) => {
          this.is_PARTNER_COVERAGE_TYPE_AN = true;
          this.bundleCoverageType = [coverageType.find((coverageType: any) => coverageType.Code == 'AN')];
          this.coverageTypeUntouch = [coverageType.find((coverageType: any) => coverageType.Code == 'AN')];
          if (this.bundleCoverageType.length == 1) {
            this.quoteForm?.get('CoverageType')?.setValue(this.bundleCoverageType[0].Code);
          }
        })
      }
    });
    this.quoteForm.updateValueAndValidity();
  }

  checkBundleCoverageTypes() {
    if (this.quoteForm.get('PropertyType')?.value == 'NL') {
      this.coverageTypeLabel = "I am looking for an"
    } else {
      this.coverageTypeLabel = "I am looking for a"
    }
  }

  calculateInsuredCoverage(): void {
    this.insuranceCoverageAmount = false;
    const formValue = this.insuredDialogForm.getRawValue();
    const postCode = this.addressForm.get('postCode')?.value;
    var improvedFinishes = formValue?.houseInfo?.improvedFinishes;
    improvedFinishes =
      improvedFinishes != null && improvedFinishes != ''
        ? improvedFinishes.replaceAll(',', '')
        : '0';
    this.insuredDialogForm.get('houseInfo')?.get('improvedFinishes')?.setValue(improvedFinishes)

    //TO BE ADDED WHEN INSTRUCTED
    var payload = {
      buildingType: formValue.buildingType,
      finishedCost: formValue.finishedCost,
      improvedFinishes: improvedFinishes,
      area: formValue.houseInfo.area,
      unitOfMeasure: formValue.houseInfo.unitOfMeasure,
      postalCode: postCode,
    };

    var myObservableObject$ = this._store.dispatch(new CALCULATOR(payload));

    myObservableObject$.subscribe((response) => {
      var insuranceCoverageAmount = response.QuoteProgessState.calculator.estimatedSumInsured;
      this.insuredDialogForm.get('agreedValue')?.setValue(response.QuoteProgessState.calculator.estimatedSumInsured)
      if (insuranceCoverageAmount > this.maxInsured) {
        this.openAgentDialog();
      }
    });

    document.getElementById('summary')?.scrollIntoView();
  }

  submitHouseEvaluationForm(): void {
    this.closeDialog();
    this.insuranceCoverageAmount = true;
    var covertString = this.insuredDialogForm.get('agreedValue')?.value.toString();
    this.renderer.setAttribute(this.sumInsuredValue.nativeElement, 'type', 'text');
    let controlString = this.decimalPipe?.transform(covertString, `1.2-2`);
    this.quoteForm.controls?.SumInsured.setValue(controlString);
  }

  closeDialog(): void {
    this.activeDialogRef.close();
    this.dialogService.closeAll();
  }

  /*---- Functions ----*/
  updateAdditionalControls() {
    var coverageDetails = this._store.selectSnapshot(
      (state) => state.UserInputState.coverageDetails
    ).accordions;
    var result = coverageDetails.map((data: any) => data.parentFormGroupName);
    //filter undefined
    result = result.filter(function (element: undefined) {
      return element !== undefined;
    });
    //filter duplicate
    let parentObject = [...new Set(result)];

    parentObject.forEach((data: any) => {
      let accordionControl = this.coverageForm.get(data) as FormGroup;
      var group = this.getFormControl(data, coverageDetails);
      accordionControl.removeControl('additionalCoverage');
      accordionControl.addControl('additionalCoverage', new FormGroup(group), { emitEvent: false });
      this.changeDetectorRef.detectChanges();
    });
  }

  nextQuestion() {
    if (this.quoteForm.get('PropertyType')?.value == 'NL') {
      this.quoteForm.get('BuildingStorey')?.setValue('909');
    }
    this._store.dispatch(new RESET_SET_STEP_2());

    const formValue = this.quoteForm.getRawValue();
    this._store.dispatch(new SET_STEP_1(formValue));
    var BuiltUsingBrick = this.quoteForm.get('BuiltUsingBrick')?.value.toString();

    if (BuiltUsingBrick === 'true') {
      this.spinnerOverlayService.showLoadOverlay();

      this._store.dispatch([new BASIC_PROPERTY_DETAILS()]).subscribe((_) => {
        if (_[0].QuoteProgessState.quoteProgress.UBBStatus.ReferRiskList.length == 0) {
          this._store.dispatch(new PLAN_RECOMMENDATION()).subscribe((result) => {
            result.UserInputState.coverageDetails.accordions.find((accordin: any) => {
              if (accordin.formGroupName && accordin.formLevel) {
                this.coverageForm.get(accordin.formLevel)?.get(accordin.formGroupName)?.setValue(accordin.selected);
                this.changeDetectorRef.detectChanges();
              }
            })
          })
        } else {
          this.spinnerOverlayService.hideLoadOverlay();
          this.openAgentDialog();
        }
      });

      this.action$
        .pipe(ofActionCompleted(PLAN_RECOMMENDATION), takeUntil(this.ngUnsubscribe))
        .subscribe((data: ActionCompletion) => {
          if (data.result.error) {
            //handle mulitple popup
            this.spinnerOverlayService.hideLoadOverlay();
            if (this.activeDialogRef == undefined) {
              this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
                showCloseIcon: true,
                data: { refreshPage: true },
              });
            }
            // in case timeout again
            else if (this.activeDialogRef.getState() == 2) {
              this.spinnerOverlayService.hideLoadOverlay();
              this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
                showCloseIcon: true,
                data: { refreshPage: true },
              });
            }
          }
        });

      this.action$.pipe(ofActionSuccessful(PLAN_RECOMMENDATION)).subscribe(async () => {
        this.updateAdditionalControls();
        const customerType = this._store.selectSnapshot(
          (state) => state.UserInputState.userInput.step1.CustomerType
        );
        // handle back screen from quotation
        if (customerType == 'HO') {
          this.coverageForm?.get('houseOwner')?.get('discountForm')?.reset();
          this.coverageForm?.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('idType')?.setValue('NRIC');
          this.coverageForm?.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('nationality')?.setValue('MAL');
          this.coverageForm.get('houseOwner')?.get('discountForm')?.get('policyHolder')?.get('nationality')?.disable();
        }
        this.spinnerOverlayService.hideLoadOverlay();
        this.route.navigate(['/quotation'], {
          queryParamsHandling: 'preserve',
        });
      });
    } else {
      this.openAgentDialog();
    }
  }
  /** Renewal Form Step 1 function */
  // check(detail: number): void {
  //   if (this.cardsArray.at(detail).value === true) {
  //     this.cardsArray.controls.forEach((card) => {
  //       card.setValue(false);
  //     });
  //     this.cardsArray.at(detail).setValue(true);
  //     this.selectedPolicy = detail;
  //   } else {
  //     this.cardsArray.at(detail).setValue(false);
  //   }
  // }

  // checkPolicyIsSelected(): void {
  //   this.isSelected = this.cardsArray.value.some((value: any) => {
  //     return value === true;
  //   });
  // }

  addressComplete() {
    this.commonErrorDialogHeader = 'Confirm Address?';
    this.commonErrorDescription = 'Please ensure all details of the address are correct.';
    this.activeDialogRef = this.dialogService.open(this.addressDialog, {
      restoreFocus: false
    });
  }

  yesCloseEmitter() {
    this.activeDialogRef.close();
    this.geoCode = false;
    this.checkAgreedValue();
    smoothScroll(this.main);
  }

  closeEmitter() {
    this.activeDialogRef.close();
    this.geoCode = true;
  }

  validateYearOfConstrution(control: AbstractControl): ValidationErrors | null {
    if (control.value === null || control.value === '')
      return { type: "required", message: 'Please enter the year of construction. ' };
    const currentY = new Date().getFullYear();

    return control.value > currentY || control.value < 1600
      ? { type: 'invalidYear', message: 'Please enter a valid year. ' }
      : null;
  }
}