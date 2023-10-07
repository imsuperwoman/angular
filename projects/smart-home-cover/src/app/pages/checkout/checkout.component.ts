import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { ChangeDetectorRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { Select, Store } from '@ngxs/store';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { QuoteProgessState, UserInputState } from '../../store/states';
import { SHC } from '../../constants/shc-constants';
import { GeneralSelectors } from 'module/store/general.selectors';
import { BUILDING_AGE, COMBINE_NAME_DETAILS, CUSTOMER_DETAILS, FINANCIAL_INTEREST_DETAILS, PROPERTY_DETAILS } from '../../constants/property-details-constants';
import { FormService } from '@services/form.service';
import { environment } from 'environments/environment';
import { GeneralServiceSelect } from 'module/store/general.service.select';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('paymentDialogModal') paymentDialogModalRef: any;
  @ViewChild('paymentRazerDialogModal') paymentRazerDialogModalRef: any;

  /*---- From Store ----*/
  @Select(QuoteProgessState.planRecommendation) planRecommendation$: any;
  @Select(QuoteProgessState.quoteNumber) quoteNumber$: any;
  @Select(GeneralSelectors.selectLov('NATIONALITY')) nationality$: any;
  @Select(GeneralSelectors.selectLov('COMBROLE')) combrole$: any;
  @Select(GeneralSelectors.selectLov('FINANCIALTYPE')) financialTypes$: any;
  @Select(GeneralSelectors.selectLov('BANKCODE')) bankCodes$: any;
  premium$: Observable<any>;

  @Select(UserInputState.coverageType) coverageType$: any;

  @ViewChild('stepper') stepper: any;
  imageFolder: string = IMAGE_FOLDER;
  renewal$: any;
  step3Data$: any;
  financialInterestDetails = FINANCIAL_INTEREST_DETAILS;
  combineNamesDetails: any = [];
  productName = SHC
  privacylink: any = '';
  country: string = 'MALAYSIA';
  propertyDetails = PROPERTY_DETAILS;
  customerDetails = CUSTOMER_DETAILS;

  /*---- Controls ----*/
  smartHomeCoverForm: FormGroup = new FormGroup({});
  policySummaryPaymentForm!: FormGroup;

  /*--  Modal Dialog --*/
  activeDialogRef!: NxModalRef<any>;

  /*-- Payment Status --*/
  paymentStatus: any = undefined;

  updatedPolicyDataSubscription: Subscription | undefined;
  isDisplayCaptcha = true;
  recaptchaEnabled$: any;
  recaptchaKey: any;

  constructor(
    private _store: Store,
    public formService: FormService,
    public dialogService: NxDialogService,
    private changeDetectorRef: ChangeDetectorRef,
    private generalServiceSelect: GeneralServiceSelect
  ) {
    this.premium$ = this._store.select((state) => state.QuoteProgessState.planRecommendation.planRecommendation.premium);
    if (window.location.hostname == 'localhost') {
      this.recaptchaEnabled$ = 'N'
      this.recaptchaKey = environment.recaptcha.siteKey;
    } else {
      this.recaptchaEnabled$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) ? this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) : 'Y';
      this.recaptchaKey = environment.recaptcha.siteKey;
    }
  }

  ngOnInit() {

    this.renewal$ = this._store.selectSnapshot((state) => state.UserInputState.renewal);
    this.step3Data$ = this._store.selectSnapshot(state => state.UserInputState.userInput.step3);
    var step1Data$ = this._store.selectSnapshot(state => state.UserInputState.userInput.step1);
    var footerMenuData$ = this._store.selectSnapshot(state => state.GeneralState?.footerMenuData);
    var returnlink = footerMenuData$.find((item: any) => item.label == 'Privacy Statement')
    this.privacylink = returnlink?.queryParams

    const formValues = this.formService.getForms();
    if (!formValues) return;

    Object.keys(formValues).forEach((formValue: any) => {
      let formGroup = this.formService.generateControls(formValues[formValue]);
      this.smartHomeCoverForm.addControl(formValue, formGroup);
    });

    this.policySummaryPaymentForm = this.smartHomeCoverForm.get('policySummaryPaymentForm') as FormGroup;

    if (this.recaptchaEnabled$ == 'N') {
      this.policySummaryPaymentForm.get('recaptcha')?.clearValidators();
    } else {
      this.policySummaryPaymentForm.get('recaptcha')?.setValidators(Validators.required);
    }
    this.policySummaryPaymentForm.get('policyAgreed')?.setValidators(Validators.requiredTrue);

    var propertyDetails = this.step3Data$.propertyDetails;
    var periodDate = `${moment(propertyDetails.startDate).format('DD/MM/YYYY')} - ${moment(propertyDetails.endDate).format('DD/MM/YYYY')}`;

    /** Property details data */
    this.propertyDetails[0].value = periodDate;

    if (step1Data$.PropertyType === 'NL') {
      this.propertyDetails[1].label = 'Building storey'
      this.propertyDetails[1].value = this.generalServiceSelect.selectLovDescription('BUILDSTOREYCODENL', step1Data$.BuildingStorey);
    } else if (step1Data$.PropertyType === 'LD') {
      this.propertyDetails[1].label = 'Building storey'
      this.propertyDetails[1].value = 'Landed, ' + this.generalServiceSelect.selectLovDescription('BUILDSTOREYCODE', step1Data$.BuildingStorey);
    }

    if (step1Data$.ageOfBuilding != '') {
      this.propertyDetails[2].label = 'Age of the building'
      this.propertyDetails[2].value = BUILDING_AGE.find((item: any) => item.value == step1Data$.ageOfBuilding).label
    } else {
      this.propertyDetails[2].label = 'Year of construction'
      this.propertyDetails[2].value = step1Data$.yearOfConstruction
    }
    var propertyDetailsAdd: any[] = [];

    if (step1Data$.address.addressnumber !== '') {
      propertyDetailsAdd = [
        `<img src="assets/images/ui/banner/location.svg" alt="Textual description of productImage" />${step1Data$.address.addressnumber}`,
        step1Data$.address.address1 == '' ? '' : step1Data$.address.address1,
        step1Data$.address.address2 == '' ? '' : step1Data$.address.address2,
        step1Data$.address.address3 == '' ? '' : step1Data$.address.address3,
        step1Data$.address.postCode,
        step1Data$.address.city,
        step1Data$.address.state,
        this.country
      ];
    } else {
      propertyDetailsAdd = [
        `<img src="assets/images/ui/banner/location.svg" alt="Textual description of productImage" />${step1Data$.address.address1}`,
        step1Data$.address.address2 == '' ? '' : step1Data$.address.address2,
        step1Data$.address.address3 == '' ? '' : step1Data$.address.address3,
        step1Data$.address.postCode,
        step1Data$.address.city,
        step1Data$.address.state,
        this.country
      ];
    }

    this.propertyDetails[3].value = propertyDetailsAdd.filter((element: any): element is string => {
      return element !== '';
    }).join('\n')

    /** Customer deatils data */
    this.customerDetails[0].value = this.step3Data$.customerDetails.fullName;
    this.customerDetails[1].label = this.generalServiceSelect.selectLovDescription('CUSTIDTYPE', this.step3Data$.customerDetails.idType);
    this.customerDetails[1].value = this.step3Data$.customerDetails.idNo;

    this.customerDetails[2].value = moment(this.step3Data$.customerDetails.dob).format('DD/MM/YYYY');
    this.customerDetails[3].value = this.generalServiceSelect.selectLovDescription('GENDER', this.step3Data$.customerDetails.gender);

    this.customerDetails[4].value = this.generalServiceSelect.selectLovDescription('NATIONALITY', this.step3Data$.customerDetails.nationality);
    this.customerDetails[5].value = this.step3Data$.customerDetails.phoneCountryCode + "-" + this.step3Data$.customerDetails.phoneNo;
    this.customerDetails[6].value = this.step3Data$.customerDetails.email;
    var customerDetailsAdd: any[] = [];

    if (this.step3Data$.customerDetails) {
      if (this.step3Data$.customerDetails.addressnumber !== '') {
        customerDetailsAdd = [
          `<img src="assets/images/ui/banner/location.svg" alt="Textual description of productImage" />${this.step3Data$.customerDetails.addressnumber}`,
          this.step3Data$.customerDetails.address1 == '' ? '' : this.step3Data$.customerDetails.address1,
          this.step3Data$.customerDetails.address2 == '' ? '' : this.step3Data$.customerDetails.address2,
          this.step3Data$.customerDetails.address3 == '' ? '' : this.step3Data$.customerDetails.address3,
          this.step3Data$.customerDetails.postCode,
          this.step3Data$.customerDetails.city,
          this.step3Data$.customerDetails.state,
          this.country
        ];
      } else {
        customerDetailsAdd = [
          `<img src="assets/images/ui/banner/location.svg" alt="Textual description of productImage" />${this.step3Data$.customerDetails.address1}`,
          this.step3Data$.customerDetails.address2 == '' ? '' : this.step3Data$.customerDetails.address2,
          this.step3Data$.customerDetails.address3 == '' ? '' : this.step3Data$.customerDetails.address3,
          this.step3Data$.customerDetails.postCode,
          this.step3Data$.customerDetails.city,
          this.step3Data$.customerDetails.state,
          this.country
        ];
      }
    }

    this.customerDetails[7].value = customerDetailsAdd.filter((element: any): element is string => {
      return element !== '';
    }).join('\n')

    /** Combine names data */
    if (this.step3Data$.jointNames.length > 0) {
      this.assignCombineNamesData(this.step3Data$.jointNames);
    }

    /** Financial interest data */
    if (this.step3Data$?.mortgage !== undefined) {
      this.assignFinancialInterestData(this.step3Data$.mortgage);
    }
  }

  ngOnDestroy() {
    this.updatedPolicyDataSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectorRef.detectChanges();
  }

  openPaymentDialog(size?: string): void {
    const planRecommendation = this._store.selectSnapshot(
      (state) => state.QuoteProgessState.planRecommendation
    );
    const quotationNumber = planRecommendation.planRecommendation.contract.contractNumber;
    const premiumDueRounded = planRecommendation.planRecommendation.premium.premiumDueRounded
    var quoteProgress = this._store.selectSnapshot(
      (state) => state.QuoteProgessState.quoteProgress.quoteRequest
    )
    const productConfig = this._store.selectSnapshot((item) => item.GeneralState.productConfig);

    let quoteRequest = JSON.parse(JSON.stringify(quoteProgress));
    var data = {
      quotationNumber: quotationNumber,
      productCode: 'SHC',
      callBackUrl: 'SHC',
      productName: this.productName,
      premiumDueRounded: premiumDueRounded.toFixed(2),
      fullName: this.step3Data$.customerDetails.fullName,
      email: this.step3Data$.customerDetails.email,
      mobileNo: this.step3Data$.customerDetails.phoneCountryCode.replace('+', '') + this.step3Data$.customerDetails.phoneNo,
      quoteRequest: quoteRequest,
      voucherCode: productConfig.voucherCode
    }

    this.paymentDialogModalRef.openDialog(data);
    //this.paymentRazerDialogModalRef.openDialog(data);
  }

  clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  assignFinancialInterestData(data: any) {
    this.financialInterestDetails[0].value = data.financialInterestName == 'other' ? data.financialInterestText :
      this.generalServiceSelect.selectLovDescription('BANKCODE', data.financialInterestName);
    this.financialInterestDetails[1].value = data.loanReferenceNo;
    this.financialInterestDetails[2].value = data.banksEmail;
  };

  assignCombineNamesData(datas: any) {
    this.combineNamesDetails = [];

    let combineData: any = [];

    //NOTE: Method is called deep cloning
    for (var y = 0; y < datas.length; y++) {
      combineData.push(COMBINE_NAME_DETAILS)
      let dataClone = this.clone(combineData[y]);
      dataClone[0].value = datas[y].fullName;
      dataClone[1].label = this.generalServiceSelect.selectLovDescription('CUSTIDTYPE', datas[y].idType);
      dataClone[1].value = datas[y].idNo;
      dataClone[2].value = this.generalServiceSelect.selectLovDescription('COMBROLE', datas[y].role) ? this.generalServiceSelect.selectLovDescription('COMBROLE', datas[y].role) : '';
      dataClone[3].value = this.generalServiceSelect.selectLovDescription('NATIONALITY', datas[y].nationality);
      combineData[y] = dataClone
    }

    this.combineNamesDetails = combineData;
  }
}
