import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormService } from '@services/form.service';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { QuotationSummaryService } from '../../services/quotation-summary.service';
import { HEADER, LOGO, SUBHEADER } from '../../constants/motor-online-constants';
import { Store } from '@ngxs/store';
import { NoScrollService } from '@services/noScroll.service';
import { GeneralServiceSelect } from 'module/store/general.service.select';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;

  @ViewChild('stepper') stepper: any;
  @ViewChild('paymentDialogModal') paymentDialogModalRef: any;

  /*---- Params ----*/
  activePartner: any;

  /*---- Form ----*/
  agreedPolicyForm: UntypedFormGroup = new UntypedFormGroup({
    policyAgreed: new UntypedFormControl(false, Validators.requiredTrue),
  });

  /*---- Data ----*/
  motorComprehensiveFormValue: any;
  quoteFormValue: any;
  coverageFormValue: any;
  vehicleDetailsFormValue: any;
  policyHolderDetailsFormValue: any;
  ehailingDriverFormValue: any;
  additionalDriversFormValue: any;
  summaries: any;
  premiumPayable!: number;
  userInput$: any;
  gender: any;
  nationality: any;
  idType: any;
  vehicleVariant: any;
  paymentOptionsTNG = false;
  paymentData: any
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private formService: FormService,
    private quotationSummaryService: QuotationSummaryService,
    private _store: Store,
    private noScrollService: NoScrollService,
    private generalServiceSelect: GeneralServiceSelect
  ) {
    this.userInput$ = this._store.selectSnapshot((state) => state.UserInputState.userInput);
  }

  ngOnInit(): void {
    //Get form value
    var sourceSystem = this._store.selectSnapshot(
      (state) => state.GeneralState.sourceSystem
    )

    if (sourceSystem == "HSBCBN") {
      this.paymentOptionsTNG = false;
    }
    this.motorComprehensiveFormValue = this.formService.getForms();
    this.quoteFormValue = this.motorComprehensiveFormValue.quoteForm;
    this.coverageFormValue = this.motorComprehensiveFormValue.coverageForm;
    this.vehicleDetailsFormValue = this.motorComprehensiveFormValue.vehicleOwnerDetailsForm.vehicleDetails;
    this.policyHolderDetailsFormValue = this.motorComprehensiveFormValue.policyholderForm.policyholder;
    this.ehailingDriverFormValue = this.motorComprehensiveFormValue.policyholderForm.ehailingDriver;
    this.additionalDriversFormValue = this.motorComprehensiveFormValue.policyholderForm.additionalDriver;
    this.summaries = this.quotationSummaryService.fetchSummary();
    var excessAmount = this._store.selectSnapshot((state) => state.quote?.premium?.excessAmount)
    this.summaries.purchaseNote = `*Excess of RM ${excessAmount ? excessAmount : 0} is applicable.`
    var selectedPackageCode = this._store.selectSnapshot((state) => state.QuoteProgessState.quote.selectedPackageCode)
    var mainFlowType = this._store.selectSnapshot((state) => state.GeneralState.flowType);
    var flowSelected = this._store.selectSnapshot((state) => state.UserInputState?.userInput?.selected);
    if (selectedPackageCode && flowSelected == 'direct' && mainFlowType == 'DIRECT') {
      this.summaries.additionalPartnerPurchaseNote = "";
    }


    var vehicleDetails$ = this._store.selectSnapshot((state) => state.QuoteProgessState.vehicleDetails);

    this.vehicleVariant = vehicleDetails$.nvicList.find((val: any) => (
      val.nvic == this.vehicleDetailsFormValue.comDetails.comCarType
    ));

    this.policyHolderDetailsFormValue.idType = this.generalServiceSelect.selectLovDescription('CUSTIDTYPE', this.policyHolderDetailsFormValue.idType);
    this.policyHolderDetailsFormValue.gender = this.generalServiceSelect.selectLovDescription('GENDER', this.policyHolderDetailsFormValue.gender);
    this.policyHolderDetailsFormValue.nationality = this.generalServiceSelect.selectLovDescription('NATIONALITY', this.policyHolderDetailsFormValue.nationality);
    if (this.ehailingDriverFormValue.idType !== null) {
      this.ehailingDriverFormValue.idType = this.generalServiceSelect.selectLovDescription('CUSTIDTYPE', this.ehailingDriverFormValue.idType);
    }
    if (this.additionalDriversFormValue.driver1.idType !== null) {
      this.additionalDriversFormValue.driver1.idType = this.generalServiceSelect.selectLovDescription('CUSTIDTYPE', this.additionalDriversFormValue.driver1.idType);
    }
    if (this.additionalDriversFormValue.driver2.idType !== null) {
      this.additionalDriversFormValue.driver2.idType = this.generalServiceSelect.selectLovDescription('CUSTIDTYPE', this.additionalDriversFormValue.driver2.idType);
    }
    var customViewObj = this._store.selectSnapshot((state) => state.GeneralState.customViewObj);

    if (customViewObj.utm_source != undefined) {
      this.activePartner = true;
    }
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).completed = true;
    this.stepper.steps.get(4).select();
    this.changeDetectorRef.detectChanges();
  }

  // Get
  get phoneNumber(): string {
    return this.policyHolderDetailsFormValue.phonePrefix + "-" + this.policyHolderDetailsFormValue.phoneNo;
  }

  get mailingAddress(): string {
    let address: string = '';
    let addressKey = ['line1', 'line2', 'line3', 'postcode', 'city', 'state'];

    Object.keys(this.policyHolderDetailsFormValue.address).forEach((key: any) => {
      if (
        addressKey.indexOf(key) !== -1 &&
        this.policyHolderDetailsFormValue.address[key] &&
        this.policyHolderDetailsFormValue.address[key].length
      ) {
        address += this.policyHolderDetailsFormValue.address[key];
        key === 'addressLine1' || key === 'postcode' ? (address += ', ') : (address += ' <br/>');
      }
    });

    return address;
  }

  // Function
  openPaymentDialog(): void {
    var quoteProgressState = this._store.selectSnapshot((state => state.QuoteProgessState));
    var generalState = this._store.selectSnapshot((state => state.GeneralState));
    var step4 = this._store.selectSnapshot((state) => state.UserInputState.userInput.step4);

    let quoteRequest = JSON.parse(JSON.stringify(quoteProgressState.quoteProgress.Result));

    var data = {
      quotationNumber: quoteProgressState.vehicleDetails.contractNumber,
      productCode: quoteProgressState?.quoteProgress?.Result?.ProductCategory,
      callBackUrl: quoteProgressState?.quoteProgress?.Result?.ProductCategory,
      productName: HEADER,
      premiumDueRounded: quoteProgressState?.quote?.premium?.premiumDueRounded.toFixed(2),
      fullName: step4?.policyholder.fullname,
      email: step4?.policyholder.email,
      mobileNo: step4?.policyholder.phonePrefix.replace('+', '') + step4?.policyholder.phoneNo,
      quoteRequest: quoteRequest,
      voucherCode: generalState?.productConfig?.voucherCode,
      paymentMethod: generalState.sourceSystem === 'HSBCBN' ? 'CC' : 'ALL'

    }

    this.paymentDialogModalRef.openDialog(data);
  }

  paymentDialogModalClose() {
    this.noScrollService.pageScroll$.next(true);
  }
}
