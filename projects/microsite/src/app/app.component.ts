import { Router } from '@angular/router';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { ActionCompletion, Actions, ofActionCompleted, Store } from '@ngxs/store';
import { NavigationService } from '@services/navigation.service';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import {
  GET_DYNAMIC_CONTENT
} from 'module/store/general.action';
import { Subject, takeUntil } from 'rxjs';
import extractQueryParamsFunctiion from '@functions/extract-query-params.function';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { QUOTE_INFO } from './store/actions/quote-progress.action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  /*---- Modal Dialog ----*/
  activeDialogRef!: NxModalRef<any>;
  params: any;
  redirect = '';

  private ngUnsubscribe = new Subject<void>();

  constructor(private _store: Store, private router: Router,
    public navigation: NavigationService,
    public spinnerOverlayService: SpinnerOverlayService,
    private action$: Actions,
    public dialogService: NxDialogService,) {
    this.navigation.startSaveHistory();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.params = extractQueryParamsFunctiion(window.location.search)
    this.spinnerOverlayService.showLoadOverlay();
    if (this.params.hasOwnProperty('redirect')) {
      this.checkRedirect();
    }
    this.spinnerOverlayService.hideLoadOverlay();
  }

  checkRedirect() {
    if (this.params.hasOwnProperty('redirect')) {
      if (this.params.hasOwnProperty('RefNo') || this.params.hasOwnProperty('refno')) {
        const referenceNumber = (this.params['RefNo']) ? (this.params['RefNo']) : (this.params['refno']);
        this._store.dispatch(new GET_DYNAMIC_CONTENT())

        delete this.params['redirect'];
        delete this.params['status'];
        localStorage.setItem('errorDesc', this.params['errordesc']);
        delete this.params['errordesc'];
        delete this.params['productcode'];

        var generalState = this._store.selectSnapshot((state) => state.GeneralState);
        if (generalState.sourceSystem !== 'SCOL' || generalState.sourceSystem !== 'AZOL') {
          this.params['p_isspecificagent'] = true;
        }

        this._store.dispatch(new QUOTE_INFO(referenceNumber, generalState.PRODUCT_CAT))

        this.action$
          .pipe(
            ofActionCompleted(QUOTE_INFO),
            takeUntil(this.ngUnsubscribe)
          )
          .subscribe((data: ActionCompletion) => {
            if (data.result.error) {
              this.router.navigate([localStorage.getItem('path') + '/fail'], { queryParams: this.params });
            } else {
              var paymentResult = this._store.selectSnapshot((state) => state.QuoteProgessState.paymentResult);
              if (paymentResult.QuotationProgress == 'POLICYISSUED') {
                this.router.navigate([localStorage.getItem('path') + '/success'], { queryParams: this.params });
              }
              else if (paymentResult.QuotationProgress == 'PAYMENTSUCCESS') {
                this.router.navigate([localStorage.getItem('path') + '/success'], { queryParams: this.params });
              }
              else {
                this.router.navigate([localStorage.getItem('path') + '/fail'], { queryParams: this.params });
              }
            }
          });
      }
    }
  }
}