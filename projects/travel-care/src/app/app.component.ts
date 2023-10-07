import { Component, OnDestroy, OnInit } from '@angular/core';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { ActionCompletion, Actions, ofActionCompleted, Store } from '@ngxs/store';
import extractQueryParamsFunctiion from '@functions/extract-query-params.function';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { GET_ACCESS_TOKEN, GET_DYNAMIC_CONTENT, GET_LOV, GET_POSTAL_CODES, GET_PRODUCT_CONFIG } from 'module/store/general.action';
import { STANDARD_LOV_VALUES } from 'module/store/general-constants';
import { Router } from '@angular/router';
import { ServerTimeoutDialogComponent } from 'module/server-timeout-dialog/server-timeout-dialog.component';
import { NavigationService } from '@services/navigation.service';
import { hideChatBot } from '@functions/chatBot.function';
import { GET_DOCUMENTS_CONFIG, GET_QUOTE_INFO, RESET_QUOTE_INFO } from './store/actions/quote-progress.action';
import { GeneralService } from './services/general.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  /*---- Modal Dialog ----*/
  activeDialogRef!: NxModalRef<any>;
  params: any;
  redirect = '';
  PRODUCT_CAT: any;

  private ngUnsubscribe = new Subject<void>();

  constructor(private _store: Store,
    public spinnerOverlayService: SpinnerOverlayService,
    private router: Router,
    private action$: Actions,
    public dialogService: NxDialogService,
    public navigation: NavigationService,
    public generalService: GeneralService
  ) {
    this.navigation.startSaveHistory();
    generalService.setConfig();
    this.PRODUCT_CAT = generalService.getConfig().PRODUCT_CAT;
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
      this.spinnerOverlayService.hideLoadOverlay();
    } else {
      var count = 0;
      this.loadConfig();
      this.action$
        .pipe(
          ofActionCompleted(GET_ACCESS_TOKEN, GET_POSTAL_CODES, GET_PRODUCT_CONFIG, GET_LOV,
            GET_DOCUMENTS_CONFIG, GET_DYNAMIC_CONTENT),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe((data: ActionCompletion) => {
          if (data.result.error) {
            this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
              showCloseIcon: true,
              data: { refreshPage: true },
            });
          } else if (data.result.successful) {
            count++
            if (count == 6) {
              this.spinnerOverlayService.hideLoadOverlay();
            }
          }
        });
    }
  }

  loadConfig() {
    firstValueFrom(this._store.dispatch(new GET_ACCESS_TOKEN())).then((_) => {

      let parameters: any = [...STANDARD_LOV_VALUES,
        'TRAGERANGE', "TRGRPCODE", 'PAXNO', 'AZCOMPREG', 'RELATIONSHIP']
      this._store.dispatch(new GET_LOV(this.PRODUCT_CAT, parameters));
      this._store.dispatch(new GET_POSTAL_CODES());
      this._store.dispatch(new GET_DOCUMENTS_CONFIG());
      this._store.dispatch(new GET_PRODUCT_CONFIG(this.PRODUCT_CAT)).subscribe((res) => {
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
        localStorage.setItem('errorDesc', this.params['errordesc']);
        delete this.params['errordesc'];
        delete this.params['productcode'];

        var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
        if (sourceSystem !== 'SCOL' || sourceSystem !== 'AZOL') {
          this.params['p_isspecificagent'] = true;
        }

        this._store.dispatch(new RESET_QUOTE_INFO());
        this._store.dispatch(new GET_QUOTE_INFO(referenceNumber))

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

