import { ChangeDetectorRef, Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { GeneralService } from '../../services/general.service';
import {
  ActionCompletion,
  Actions,
  Store,
  ofActionCompleted
} from '@ngxs/store';
import { NOMINEE_DETAILS, TRAVELLER_DETAILS, TRAVEL_DETAILS } from '../../constants/content.static-data';
import * as moment from 'moment';
import { QuotationSummaryService } from '../../services/quotation-summary.service';
import { GeneralServiceSelect } from 'module/store/general.service.select';
import { RESET_SET_STEP_4, SET_STEP_4 } from '../../store/actions/user-input.action';
import { PROMO_PLAN_RECOMMENDATION, QUOTE_PROGRESS, QUOTE_PROGRESS_CHECKOUT, RESET_PROMO_PLAN_RECOMMENDATION } from '../../store/actions/quote-progress.action';
import { NoScrollService } from '@services/noScroll.service';
import { FormService } from '@services/form.service';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { QuoteProgessService } from '../../services/quote-progress.service';
import { environment } from 'environments/environment';
import { ServerTimeoutDialogComponent } from 'module/server-timeout-dialog/server-timeout-dialog.component';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  LOGO: any;
  HEADER: any;
  SUBHEADER: any;
  isMobile!: boolean;

  @ViewChild('stepper') stepper: any;
  @ViewChild('paymentDialogModal') paymentDialogModal: any;

  summaries: any;
  userInput$: any
  travelDetails = TRAVEL_DETAILS;
  travellerDetails = TRAVELLER_DETAILS;
  travellerTitle: any = []
  nomineeTitle: any = []
  promoResultList: any = []
  purchaseNote = "Note: Upon your successful purchase, you will receive your policy via email.";
  recaptchaEnabled$: any;
  recaptchaKey: any;

  relationshipDropdon = [
    { Description: 'Wife', Code: '02' },
    { Description: 'Husband', Code: '03' },
    { Description: 'Son', Code: '04' },
    { Description: 'Daughter', Code: '05' }
  ];

  /*---- Modal Dialog ----*/
  commonErrorDialogHeader = '';
  commonErrorDescription = '';
  commonErrorIsFail = true;
  promoCheck = false;
  couponApply = false;
  primaryPromoButton = false;
  secondaryPromoButton = false;
  promoButton = 'ELIGIBLE FOR PROMO CODE.<br /> CLICK TO APPLY!'
  submitButton = ' PAY NOW'
  paymentLoading = false
  commonErrorIsCloseIcon = false;

  travelCareForm: UntypedFormGroup = new UntypedFormGroup({});
  checkoutForm!: UntypedFormGroup;
  promoDialogForm!: UntypedFormGroup;
  agreedPolicyForm!: UntypedFormGroup;

  @ViewChild('commonErrorDialog') commonErrorDialog: any;
  @ViewChild('template') templateRef!: TemplateRef<any>;
  templateDialogRef?: NxModalRef<any>;
  activeDialogRef!: NxModalRef<any>;
  applyClick = false

  private ngUnsubscribe = new Subject<void>();

  constructor(private changeDetectionRef: ChangeDetectorRef,
    private readonly dialogService: NxDialogService,
    private _store: Store,
    public formService: FormService,
    private quotationSummaryService: QuotationSummaryService,
    private generalServiceSelect: GeneralServiceSelect,
    public spinnerOverlayService: SpinnerOverlayService,
    private noScrollService: NoScrollService,
    public generalService: GeneralService,
    private router: Router,
    private action$: Actions,
    public quoteProgessService: QuoteProgessService) {
    this.LOGO = generalService.getConfig().LOGO;
    this.HEADER = generalService.getConfig().HEADER;
    this.SUBHEADER = generalService.getConfig().SUBHEADER;



    this.userInput$ = this._store.selectSnapshot((state: any) => state.UserInputState.userInput);
    if (window.location.hostname == 'localhost') {
      this.recaptchaEnabled$ = 'N'
      this.recaptchaKey = environment.recaptcha.siteKey;
    } else {
      this.recaptchaEnabled$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig ?.recaptchaEnabled) ? this._store.selectSnapshot((state) => state.GeneralState.productConfig ?.recaptchaEnabled) : 'Y';
      this.recaptchaKey = environment.recaptcha.siteKey;
    }
  }

  ngOnInit() {

    const formValues = this.formService.getForms();
    if (!formValues) return;
    Object.keys(formValues).forEach((formValue: any) => {
      let formGroup = this.formService.generateControls(formValues[formValue]);
      this.travelCareForm.addControl(formValue, formGroup);
    });

    this.checkoutForm = this.travelCareForm ?.get('checkoutForm') as UntypedFormGroup;
    this.promoDialogForm = this.checkoutForm ?.get('promoDialogForm') as UntypedFormGroup;
    this.agreedPolicyForm = this.checkoutForm ?.get('agreedPolicyForm') as UntypedFormGroup;

    if (this.recaptchaEnabled$ == 'N') {
      this.agreedPolicyForm.get('recaptcha') ?.clearValidators();
    } else {
      this.agreedPolicyForm.get('recaptcha') ?.setValidators(Validators.required);
    }

    this.agreedPolicyForm.get('policyAgreed') ?.setValidators([Validators.requiredTrue]);
    if (this.userInput$.step1.coveragetype != 'AN') {
      this.agreedPolicyForm.removeControl('renew')
    }

    this.getTravelDetails();
    this.getMainPolicyholder();

    if (this.userInput$.step3.travellerArrayForm) {
      this.getTravellerDetails();
    }
    this.getNomineeDetails();
    this.getPromotion();
    this.getQuotationSummaryService();

    // Update form service when there is changes in value
    this.checkoutForm.valueChanges.subscribe(() => {
      this.formService.updateForms(this.travelCareForm);
    });
    this._store.dispatch(new RESET_PROMO_PLAN_RECOMMENDATION());
    this._store.dispatch(new RESET_SET_STEP_4());
  }

  getTravelDetails() {
    this.travelDetails[0].value = coverageType[this.userInput$.step1.coveragetype];
    this.travelDetails[1].value = moment(this.userInput$.step1.startDate).format('DD/MM/YYYY');
    this.travelDetails[2].value = moment(this.userInput$.step1.endDate).format('DD/MM/YYYY');
    this.travelDetails[3].value = "Malaysia";
    this.travelDetails[4].value = destination[this.userInput$.step1.trdestination];
    if (this.userInput$.step3.mountaineeringForm.startDate != '') {
      this.travelDetails[5].value = moment(this.userInput$.step3.mountaineeringForm.startDate).format('DD/MM/YYYY');
      this.travelDetails[6].value = moment(this.userInput$.step3.mountaineeringForm.endDate).format('DD/MM/YYYY');
    } else {
      this.travelDetails[5].label = ''
      this.travelDetails[6].label = ''
    }
  }

  getMainPolicyholder() {
    var traveller = {} as Traveller;
    traveller.travellerDetails = [];
    var travellerDetails = TRAVELLER_DETAILS;
    traveller.title = 'Traveller 1 - Main policyholder (' + this.userInput$.step3.mainPolicyHolder.mainPolicyholderLabel + ")";
    traveller.expand = true;
    travellerDetails[0].value = this.userInput$.step3.mainPolicyHolder.fullname
    travellerDetails[1].value = this.userInput$.step3.mainPolicyHolder.idType
    travellerDetails[2].value = this.userInput$.step3.mainPolicyHolder.idNo
    travellerDetails[3].value = moment(this.userInput$.step3.mainPolicyHolder.dob).format('DD/MM/YYYY');
    travellerDetails[4].value = this.generalServiceSelect.selectLovDescription('GENDER', this.userInput$.step3.mainPolicyHolder.gender)
    travellerDetails[5].value = this.generalServiceSelect.selectLovDescription('NATIONALITY', this.userInput$.step3.mainPolicyHolder.nationality)
    travellerDetails[6].label = ''
    travellerDetails[7].value = this.userInput$.step3.mainPolicyHolder.phonePrefix + this.userInput$.step3.mainPolicyHolder.phoneNo
    //travellerDetails[8].value = this.userInput$.step3.mainPolicyHolder.email
    travellerDetails[8].value =  this.userInput$.step3.mainPolicyHolder.customerEmail,
    travellerDetails[9].value = this.mailingAddress();
    traveller.travellerDetails.push(travellerDetails);
    this.travellerTitle.push(traveller);
  }

  getTravellerDetails() {
    var count = 2;

    var travellerArrayForm = this.userInput$.step3.travellerArrayForm;

    //NOTE: Method is called deep cloning
    travellerArrayForm.forEach((data: any) => {
      var traveller = {} as Traveller;
      traveller.travellerDetails = [];
      traveller.title = 'Traveller ' + count + ' - ' + data.travellerLabel;

      traveller.travellerDetails.push(TRAVELLER_DETAILS)
      let dataClone = this.clone(TRAVELLER_DETAILS);

      dataClone[0].value = data.fullname;
      dataClone[1].value = data.idType;
      dataClone[2].value = data.idNo;
      dataClone[3].value = moment(data.dob).format('DD/MM/YYYY');;
      dataClone[4].value = this.generalServiceSelect.selectLovDescription('GENDER', data.gender);
      dataClone[5].value = this.generalServiceSelect.selectLovDescription('NATIONALITY', data.nationality);
      if (data ?.relationship) {
        dataClone[6].label = 'Relationship';
        this.relationshipDropdon.map(val => {
          if (val.Code == data ?.relationship){
            dataClone[6].value = val.Description;
          }
        })
        // dataClone[6].value = data.relationship;
      } else {
        dataClone[6].label = '';
        dataClone[6].value = '';
      }
      if (data ?.phoneNo) {
        dataClone[7].value = data.phonePrefix + data.phoneNo;
      } else {
        dataClone[7].label = '';
        dataClone[7].value = '';
      }
      if (data ?.email) {
        dataClone[8].value = data.email;
      } else {
        dataClone[8].label = '';
        dataClone[8].value = '';
      }
      dataClone[9].label = '';
      dataClone[9].value = '';
      count++;
      traveller.travellerDetails[0] = dataClone
      this.travellerTitle.push(traveller);
    })
  }

  getNomineeDetails() {
    this.userInput$.step3.nomineeArrayForm.forEach((data: any) => {

      var nominee = {} as Traveller;
      nominee.travellerDetails = [];
      if (data.totalPercentage == 100) {
        nominee.title = 'Traveller ' + data.TravelerSequence + ' - ' + data.parentName;
        //NOTE: Method is called deep cloning
        var count = 1;
        for (var y = 0; y < data.nomineeArrayName.length; y++) {
          if (data.nomineeArrayName[y].fullname != '') {
            nominee.travellerDetails.push(NOMINEE_DETAILS)
            let dataClone = this.clone(nominee.travellerDetails[y]);

            dataClone[0].label = 'Nominee ' + count
            dataClone[1].value = data.nomineeArrayName[y].fullname
            dataClone[2].value = data.nomineeArrayName[y].idType
            dataClone[3].value = data.nomineeArrayName[y].idNo
            dataClone[4].value = this.generalServiceSelect.selectLovDescription('RELATIONSHIP', data.nomineeArrayName[y] ?.relationship);
            dataClone[5].value = this.generalServiceSelect.selectLovDescription('NATIONALITY', data.nomineeArrayName[y].nationality);
            dataClone[6].value = data.nomineeArrayName[y].percentage
            nominee.travellerDetails[y] = dataClone
            count++;
          }
        }
        this.nomineeTitle.push(nominee);
      }
    })
  }

  clone(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }

  mailingAddress(): string {
    let address: string = '';
    let addressKey = ['line1', 'line2', 'line3', 'postcode', 'city', 'state'];

    Object.keys(this.userInput$.step3.mainPolicyHolder.address).forEach((key: any) => {
      if (
        addressKey.indexOf(key) !== -1 &&
        this.userInput$.step3.mainPolicyHolder.address[key] &&
        this.userInput$.step3.mainPolicyHolder.address[key].length
      ) {
        address += this.userInput$.step3.mainPolicyHolder.address[key];
        key === 'addressLine1' || key === 'postcode' ? (address += ', ') : (address += ' <br/>');
      }
    });

    return address;
  }

  getQuotationSummaryService(): void {
    this.quotationSummaryService.getSummary(false).then((data: any) => {
      this.summaries = data;
    });
  }

  getPromotion() {
    var promoList = this._store.selectSnapshot((state: any) => state.QuoteProgessState.promoList.promoList);

    this.promoResultList = promoList.map((arrayElement: any) => {
      if (arrayElement?.policyLevelPromoList) {
        const policyLevelPromoList = arrayElement.policyLevelPromoList.map((arrayPolicyLevel: any) => {
          arrayPolicyLevel = { ...arrayPolicyLevel, isSelected: false };
          return arrayPolicyLevel;
        });
        arrayElement = { ...arrayElement, policyLevelPromoList };
      }

      if (arrayElement?.riskLevelPromoList) {
        const riskLevelPromoList = arrayElement.riskLevelPromoList.map((arrayRiskLevel: any) => {
          arrayRiskLevel = { ...arrayRiskLevel, isSelected: false };
          return arrayRiskLevel;
        });
        arrayElement = { ...arrayElement, riskLevelPromoList };
      }
      return arrayElement;
    });

    if (this.promoResultList.length > 0) {
      this.primaryPromoButton = true
    }
  }

  openFromTemplate(): void {
    this.templateDialogRef = this.dialogService.open(this.templateRef, {
      showCloseIcon: true,
      minHeight: '100vh',
      minWidth: '100vw',
      maxWidth: '100vw',
      disableClose: true
    });
  }

  applyTemplateDialog() {
    var selectedList = this.clone(this.promoResultList)

    var selectedPromoList = [];
    for (let promo of selectedList) {
      var promoList = {} as PromoResult;
      if (promo.policyLevelPromoList) {
        var policyLevel = promo.policyLevelPromoList.filter((item: any) => item.selected === true);
        if (policyLevel.length > 0) {
          promoList.policyLevelPromoList = policyLevel;
          promoList.name = promo.name;
          promoList.travelerSeq = promo.travelerSeq;
        }
      }

      promoList.riskLevelPromoList = [];
      if (promo ?.riskLevelPromoList ?.length > 0) {
        var riskLevel = promo.riskLevelPromoList.filter((item: any) => item.selected === true);
        promoList.riskLevelPromoList = riskLevel;
        promoList.name = promo.name;
        promoList.travelerSeq = promo.travelerSeq;
      }
      selectedPromoList.push(promoList)

    }

    if (selectedPromoList.length > 0) {
      this._store.dispatch(new SET_STEP_4(selectedPromoList));
      this._store.dispatch(new PROMO_PLAN_RECOMMENDATION("PROMOSELECTION", 5)).subscribe((_) => {
        if (_.QuoteProgessState.pomoPlanRecommendation.planRecommendation.errors) {
          var error = JSON.parse(_.QuoteProgessState.pomoPlanRecommendation.planRecommendation.errors);

          const mergedResetArray = this.mergeReset(this.promoResultList);
          this.promoResultList = mergedResetArray;
          const mergedArray = this.mergeArrays(this.promoResultList, error);
          this.promoResultList = mergedArray;

          this.commonErrorDialogHeader = 'Oops! ......';
          this.commonErrorDescription = '';
          this.commonErrorIsFail = true;
          this.commonErrorDialog.open();
          this.promoCheck = true;
          this.couponApply = false;
          this.applyClick = false
        } else {
          this.applyClick = false
          this.couponApply = true;
          this.promoCheck = false;
          const mergedArray = this.mergeReset(this.promoResultList);
          this.promoResultList = mergedArray;

          this.quotationSummaryService.getSummary(true).then((data: any) => {
            this.summaries = data;
          });
          this.commonErrorDialogHeader = '';
          this.commonErrorDescription = 'You have successfully redeemed your voucher! You can close this tab and complete your policy purchase.';
          this.commonErrorIsFail = false;
          this.commonErrorIsCloseIcon = true;
          this.commonErrorDialog.open();
          this.templateDialogRef ?.close();
          this.primaryPromoButton = false;
          this.secondaryPromoButton = true;
          this.promoButton = 'PROMO CODE APPLIED.<br /> CLICK TO AMEND';

          if (_.QuoteProgessState.pomoPlanRecommendation.planRecommendation.premium.premiumDueRounded === 0) {
            this.submitButton = 'SUBMIT'
            if (this.userInput$.step1.coveragetype == 'AN') {
              this.agreedPolicyForm.removeControl('renew')
            }
          } else {
            this.submitButton = 'Pay Now'
            if (this.userInput$.step1.coveragetype == 'AN') {
              this.agreedPolicyForm.addControl('renew', new FormControl(false))
            }
          }
        }
      })
    }
    this.action$
      .pipe(
      ofActionCompleted(PROMO_PLAN_RECOMMENDATION),
      takeUntil(this.ngUnsubscribe)
      )
      .subscribe((data: ActionCompletion) => {
        if (data.result.error) {
          //handle mulitple popup
          if (this.activeDialogRef == undefined) {
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: false },
            });
          }
          // in case timeout again
          else if (this.activeDialogRef.getState() == 2) {
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: false },
            });
          }
        }
      });

  }

  mergeReset(arr1: any) {
    return arr1.map((promo: any) => {
      if (promo.errorRiskLevel) {
        promo.errorRiskLevel = '';
        promo.errorRiskId = '';
        promo.errorRisk = false;
      }

      if (promo.errorPolicyLevel) {
        promo.errorPolicyLevel = '';
        promo.errorPolicyId = '';
        promo.errorPolicy = false;
      }
      return promo;
    })
  }

  mergeArrays(arr1: any, arr2: any) {
    return arr1.map((promo: any) => {
      arr2.forEach((error: any) => {
        let matchingParentPromo: boolean = error.travelerSeq === promo.travelerSeq;
        if (matchingParentPromo) {
          promo.riskLevelPromoList = promo.riskLevelPromoList ?.map((riskPromo: any) => {
            if (riskPromo.promoId === error.promoId) {
              promo.errorRiskLevel = error.errorMessage;
              promo.errorRiskId = riskPromo.promoId;
              promo.errorRisk = true;
            }
            return riskPromo;
          });

          promo.policyLevelPromoList = promo.policyLevelPromoList ?.map((policyPromo: any) => {
            if (policyPromo.promoId === error.promoId) {
              promo.errorPolicyLevel = error.errorMessage;
              promo.errorPolicyId = policyPromo.promoId;
              promo.errorPolicy = true;
            }
            return policyPromo;
          });
        }
      })
      return promo;
    });
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(0).completed = true;
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectionRef.detectChanges();
  }

  promoListSelection(contamulSelected: number) {
    this.promoResultList[0].policyLevelPromoList.forEach((element: any) => {
      if (element.promoId == contamulSelected) {
        element['selected'] = !element['selected'];
        this.promoDialogForm.get('policyLevel') ?.setValue(element['selected']);
      } else if (element.selected) {
        element['selected'] = false;
      }
    });
  }

  riskLevelSelection(contamulSelected: number, child: any) {
    this.promoResultList[child].riskLevelPromoList.forEach((element: any) => {
      if (element.promoId == contamulSelected) {
        element['selected'] = !element['selected'];
        this.promoDialogForm.get('riskLevel') ?.setValue(element['selected']);
      } else if (element.selected) {
        element['selected'] = false;
      }
    });
  }

  // Function
  openPaymentDialog(): void {
    console.log("callBackUrl" + this.generalService.getConfig().CALL_BACK_URL);

    this.spinnerOverlayService.showLoadOverlay();
    this._store.dispatch(new QUOTE_PROGRESS_CHECKOUT('CHECKOUTWTPAYMENT', 6, this.agreedPolicyForm.get('renew') ?.value, this.summaries.premiumPayable.toFixed(2))).subscribe((_) => {
      if (this.submitButton !== 'SUBMIT') {
        var quoteProgressState = this._store.selectSnapshot((state => state.QuoteProgessState));
        var step3 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step3);
        let quoteRequest = JSON.parse(JSON.stringify(quoteProgressState.travellerCheckout));
        var data = {
          quotationNumber: quoteRequest.QuotationNumber,
          callBackUrl: this.generalService.getConfig().CALL_BACK_URL,
          productCode: this.generalService.getConfig().PRODUCT_CAT,
          productName: this.HEADER,
          premiumDueRounded: this.summaries.premiumPayable.toFixed(2),
          fullName: step3 ?.mainPolicyHolder.fullname,
           email: step3 ?.mainPolicyHolder.email,
          customerEmail: step3 ?.mainPolicyHolder.customerEmail,
          mobileNo: step3 ?.mainPolicyHolder.phonePrefix.replace('+', '') + step3 ?.mainPolicyHolder.phoneNo,
          quoteRequest: quoteRequest,
          voucherCode: '',
          paymentMethod: this.agreedPolicyForm.get('renew') ?.value === true ? 'CC' : 'ALL',
        }

        console.log(data);
        this.paymentDialogModal.openDialog(data);
      } else {
        this.claimCouponPlan();
      }
    })
    this.spinnerOverlayService.hideLoadOverlay();
  }

  paymentDialogModalClose() {
    this.noScrollService.pageScroll$.next(true);
  }

  claimCouponPlan() {
    var pomoPlanRecommendation = this._store.selectSnapshot((state => state.QuoteProgessState.pomoPlanRecommendation.planRecommendation));
    const payload = {
      "requestType": "UTIL",
      "contractNo": pomoPlanRecommendation.contract.contractNumber
    };

    this.quoteProgessService.postUtilizePromo(payload).subscribe({
      next: () => {
        if (this.submitButton == 'SUBMIT') {
          this.isZeroAmount()
        }
      }, error: () => {
        this.dialogService.open(ServerTimeoutDialogComponent, {
          showCloseIcon: true,
          data: { refreshPage: true },
        });
      }
    });
  }

  isZeroAmount() {
    var pomoPlanRecommendation = this._store.selectSnapshot((state => state.QuoteProgessState.pomoPlanRecommendation.planRecommendation));
    this.quoteProgessService.postPromoSubmission({
      "contractNumber": pomoPlanRecommendation.contract.contractNumber
    }).subscribe({
      next: (customer: any) => {
        if (customer ?.status === 'SUCCESS') {
          this.router.navigate(['/success-without-payment'], { queryParamsHandling: 'preserve' });
        }
      }, error: () => {
        this.dialogService.open(ServerTimeoutDialogComponent, {
          showCloseIcon: true,
          data: { refreshPage: true },
        });
      }
    });
  }

  submitPaymentEmitter() {
    this.paymentLoading = true;
    if (this.couponApply) {
      this.claimCouponPlan();
    }
  }
}


const coverageType: { [key: string]: null } = {
  AN: <any>"Annual",
  OW: <any>"One Way",
  TW: <any>"Two Way"
};
const destination: { [key: string]: null } = {
  ASI: <any>"Asia",
  DOM: <any>"Domestic",
  WRW1: <any>"Worldwide"
}

export type Traveller = {
  title: string;
  expand?: boolean;
  travellerDetails: any;
}

export type PromoResult = {
  name: string;
  travelerSeq: string;
  policyLevelPromoList: any;
  riskLevelPromoList: any;
}