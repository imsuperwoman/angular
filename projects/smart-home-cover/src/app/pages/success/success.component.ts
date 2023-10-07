import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { RenewalPolicyService } from '../../services/renewal-policy.service';
import { Store } from '@ngxs/store';
import * as moment from 'moment';
import { AZOL, SHC } from '../../constants/shc-constants';
import { DEFAULTS_HEADER } from 'module/store/general.model';
import { Observable } from 'rxjs';
import { hideChatBot } from '@functions/chatBot.function';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
})
export class SuccessComponent implements OnInit, AfterViewInit {
  renewal: boolean = false;
  renewalpolicyData: any;
  selectedPolicy: number = 0;
  isSCB = false;
  message1: any;
  message2: any;
  tel = DEFAULTS_HEADER.Header.tel;
  paymentResult$: Observable<any>;
  product = SHC;

  @ViewChild('stepper') stepper: any;
  imageFolder: string = IMAGE_FOLDER;

  mayContact = {
    anyEnquiry: 'Should you have any enquiries after this purchase, or need a printed copy your policy, ',
    allianzOnline: 'you can contact the Allianz Contact Center at ',
    allianzStandardCharteredOnline: 'you can contact the Allianz Standard Chartered Contact Center at ',
  }

  constructor(
    private _store: Store,
    private changeDetectionRef: ChangeDetectorRef,
    public renewalPolicyService: RenewalPolicyService,
  ) {
    this.paymentResult$ = this._store.select((state) => state.QuoteProgessState.paymentResult);
    var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
    if (sourceSystem === 'SCOL') {
      this.isSCB = true;
    }

    if (this.isSCB) {
      this.message1 = this.mayContact.allianzStandardCharteredOnline;
      this.tel = '1 30088 2277'
    } else if (sourceSystem !== AZOL) {
      this.message1 = this.mayContact.allianzOnline;
      this.message2 = ' or your servicing agent'
    } else {
      this.message1 = this.mayContact.allianzOnline;
      this.message2 = ''
    }
  }

  ngOnInit(): void {
    hideChatBot();
  }

  ngAfterViewInit(): void {
    this.stepper.steps.get(1).completed = true;
    this.stepper.steps.get(2).completed = true;
    this.stepper.steps.get(3).completed = true;
    this.stepper.steps.get(3).select();
    this.changeDetectionRef.detectChanges();
  }

  clearStorageData() {
    window.localStorage.clear();
  }

  /* formatDate */
  formatDate(date: any) {
    return moment(date).format('DD/MM/YYYY');
  }

  formatMobileNumber(mobile: string) {
    return mobile.toString().substring(0, 4) + '-' + mobile.toString().substr(4);
  }
}
