import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { APP_BASE_CONFIG, BASE_CONFIG } from '@services/interceptors/auth-token.interceptor';
import { GeneralService } from 'module/store/general.service';
import { Store } from '@ngxs/store';
import { environment as env } from 'environments/environment';
import { NoopScrollStrategy } from '@angular/cdk/overlay';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';

@Component({
  selector: 'payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.scss'],
})
export class PaymentDialogComponent implements OnInit {

  @Input('paymentOptionsTNG') paymentOptionsTNG: boolean = false;
  @Input('paymentOptionsCard') paymentOptionsCard: boolean = false;
  @Input('paymentLoading') paymentLoading: boolean = false;

  @Input('returnUrl') returnUrl: string = 'customer-details';
  @Input('alignType') alignType: string = '1';
  @Output('closeEmitter') closeEmitter: EventEmitter<any> = new EventEmitter();
  @Output('submitPaymentEmitter') submitPaymentEmitter: EventEmitter<any> = new EventEmitter();

  /*--  Modal Dialog --*/
  nxModalRef!: NxModalRef<any>;
  @ViewChild('proceedWithPaymentDialog') paymentDialog: any;

  imageFolder: string = IMAGE_FOLDER;

  selectedPaymentOption: string = '';
  submissionFormId: any;
  euCheckbox = false;
  paymentButton = true;
  customViewObj: any;
  paymentData: any;

  payload = {
    merchantcode: '',
    submissionNo: '',
    totalamountIpay88: '',
    signature: '',
    responseURL: '',
    backendURL: '',
  };

  constructor(private router: Router, private nxDialogService: NxDialogService,
    @Inject(BASE_CONFIG) public baseConfig: APP_BASE_CONFIG,
    public generalService: GeneralService,
    private _store: Store,
    public spinnerOverlayService: SpinnerOverlayService,
  ) {
    this.baseConfig = baseConfig;
  }

  ngOnInit(): void {
  }

  setPaymentURL() {
    const { backendURL, responseURL } = this.getPaymentURL();
    this.payload.backendURL = backendURL;
    this.payload.responseURL = responseURL;
  }

  getPaymentURL() {
    this.generalService.checkingOut = true;
    let backendURL = `${this.baseConfig.API_URL}v1/openapi/payment/status?productCode=${this.paymentData?.callBackUrl}`;
    let responseURL = `${this.baseConfig.API_URL}v1/openapi/payment/response?productCode=${this.paymentData?.callBackUrl}`;

    let source_system_cat = this._store.selectSnapshot(
      (state) => state.GeneralState.productConfig.SourceSystemCat
    )

    this.customViewObj = this._store.selectSnapshot(
      (state) => state.GeneralState.customViewObj
    )

    if (this.customViewObj !== undefined && this.customViewObj !== null) {
      if (this.customViewObj.utm_source !== undefined) {
        backendURL += '&utm_source=' + this.customViewObj.utm_source;
        responseURL += '&utm_source=' + this.customViewObj.utm_source;
      }
      if (this.customViewObj.utm_medium !== undefined) {
        backendURL += '&utm_medium=' + this.customViewObj.utm_medium;
        responseURL += '&utm_medium=' + this.customViewObj.utm_medium;
      }
      if (this.customViewObj.utm_campaign !== undefined) {
        backendURL += '&utm_campaign=' + this.customViewObj.utm_campaign;
        responseURL += '&utm_campaign=' + this.customViewObj.utm_campaign;
      }
      if (this.customViewObj.bundle !== undefined) {
        backendURL += '&bundle=' + this.customViewObj.bundle;
        responseURL += '&bundle=' + this.customViewObj.bundle;
      }
      if (this.customViewObj.p_channel !== undefined) {
        backendURL += '&p_channel=' + this.customViewObj.p_channel;
        responseURL += '&p_channel=' + this.customViewObj.p_channel;
      }

    }
    if (source_system_cat !== undefined) {
      backendURL += '&p_srcsyscat=' + source_system_cat;
      responseURL += '&p_srcsyscat=' + source_system_cat;
    }

    return {
      backendURL,
      responseURL,
    };
  }

