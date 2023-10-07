import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { ReactiveFormsModule } from '@angular/forms';

/*---- Shared Module ----*/
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { SharedModule } from 'module/shared.module';

/*---- NDBX Component ----*/
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
//import { NxComparisonTableModule } from '@aposin/ng-aquila/comparison-table';
import { NxSwipebarModule } from '@aposin/ng-aquila/swipebar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxTableModule } from '@aposin/ng-aquila/table';

@NgModule({
  declarations: [DynamicTableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NxCheckboxModule,
    NxPopoverModule,
    NxButtonModule,
    NxIconModule,
    NxLinkModule,
    IconPopoverModule,
    SharedModule,
   // NxComparisonTableModule,
    NxSwipebarModule,
    NxCopytextModule,
    NxTableModule,
  ],
  exports: [
    DynamicTableComponent,
   // NxComparisonTableModule,
    NxSwipebarModule,
    NxTableModule,
  ],
})
export class DynamicTableModule { }
