import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';
import { SiteHeaderModule } from '../site-header/site-header.module';
import { SiteFooterModule } from '../site-footer/site-footer.module';


@NgModule({
  declarations: [MainLayoutComponent],
  imports: [CommonModule, SiteHeaderModule, SiteFooterModule, RouterModule],
  exports: [MainLayoutComponent],
})
export class MainLayoutModule { }
