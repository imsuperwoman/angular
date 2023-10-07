import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { AGREED_POLICY_FORM, COVERAGE_DETAILS, HEADER, LOGO, POLICYHOLDER_DETAILS, PRODUCT_CAT, SUBHEADER } from '../../../constants/abs-constants';
import { QuotationSummaryService } from '../../../services/quotation-summary.service';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { NoScrollService } from '@services/noScroll.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GeneralServiceSelect } from 'module/store/general.service.select';
import { environment } from 'environments/environment';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  @ViewChild('stepper') stepper: any;
  @ViewChild('paymentDialogModal') paymentDialogModalRef: any;

  coverageDetails = COVERAGE_DETAILS;
  policyHolderDetails = POLICYHOLDER_DETAILS;
  summaries: any = [];
  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;
  agreedPolicyForm = AGREED_POLICY_FORM;
  recaptchaEnabled$: any;
  editUrl = localStorage.getItem('path') + '/customer-details'

  paymentOptionsTNG = false;
  paymentOptionsCard = false;
  recaptchaKey: any;


  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private quotationSummaryService: QuotationSummaryService,
    private _store: Store,
    private noScrollService: NoScrollService,
    private router: Router,
    private title: Title,
    private generalServiceSelect: GeneralServiceSelect) {
    this.title.setTitle(HEADER);

    if (window.location.hostname == 'localhost') {
      this.recaptchaEnabled$ = 'Y'
      this.recaptchaKey = environment.recaptcha.siteKey;
    } else {
      this.recaptchaEnabled$ = this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) ? this._store.selectSnapshot((state) => state.GeneralState.productConfig?.recaptchaEnabled) : 'Y';
      this.recaptchaKey = environment.recaptcha.siteKey;
    }
  }

  ngOnInit(): void {
    var step3$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.step3);
    this.summaries = this.quotationSummaryService.fetchSummary();

    this.coverageDetails[0].value = moment(step3$.coverageDetails.effectivedate).format('DD-MM-YYYY');
    this.coverageDetails[1].value = moment(step3$.coverageDetails.expirydate).format('DD-MM-YYYY');
    this.policyHolderDetails[0].value = step3$.policyholderDetails.businessname
    this.policyHolderDetails[1].value =
      this.generalServiceSelect.selectLovDescription('BUSINESSIDTYPE', step3$.policyholderDetails.idType);
    this.policyHolderDetails[2].value = step3$.policyholderDetails.idNo
    this.policyHolderDetails[3].value = step3$.policyholderDetails.mobilePrefixname + step3$.policyholderDetails.phonenumber
    this.policyHolderDetails[4].value = step3$.policyholderDetails.email

    var policyholderAdd = [
      step3$.policyholderDetails.addressnumber,
      step3$.policyholderDetails.buildingname,
      step3$.policyholderDetails.streetname,
      step3$.policyholderDetails.area,
      step3$.policyholderDetails.postcode,
      step3$.policyholderDetails.city,
      step3$.policyholderDetails.state
    ];


    this.policyHolderDetails[5].value = policyholderAdd.filter((element: any): element is string => {
      return element !== '';
    }).join('\n')

    this.policyHolderDetails[6].value =
      this.generalServiceSelect.selectLovDescription('BUSINESSOPERATION', step3$.policyholderDetails.businessoperation);

    if (this.recaptchaEnabled$ == 'N') {
      this.agreedPolicyForm.get('recaptcha')?.clearValidators();
    } else {
      this.agreedPolicyForm.get('recaptcha')?.setValidators(Validators.required);
    }


    var utm_source_paymentMode = this._store.selectSnapshot((state) => state.GeneralState.productConfig?.PaymentMode) ? this._store.selectSnapshot((state) => state.GeneralState.productConfig?.PaymentMode) : '';

    if (utm_source_paymentMode.includes("538")) {
      this.paymentOptionsTNG = true;
    }
    if (utm_source_paymentMode.includes("2")) {
      this.paymentOptionsCard = true;
    }

  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectionRef.detectChanges();
  }

  openPaymentDialog(): void {
    var quoteResult = this._store.selectSnapshot((state => state.QuoteProgessState.quoteResult));
    var step3$ = this._store.selectSnapshot((state) => state.UserInputState.userInput.step3);

    var quoteProgressState = this._store.selectSnapshot((state => state.QuoteProgessState));
    let quoteRequest = JSON.parse(JSON.stringify(quoteProgressState.quoteProgress.Result));

    var data = {
      quotationNumber: quoteResult.contract.contractNumber,
      productCode: PRODUCT_CAT,
      productName: HEADER,
      premiumDueRounded: quoteResult.premium?.premiumDueRounded.toFixed(2),
      fullName: step3$.policyholderDetails.businessname,
      email: step3$.policyholderDetails.email,
      mobileNo: step3$.policyholderDetails.mobilePrefixname.replace('+', '') + step3$.policyholderDetails.phonenumber,
      quoteRequest: quoteRequest
    }

    this.paymentDialogModalRef.openDialog(data);
  }

  paymentDialogModalClose() {
    this.noScrollService.pageScroll$.next(true);
  }

  proceedBack() {
    this.router.navigate([localStorage.getItem('path') + '/customer-details'],
      { queryParamsHandling: 'preserve' }
    );
  }
}
