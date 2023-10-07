import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { ActionCompletion, Actions, ofActionCompleted, ofActionSuccessful, Store } from '@ngxs/store';
import { NavigationService } from '@services/navigation.service';
import { ServerTimeoutDialogComponent } from 'module/server-timeout-dialog/server-timeout-dialog.component';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import {
  GET_DYNAMIC_CONTENT,
  GET_ACCESS_TOKEN,
  GET_POSTAL_CODES,
  GET_LOV,
  GET_UNDERWRITING,
  GET_PRODUCT_CONFIG
} from 'module/store/general.action';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { AZOL, PRODUCT_CAT } from './constants/shc-constants';
import { GET_QUOTE_INFO, GET_BUNDLE_CONFIG, GET_DOCUMENTS_CONFIG, RESET_QUOTE_INFO, } from './store/actions/quote-progess.action';
import { STANDARD_LOV_VALUES } from '../../../../module/store/general-constants';
import extractQueryParamsFunctiion from '@functions/extract-query-params.function';
import { hideChatBot } from '@functions/chatBot.function';


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
      this.spinnerOverlayService.hideLoadOverlay();
      this.checkRedirect();
    } else {
      this.loadConfig();
      this.action$
        .pipe(
          ofActionCompleted(GET_ACCESS_TOKEN, GET_PRODUCT_CONFIG, GET_BUNDLE_CONFIG, GET_DYNAMIC_CONTENT),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe((data: ActionCompletion) => {
          if (data.result.error) {
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: true },
            });
          }
        });
      this.action$.pipe(ofActionSuccessful(GET_DYNAMIC_CONTENT, GET_BUNDLE_CONFIG)).subscribe(() =>
        this.spinnerOverlayService.hideLoadOverlay()
      );
    }
  }

  loadConfig() {
    firstValueFrom(this._store.dispatch(new GET_ACCESS_TOKEN())).then((_) => {

      let parameters: any = [...STANDARD_LOV_VALUES, "OWNERTYPE", "PROPERTYTYPE", "COVERAGETYPE",
        'OBH007', 'SHCDISCPRD', 'BUILDSTOREYCODE', 'BUILDSTOREYCODENL'];

      this._store.dispatch(new GET_LOV(PRODUCT_CAT, parameters));
      this._store.dispatch(new GET_UNDERWRITING(PRODUCT_CAT, 'SHCDECLARE'));
      this._store.dispatch(new GET_POSTAL_CODES());
      this._store.dispatch(new GET_DOCUMENTS_CONFIG());
      this._store.dispatch(new GET_BUNDLE_CONFIG(PRODUCT_CAT));

      this._store.dispatch(new GET_PRODUCT_CONFIG(PRODUCT_CAT)).subscribe((res) => {
        firstValueFrom(this._store.dispatch(new GET_DYNAMIC_CONTENT())).then((_) => {
          if (_.GeneralState.dynamicContent.Header?.display404 == 'Y' || _.GeneralState.productConfig.Show404Page === 'Y') {
            this.router.navigate(['/not-found'], { queryParams: this.params });
          }
        });
      });
    });
  }

  checkRedirect() {
    if (this.params.hasOwnProperty('redirect')) {
      hideChatBot();

      if (this.params.hasOwnProperty('RefNo') || this.params.hasOwnProperty('refno')) {
        const referenceNumber = (this.params['RefNo']) ? (this.params['RefNo']) : (this.params['refno']);
        this._store.dispatch(new GET_DYNAMIC_CONTENT())

        delete this.params['redirect'];
        delete this.params['status'];
        sessionStorage.setItem('errorDesc', this.params['errordesc']);
        delete this.params['errordesc'];
        delete this.params['productcode'];

        var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
        if (sourceSystem !== 'SCOL' || sourceSystem !== AZOL) {
          this.params['p_isspecificagent'] = true;
        }

        this._store.dispatch(new RESET_QUOTE_INFO());
        this._store.dispatch(new GET_QUOTE_INFO(referenceNumber));

        this.action$
          .pipe(
            ofActionCompleted(RESET_QUOTE_INFO, GET_QUOTE_INFO),
            takeUntil(this.ngUnsubscribe)
          )
          .subscribe((data: ActionCompletion) => {
            if (data.result.error) {
              this.router.navigate(['/fail'], { queryParams: this.params });
            } else {
              var paymentResult = this._store.selectSnapshot((state) => state.QuoteProgessState.paymentResult);
              if (paymentResult.QuotationProgress == 'POLICYISSUED') {
                this.router.navigate(['/success'], { queryParams: this.params });
              }
              else if (paymentResult.QuotationProgress == 'PAYMENTSUCCESS') {
                this.router.navigate(['/success'], { queryParams: this.params });
              }
              else {
                this.router.navigate(['/fail'], { queryParams: this.params });
              }
            }
          });
      }
    }
  }
}
