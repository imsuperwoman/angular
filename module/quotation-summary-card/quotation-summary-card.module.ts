import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationSummaryCardComponent } from './quotation-summary-card.component';

/** Shared component */
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';

/** NDBX */
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxButtonModule } from '@aposin/ng-aquila/button';


@NgModule({
  declarations: [QuotationSummaryCardComponent],
  imports: [
    CommonModule,
    NxCardModule,
    IconPopoverModule,
    NxButtonModule
  ],
  exports: [QuotationSummaryCardComponent]
})
export class QuotationSummaryCardModule { }
