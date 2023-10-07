import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DEFAULTS_HEADER } from 'module/store/general.model';
import { GeneralService } from '../../services/general.service';
import { Store } from '@ngxs/store';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { TRGRPCODE } from '../../constants/content.static-data';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  LOGO: any;
  HEADER: any;
  SUBHEADER: any;
  imageFolder: string = 'assets/images/ui/';
  @ViewChild('stepper') stepper: any;

  quotationSummaryData: any;
  payResParamDesc: any;
  paymentResult: any;
  isSCB = false;
  message1: any;
  message2: any;
  tel = DEFAULTS_HEADER.Header.tel;

  mayContact = {
    anyEnquiry: 'Should you have any enquiries after this purchase, or need a printed copy your policy, ',
    allianzOnline: 'you can contact the Allianz Contact Center at ',
    allianzStandardCharteredOnline: 'you can contact the Allianz Standard Chartered Contact Center at ',
  }

  constructor(private changeDetectionRef: ChangeDetectorRef,
    private _store: Store,
    private router: Router,
    public generalService: GeneralService) {
    this.LOGO = generalService.getConfig().LOGO;
    this.HEADER = generalService.getConfig().HEADER;
    this.SUBHEADER = generalService.getConfig().SUBHEADER;

    this.paymentResult = this._store.selectSnapshot((state) => state.QuoteProgessState.paymentResult);
    var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);

    if (this.paymentResult ?.QuotationProgress !== 'PAYMENTSUCCESS') {
      this.router.navigate(['/fail'], { queryParamsHandling: 'preserve' });
    }
    if (sourceSystem === 'SCOL') {
      this.isSCB = true;
    }

    if (this.isSCB) {
      this.message1 = this.mayContact.allianzStandardCharteredOnline;
      this.tel = '1 30088 2277'
    } else if (sourceSystem !== 'AZOL') {
      this.message1 = this.mayContact.allianzOnline;
      this.message2 = ' or your servicing agent'
    } else {
      this.message1 = this.mayContact.allianzOnline;
      this.message2 = ''
    }

    this.quotationSummaryData = {
      premiumPayable: this.paymentResult.PremiumDueRounded,
      paymentSummary: [
        { label: "Product", value: this.HEADER },
        { label: "Period of insurance", value: moment(this.paymentResult.EffectiveDate).format('DD/MM/YYYY') + " to " + moment(this.paymentResult.ExpiryDate).format('DD/MM/YYYY') },
        { label: "Plan", value: TRGRPCODE[this.paymentResult.TravelWith] },
        { label: "Full name", value: this.paymentResult.ClientName },
        { label: "Mobile no.", value: this.paymentResult.MobileNumber },
        { label: "Email address", value: this.paymentResult.EmailAddress }]
    }
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(0).completed = true;
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectionRef.detectChanges();
  }
}