  onClickeU(event: any) {
    if (event) {
      const isChecked = event.srcElement.checked;
      this.euCheckbox = isChecked;
      this.updateServiceQuote();
    }
  }

  updateServiceQuote() {
    this.spinnerOverlayService.showLoadOverlay();

    this.paymentData.quoteRequest['IsEuEea'] = this.euCheckbox ? 'N' : '';
    this.generalService.getQuoteProgress(this.paymentData.quoteRequest, this.paymentData.productCode.toLowerCase()).subscribe(
      (data: any) => {
        this.enableSubmitPayment();
      });

    this.spinnerOverlayService.hideLoadOverlay();
  }

  enableSubmitPayment() {
    if (this.customViewObj.utm_source === 'SCOL' && !this.euCheckbox) {
      this.paymentButton = true;
    } else {
      this.paymentButton = false;
    }
  }

  closePaymentDialog(url: string): void {
    this.nxModalRef.close();
    this.closeEmitter.emit();
    this.router.navigate([`/${url}`], { queryParamsHandling: 'preserve' });
  }

  openDialog(data: any): void {
    this.paymentData = data;

    console.log(this.paymentData)
    if (this.paymentData?.paymentMethod) {
      if (this.paymentData?.paymentMethod == 'CC') {
        this.paymentOptionsCard = true;
        this.paymentOptionsTNG = false;
      } else if (this.paymentData?.paymentMethod == 'ALL') {
        this.paymentOptionsCard = true;
        this.paymentOptionsTNG = true;
      }
    } else {
      this.paymentOptionsCard = true;
      this.paymentOptionsTNG = true;
    }

    this.nxModalRef = this.nxDialogService.open(this.paymentDialog, {
      showCloseIcon: true,
      panelClass: 'mobile-modal-full-screen--',
      scrollStrategy: new NoopScrollStrategy(),
    });
    this.setPaymentURL();
    this.enableSubmitPayment();
  }

  submitPayment(paymentOption: string) {
    this.submitPaymentEmitter.emit();
    if (!this.paymentLoading) {
      this.selectedPaymentOption = paymentOption;
      this.submissionFormId = <HTMLFormElement>document.getElementById('ePayment');
      this.generateSubmissionNumber();
    }
  }

  showLoading() {
    this.spinnerOverlayService.showLoadOverlay();
    this.paymentButton = true;
  }

  generateSubmissionNumber() {
    const payload = {
      QuotationNumber: this.paymentData.quotationNumber,
      ProductCategory: this.paymentData.productCode,
      VoucherCode: this.paymentData.voucherCode ? this.paymentData.voucherCode : ''
    };
    this.generalService.getPaymentSubmission(payload).subscribe(
      (data: any) => {
        const {
          Status,
          Result: { PremiumDueRounded, SubmissionNumber, Guid },
        } = data;
        if (Status === 'Success') {
          this.payload.totalamountIpay88 = this.formatTotalAmount(PremiumDueRounded);
          this.payload.submissionNo = SubmissionNumber;
          this.generateSignature(Guid);
        }
      })
  }

  generateSignature(guid: any) {
    this.generalService.getSignature({ Guid: guid, FixPaymentId: this.selectedPaymentOption }).subscribe(
      (data: any) => {
        if (data.Status == 'Success') {
          this.payload.merchantcode = data.Result.MerchantCode;
          this.payload.signature = data.Result.Signature;
          if (this.payload.signature && this.payload.submissionNo) {
            setTimeout(() => {
              this.submissionFormId.submit();
            }, 500);
          }
        }
      }
    );
  }

  formatTotalAmount(amount: any) {
    let _amount = amount;
    let totalamountIpay88 = '';
    if (!env.production) {
      _amount = '1';
    }

    _amount = _amount.replace(',', '');
    const [integer, decimal] = _amount.split('.');

    if (!decimal) {
      totalamountIpay88 = `${integer}.00`;
    } else if (decimal.length === 2) {
      totalamountIpay88 = _amount;
    } else if (decimal.length === 1) {
      totalamountIpay88 = `${integer}.${decimal}0`;
    } else {
      const twoChar = decimal.substring(0, 2);
      totalamountIpay88 = `${integer}.${twoChar}`;
    }

    return totalamountIpay88;
  }
}
