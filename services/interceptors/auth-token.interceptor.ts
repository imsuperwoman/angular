import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable, InjectionToken, NgZone, TemplateRef, ViewChild } from '@angular/core';
import { Store } from '@ngxs/store';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { GET_ACCESS_TOKEN } from 'module/store/general.action';
import { ServerTimeoutDialogComponent } from 'module/server-timeout-dialog/server-timeout-dialog.component';
import { NxDialogService } from '@aposin/ng-aquila/modal';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';

export var BASE_CONFIG = new InjectionToken<APP_BASE_CONFIG>("Base url");
export interface APP_BASE_CONFIG {
  API_URL: string,
  API_TOKEN: string
}
@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {
  @ViewChild('template') templateRef!: TemplateRef<any>;
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private _store: Store,
    public dialogService: NxDialogService,
    public spinnerOverlayService: SpinnerOverlayService,
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = this.addHeader(request);
    return next.handle(request).pipe(catchError((error: any) => {

      if (error instanceof HttpErrorResponse) {
        if (error.status === 401 || error.status === 400) {
          if (!this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);
            request = this.addHeader(request);
            return this._store.dispatch(new GET_ACCESS_TOKEN()).pipe(
              switchMap((token: any) => {
                this.isRefreshing = false;
                request = this.addHeader(request);
                this.refreshTokenSubject.next(token);
                return next.handle(this.addHeader(request));
              }));
          } else {
            return this.refreshTokenSubject.pipe(
              filter(token => (token != null && token != undefined)),
              take(1),
              switchMap(() => {
                return next.handle(this.addHeader(request))
              }));
          }
        } else {
          this.spinnerOverlayService.hideLoadOverlay();
          this.dialogService.open(ServerTimeoutDialogComponent, {
            showCloseIcon: true,
            data: { refreshPage: true },
          })
        }
      };
      return next.handle(this.addHeader(request))
    }));
  }

  private addHeader(request: HttpRequest<any>) {
    let getEndPoint = request.url.split('/')[request.url.split('/').length - 1];

    if (getEndPoint !== 'accesstoken' && getEndPoint !== 'token') {
      const accessToken = this._store.selectSnapshot(state => state.GeneralState.access_token)
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
    return request;
  }
}


