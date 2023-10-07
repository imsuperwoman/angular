import { Component, OnInit } from '@angular/core';
import { FOOTER_MENU } from '@constants/footer-constants';
import { IMAGE_FOLDER } from '@constants/header-constants';

import { Select, Store } from '@ngxs/store';
import { GeneralSelectors } from 'module/store/general.selectors';
import { Observable } from 'rxjs';
import * as content from '@constants/content.static-data';

@Component({
  selector: 'site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.scss']
})
export class SiteFooterComponent implements OnInit {

  imageFolder = IMAGE_FOLDER;
  contentData: any = content.data;
  mobileMode?: boolean;

  /*---- Params ----*/
  @Select(GeneralSelectors.flowType) flowType$: any;
  footerMenuData$: Observable<any>;
  FOOTER_MENU = FOOTER_MENU;
  /*-- Helpline --*/
  showHelpline: boolean = false;

  constructor(private _store: Store) {
    this.footerMenuData$ = this._store.select(state => state.GeneralState.footerMenuData);
  }

  ngOnInit(): void {
    this.mobileMode = window.matchMedia('(max-width: 800px)').matches;

    window.matchMedia('(max-width: 800px)').addEventListener('change', () => {
      this.mobileMode = window.matchMedia('(max-width: 800px)').matches;
    });
  }
}
