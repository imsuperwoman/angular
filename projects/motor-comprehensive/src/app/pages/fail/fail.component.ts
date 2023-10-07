import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HEADER, LOGO, SUBHEADER } from '../../constants/motor-online-constants';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fail',
  templateUrl: './fail.component.html',
  styleUrls: ['./fail.component.scss']
})
export class FailComponent implements OnInit {

  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;
  imageFolder: string = 'assets/images/ui/';
  @ViewChild('stepper') stepper: any;

  // Data
  quotationSummaryData: any;
  payResParamDesc: any;
  paymentResult: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _store: Store,
    private router: Router,
  ) {
    this.paymentResult = this._store.selectSnapshot((state) => state.QuoteProgessState.paymentResult);

    if (this.paymentResult?.QuotationProgress === 'PAYMENTSUCCESS') {
      this.router.navigate(['/success'], { queryParamsHandling: 'preserve' });
    }
    this.quotationSummaryData = {
      premiumPayable: this.paymentResult.PremiumDueRounded,
      paymentSummary: [
        { label: "Product", value: HEADER },
        { label: "Period of insurance", value: moment(this.paymentResult.EffectiveDate).format('DD/MM/YYYY') + " to " + moment(this.paymentResult.ExpiryDate).format('DD/MM/YYYY') },
        { label: "Vehicle registration no.", value: this.paymentResult.Risk.RiskGrp[0].RiskVeh.VehicleNo },
        { label: "Full name", value: this.paymentResult.ClientName },
        { label: "Mobile no.", value: this.formatMobileNumber(this.paymentResult.MobileNumber) },
        { label: "Email address", value: this.paymentResult.EmailAddress }]
    }
  }

  formatMobileNumber(mobile: string) {
    return mobile.toString().substring(0, 4) + '-' + mobile.toString().substr(4);
  }

  ngOnInit(): void {
    this.getLocalStorage();
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).completed = true;
    this.stepper.steps.get(4).select();
    this.changeDetectorRef.detectChanges();
  }

  getLocalStorage() {
    var errorDesc = localStorage.getItem('errorDesc');
    if (errorDesc != 'undefined') {
      var str = errorDesc?.toString() ? errorDesc?.toString() : '';
      this.payResParamDesc = str.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
    }
  }
}
