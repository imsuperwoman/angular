import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { HEADER, LOGO, SUBHEADER } from '../../constants/abs-constants';

@Component({
  selector: 'app-fail',
  templateUrl: './fail.component.html',
  styleUrls: ['./fail.component.scss'],
})
export class FailComponent implements OnInit, AfterViewInit {
  renewal: boolean = false;
  @ViewChild('stepper') stepper: any;
  imageFolder: string = 'assets/images/ui/';

  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;

  /*---- Params ----*/
  activePartner: any;
  payResParamDesc: any;

  /*---- Mock Data ----*/
  paymentDetails: any;

  constructor(
    private changeDetectionRef: ChangeDetectorRef,
    private _store: Store,
    private router: Router,
    private title: Title
  ) {
    this.title.setTitle(localStorage.getItem('header') || '');
  }

  ngOnInit(): void {

    var errorDesc = localStorage.getItem('errorDesc');
    if (errorDesc != 'undefined') {
      var str = errorDesc?.toString() ? errorDesc?.toString() : '';
      this.payResParamDesc = str.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
    }

    var paymentResult = this._store.selectSnapshot((state) => state.QuoteProgessState.paymentResult);

    if (paymentResult?.QuotationProgress === 'PAYMENTSUCCESS') {
      this.router.navigate([localStorage.getItem('path') + '/success'], { queryParamsHandling: 'preserve' });
    }
    this.paymentDetails = {
      status: (paymentResult?.QuotationProgress == 'PAYMENTFAIL') ? 'Payment failed' : 'Payment pending',
      reference: paymentResult?.pymt?.SubmissionNumber,
      error: paymentResult?.pymt?.ErrorDescription,
      summary: {
        ReferenceNo: paymentResult?.pymt?.SubmissionNumber,
        product: HEADER,
        periodOfInsurance: moment(paymentResult.EffectiveDate).format('DD/MM/YYYY') + " to " + moment(paymentResult.ExpiryDate).format('DD/MM/YYYY'),
        plan: paymentResult.Risk.RiskGrp[0].Cover.CoverGrp[0].PlanDesc,
        fullName: paymentResult.ClientName,
        mobileNo: paymentResult.MobileNumber,
        email: paymentResult.EmailAddress,
      },
      totalPremium: paymentResult.FirstPayment,
    };
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectionRef.detectChanges();
  }

  goBack(): void {
    this.router.navigate([localStorage.getItem('path') + '/get-info'],
      { queryParamsHandling: 'preserve' });
  }

  formatMobileNumber(mobile: string) {
    return mobile.toString().substring(0, 4) + '-' + mobile.toString().substr(4);
  }
}
