import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteHeaderModule } from '../../module/site-header/site-header.module';
import { SiteFooterModule } from '../../module/site-footer/site-footer.module';
import { RouterModule } from '@angular/router';
import { MainLayoutComponent } from './main-layout.component';

@NgModule({
  declarations: [MainLayoutComponent],
  imports: [CommonModule, SiteHeaderModule, SiteFooterModule, RouterModule],
  exports: [MainLayoutComponent],
})
export class MainLayoutModule {}
