import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from './site-header.component';
import { RouterModule } from '@angular/router';
import { NxHeaderModule } from '@aposin/ng-aquila/header';
import { NxMenuModule } from '@aposin/ng-aquila/menu';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxTreeModule } from '@aposin/ng-aquila/tree';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { LeaveDialogModule } from 'module/leave-page-dialog/leave-page-dialog.module';

@NgModule({
  declarations: [SiteHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    NxHeaderModule,
    NxMenuModule,
    NxIconModule,
    NxTreeModule,
    NxLinkModule,
    NxModalModule,
    NxButtonModule,
    LeaveDialogModule
  ],
  exports: [SiteHeaderComponent],
})
export class SiteHeaderModule { }
