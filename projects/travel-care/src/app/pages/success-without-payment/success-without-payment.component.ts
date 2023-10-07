import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DEFAULTS_HEADER } from 'module/store/general.model';
import { GeneralService } from '../../services/general.service';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { TRGRPCODE } from '../../constants/content.static-data';

@Component({
  selector: 'success-without-payment',
  templateUrl: './success-without-payment.component.html',
  styleUrls: ['./success-without-payment.component.scss']
})
export class SuccessWithoutPayment implements OnInit {

  LOGO: any;
  HEADER: any;
  SUBHEADER: any;
  imageFolder: string = 'assets/images/ui/';
  @ViewChild('stepper') stepper: any;

  quotationSummaryData: any;
  payResParamDesc: any;
  paymentResult: any;
  message1: any;
  message2: any;
  tel = DEFAULTS_HEADER.Header.tel;
  isSCB = false;

  mayContact = {
    anyEnquiry: 'Should you have any enquiries after this purchase, or need a printed copy your policy, ',
    allianzOnline: 'you can contact the Allianz Contact Center at ',
    allianzStandardCharteredOnline: 'you can contact the Allianz Standard Chartered Contact Center at ',
  }

  constructor(private changeDetectionRef: ChangeDetectorRef,
    private _store: Store,
    public generalService: GeneralService) {
    this.LOGO = generalService.getConfig().LOGO;
    this.HEADER = generalService.getConfig().HEADER;
    this.SUBHEADER = generalService.getConfig().SUBHEADER;

    var Result = this._store.selectSnapshot((state) => state.QuoteProgessState.journeyTravellerDetails.quoteProgress.Result);
    var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);

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
      premiumPayable: 0,
      quotationNumber: Result.QuotationNumber,
      paymentSummary: [
        { label: "Product", value: this.HEADER },
        { label: "Period of insurance", value: moment(Result.EffectiveDate).format('DD/MM/YYYY') + " to " + moment(Result.ExpiryDate).format('DD/MM/YYYY') },
        { label: "Plan", value: TRGRPCODE[Result.TravelWith] },
        { label: "Full name", value: Result.ClientName },
        { label: "Mobile no.", value: Result.MobileNumber },
        { label: "Email address", value: Result.EmailAddress }]
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(0).completed = true;
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectionRef.detectChanges();
  }
}
