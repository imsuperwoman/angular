import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import * as moment from 'moment';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import { TRGRPCODE } from '../../constants/content.static-data';

@Component({
  selector: 'app-fail',
  templateUrl: './fail.component.html',
  styleUrls: ['./fail.component.scss']
})
export class FailComponent implements OnInit {
  LOGO: any;
  HEADER: any;
  SUBHEADER: any;
  imageFolder: string = 'assets/images/ui/';
  @ViewChild('stepper') stepper: any;

  // Data
  quotationSummaryData: any;
  payResParamDesc: any;
  paymentResult: any;

  constructor(private changeDetectionRef: ChangeDetectorRef,
    public generalService: GeneralService,
    private _store: Store,
    private router: Router, ) {
    this.LOGO = generalService.getConfig().LOGO;
    this.HEADER = generalService.getConfig().HEADER;
    this.SUBHEADER = generalService.getConfig().SUBHEADER;

    this.paymentResult = this._store.selectSnapshot((state) => state.QuoteProgessState.paymentResult);

    if (this.paymentResult ?.QuotationProgress === 'PAYMENTSUCCESS') {
      this.router.navigate(['/success'], { queryParamsHandling: 'preserve' });
    }

    this.quotationSummaryData = {
      premiumPayable: this.paymentResult.PremiumDueRounded,
      paymentSummary: [
        { label: "Product", value: this.HEADER },
        { label: "Period of insurance", value: moment(this.paymentResult.EffectiveDate).format('DD/MM/YYYY') + " to " + moment(this.paymentResult.ExpiryDate).format('DD/MM/YYYY') },
        { label: "Plan", value: TRGRPCODE[this.paymentResult.TravelWith] },
        { label: "Full name", value: this.paymentResult.ClientName },
        { label: "Mobile no.", value: this.formatMobileNumber(this.paymentResult.MobileNumber) },
        { label: "Email address", value: this.paymentResult.EmailAddress }]
    }
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(0).completed = true;
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectionRef.detectChanges();
  }


  formatMobileNumber(mobile: string) {
    return mobile.toString().substring(0, 4) + '-' + mobile.toString().substr(4);
  }

  ngOnInit(): void {
    this.getLocalStorage();
  }

  getLocalStorage() {
    var errorDesc = localStorage.getItem('errorDesc');
    if (errorDesc != 'undefined') {
      var str = errorDesc ?.toString() ? errorDesc ?.toString() : '';
      this.payResParamDesc = str.charAt(0).toUpperCase() + str ?.slice(1).toLowerCase();
    }
  }
}


