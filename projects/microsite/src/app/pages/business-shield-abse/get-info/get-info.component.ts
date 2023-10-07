import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT_DATA, HEADER, LOGO, PRODUCT_CAT, SUBHEADER } from '../../../constants/abs-constants';
import { Store } from '@ngxs/store';
import { firstValueFrom, Subject } from 'rxjs';
import { SpinnerOverlayService } from 'module/spinner-overlay/spinner-overlay.service';
import { GET_QUOTE } from '../../../store/actions/quote-progress.action';
import { Title } from '@angular/platform-browser';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'get-info',
  templateUrl: './get-info.component.html',
  styleUrls: ['./get-info.component.scss']
})
export class GetInfoComponent implements OnInit, OnDestroy {

  LOGO: string = LOGO;
  HEADER = HEADER;
  SUBHEADER = SUBHEADER;
  DOCUMENT_DATA = DOCUMENT_DATA;

  private ngUnsubscribe = new Subject();

  constructor(private route: Router,
    private _store: Store,
    private spinnerOverlayService: SpinnerOverlayService,
    private title: Title,
    private globalService: GlobalService) {
    this.title.setTitle(HEADER);
    let parameters: any = ["MOBILEPREFIX", "BUSINESSIDTYPE", "BUSINESSOPERATION"];
    this.globalService.getGlobalValue(PRODUCT_CAT, parameters, this.ngUnsubscribe)
  }

  ngOnInit(): void {
    window.sessionStorage.clear();
    localStorage.setItem('path', 'business-shield/P1P2P3');
    localStorage.setItem('header', HEADER);
    
  }

  ngOnDestroy() {
    this.ngUnsubscribe.complete();
  }

  nextQuestion(): void {
    var partnerId = this._store.selectSnapshot((state: any) => state.GeneralState.sourceSystem);
    this.spinnerOverlayService.showLoadOverlay();
    var payload = { partnerId: partnerId }
    firstValueFrom(this._store.dispatch(new GET_QUOTE(payload, PRODUCT_CAT))).then((res: any) => {
      this.spinnerOverlayService.hideLoadOverlay();
      this.route.navigate([localStorage.getItem('path') + '/quotation'],
        { queryParamsHandling: 'preserve' });
    })
  }
}
