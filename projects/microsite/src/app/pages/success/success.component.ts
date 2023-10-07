import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HEADER, LOGO, SUBHEADER } from '../../constants/abs-constants';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit, AfterViewInit {
  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;

  /*---- Params ----*/
  activePartner: any;

  @ViewChild('stepper') stepper: any;
  imageFolder: string = 'assets/images/ui/';

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
    var paymentResult = this._store.selectSnapshot((state) => state.QuoteProgessState.paymentResult);

    if (paymentResult?.QuotationProgress !== 'PAYMENTSUCCESS') {
      this.router.navigate(['/fail'], { queryParamsHandling: 'preserve' });
    }

    this.paymentDetails = {
      status: 'Payment Successful',
      reference: paymentResult?.pymt?.SubmissionNumber,
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

  formatMobileNumber(mobile: string) {
    return mobile.toString().substring(0, 4) + '-' + mobile.toString().substr(4);
  }
}
