import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NxModalRef } from '@aposin/ng-aquila/modal';
import { IMAGE_FOLDER } from '@constants/header-constants';
import { Store } from '@ngxs/store';
import { DEFAULTS_HEADER } from 'module/store/general.model';
import { GeneralService } from 'module/store/general.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements OnInit {

  activeDialogRef!: NxModalRef<any>;

  imageFolder = IMAGE_FOLDER;
  currentURL;
  workingTime = DEFAULTS_HEADER.Header.workingTime;

  /*---- Params ----*/
  activePartner$: Observable<any>;
  sourceSystemCat$: Observable<any>;
  partnerLogo: any

  constructor(
    private _store: Store,
    public generalService: GeneralService,
    public http: HttpClient
  ) {
    this.activePartner$ = this._store.select((state) => state.GeneralState.dynamicContent);
    this.currentURL = window.location.href;
    this.sourceSystemCat$ = this._store.select((state) => state.GeneralState.productConfig.SourceSystemCat);
    var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
    this.partnerLogo = '/ndbx-partner-logo/assets/logo/' + sourceSystem + '.svg'
  }
  ngOnInit() {
  }

  setDefaultPic() {
    this.partnerLogo = "";
  }

  getFullResponse(url: string): Observable<HttpResponse<any>> {
    return this.http.get(url, {
      observe: 'response'
    });
  }
}
