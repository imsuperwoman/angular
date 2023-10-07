import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SiteFooterComponent } from './site-footer.component';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxFooterModule } from '@aposin/ng-aquila/footer';
import { NxMenuModule } from '@aposin/ng-aquila/menu';
/*---- NDBX Component ----*/
import { NxButtonModule } from '@aposin/ng-aquila/button';

@NgModule({
  declarations: [SiteFooterComponent],
  imports: [
    CommonModule,
    RouterModule,
    NxLinkModule,
    NxIconModule,
    NxFooterModule,
    NxMenuModule,
    NxButtonModule
  ],
  exports: [SiteFooterComponent],
})
export class SiteFooterModule { }
