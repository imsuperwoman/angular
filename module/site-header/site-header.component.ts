import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NxDialogService, NxModalRef } from '@aposin/ng-aquila/modal';
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
  @ViewChild('leavePageDialog') leaveTemplateRef!: TemplateRef<any>;

  activeDialogRef!: NxModalRef<any>;

  imageFolder = IMAGE_FOLDER;
  close: boolean = false;
  hamburger: boolean = true;
  dropdown: boolean = false;
  currentURL;
  leaveDialogShown: boolean = true;
  clickedLink: any;
  workingTime = DEFAULTS_HEADER.Header.workingTime;

  /*---- Params ----*/
  activePartner$: Observable<any>;
  menuData$: Observable<any>;
  sourceSystemCat$: Observable<any>;
  partnerLogo: any

  constructor(
    private _store: Store,
    private nxDialogService: NxDialogService,
    public generalService: GeneralService,
    public http: HttpClient
  ) {
    this.activePartner$ = this._store.select((state) => state.GeneralState.dynamicContent);
    this.menuData$ = this._store.select((state) => state.GeneralState.menuData);
    this.currentURL = window.location.href;
    this.sourceSystemCat$ = this._store.select((state) => state.GeneralState.productConfig.SourceSystemCat);
    var sourceSystem = this._store.selectSnapshot((state) => state.GeneralState.sourceSystem);
    this.partnerLogo = '/ndbx-partner-logo/assets/logo/' + sourceSystem + '.svg'
  }

  setDefaultPic() {
    this.partnerLogo = "";
  }

  getFullResponse(url: string): Observable<HttpResponse<any>> {
    return this.http.get(url, {
      observe: 'response'
    });
  }

  ngOnInit(): void {
  }

  showClose(): void {
    if (this.close === true) {
      this.close = false;
    } else {
      this.close = true;
    }
  }

  showHamburger(): void {
    if (this.hamburger === true) {
      this.hamburger = false;
    } else {
      this.hamburger = true;
    }
  }

  onClick(item: any) {
    item.expanded = !item.expanded;
  }

  showDropdown() {
    if (this.dropdown === false) {
      this.dropdown = true;
    } else {
      this.dropdown = false;
    }
  }

  closeDialog(): void {
    this.activeDialogRef.close();
  }


  leavePage(): void {
    this.closeDialog();
    this.menuData$.forEach(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].label === this.clickedLink) {
          document.location.href = data[i].queryParams;
        }
      }
    });
  }

  openLeaveDialog(label: string): void {
    this.clickedLink = label;
    this.activeDialogRef = this.nxDialogService.open(this.leaveTemplateRef, {
      showCloseIcon: true,
    });
  }
}
