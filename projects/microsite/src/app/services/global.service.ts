import { Injectable } from '@angular/core';
import { ActionCompletion, ofActionCompleted, Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { firstValueFrom, takeUntil } from 'rxjs';
import { GET_ACCESS_TOKEN, GET_DYNAMIC_CONTENT, GET_LOV, GET_POSTAL_CODES, GET_PRODUCT_CONFIG } from 'module/store/general.action';
import { Router } from '@angular/router';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { ServerTimeoutDialogComponent } from 'module/server-timeout-dialog/server-timeout-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  /*---- Modal Dialog ----*/
  activeDialogRef!: NxModalRef<any>;

  constructor(
    private action$: Actions,
    private router: Router,
    public spinnerOverlayService: SpinnerOverlayService,
    private _store: Store,
    public dialogService: NxDialogService) { }

  getGlobalValue(PRODUCT_CAT: string, parameters: any, ngUnsubscribe: any): void {
    this.getConfig(PRODUCT_CAT, parameters);
    this.checkStatus(ngUnsubscribe)
  }

  getConfig(PRODUCT_CAT: string, parameters: any): void {
    firstValueFrom(this._store.dispatch(new GET_ACCESS_TOKEN())).then((_) => {
      this._store.dispatch(new GET_LOV(PRODUCT_CAT, parameters));
      this._store.dispatch(new GET_POSTAL_CODES());

      this._store.dispatch(new GET_PRODUCT_CONFIG(PRODUCT_CAT)).subscribe((res) => {
        firstValueFrom(this._store.dispatch(new GET_DYNAMIC_CONTENT())).then((_) => {
          if (_.GeneralState.dynamicContent.Header?.display404 == 'Y') {
            this.router.navigate(['/not-found'], { queryParamsHandling: 'preserve' });
          }
        });
      });
    });
  }

  checkStatus(ngUnsubscribe: any): void {
    this.action$
      .pipe(
        ofActionCompleted(GET_ACCESS_TOKEN, GET_PRODUCT_CONFIG, GET_DYNAMIC_CONTENT),
        takeUntil(ngUnsubscribe)
      )
      .subscribe((data: ActionCompletion) => {
        if (data.result.error) {
          //handle mulitple popup
          this.activeDialogRef = this.dialogService.open(ServerTimeoutDialogComponent, {
            showCloseIcon: true,
            data: { refreshPage: true },
          });
        }
      });
    this.action$.pipe(ofActionSuccessful(GET_DYNAMIC_CONTENT)).subscribe(() =>
      this.spinnerOverlayService.hideLoadOverlay()
    );
  }
}

