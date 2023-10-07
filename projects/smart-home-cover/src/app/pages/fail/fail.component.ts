import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionCompletion, Actions, ofActionCompleted, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { LOGO, SHC, SUBHEADER } from '../../constants/shc-constants';
import { GET_QUOTE_INFO } from '../../store/actions/quote-progess.action';
import extractQueryParamsFunctiion from '@functions/extract-query-params.function';
import { IMAGE_FOLDER } from '@constants/header-constants';
import * as moment from 'moment';
import { hideChatBot } from '@functions/chatBot.function';

@Component({
  selector: 'app-fail',
  templateUrl: './fail.component.html',
  styleUrls: ['./fail.component.scss'],
})
export class FailComponent implements OnInit, OnDestroy {

  paymentResult$: Observable<any>;
  productData = {
    product: SHC,
    description: SUBHEADER,
    imageFolder: IMAGE_FOLDER,
    logo: LOGO,
  };
  payResParamDesc: any;

  ngUnsubscribe = new Subject<void>();

  periodOfInsurance: any = {};

  otherConfigs = {
    backToHome: false,
    renewal: false,
  };

  params: any;

  constructor(private _store: Store, private router: Router, private action$: Actions) {
    this.paymentResult$ = this._store.select((state) => state.QuoteProgessState.paymentResult);
    this.paymentResult$.subscribe((dataPayment) => {

      const inceptionDate = dataPayment?.Risk?.RiskGrp[0]?.RiskLoc?.InceptionDate
      const expiryDate = dataPayment?.Risk?.RiskGrp[0]?.RiskLoc?.ExpiryDate

      if (inceptionDate) {
        this.periodOfInsurance.InceptionDate = this.formatDate(inceptionDate);
        this.periodOfInsurance.ExpiryDate = this.formatDate(expiryDate);
      }

    });
  }

  ngOnInit(): void {
    this.params = extractQueryParamsFunctiion(window.location.search);
    this.getLocalStorage();
    hideChatBot();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  backto(event: any) {
    if (event) {
      this.router.navigate(['/get-info'], { queryParams: this.params });
      this.clearStorageData();
    }
  }

  clearStorageData() {
    window.localStorage.clear();
  }

  getStatus(event: any) {
    if (event) {
      const referenceNumber = this.params['RefNo'] ? this.params['RefNo'] : this.params['refno'];
      this._store.dispatch(new GET_QUOTE_INFO(referenceNumber));
      this.action$
        .pipe(ofActionCompleted(GET_QUOTE_INFO), takeUntil(this.ngUnsubscribe))
        .subscribe((data: ActionCompletion) => {
          if (data.result.error) {
            this.otherConfigs.backToHome = true;
          }
        });
    }
  }

  getLocalStorage() {
    var errorDesc = sessionStorage.getItem('errorDesc');
    if (errorDesc != 'undefined') {
      var str = errorDesc?.toString() ? errorDesc?.toString() : '';
      this.payResParamDesc = str.charAt(0).toUpperCase() + str?.slice(1).toLowerCase();
    }
  }

  formatDate(date: any) {
    return moment(date).format('DD/MM/YYYY');
  }
}
