import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationComponent } from './quotation.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

/*---- Shared Custom Component ----*/
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { ProductStageModule } from 'module/product-stage/product-stage.module';

/*---- NDBX Component ----*/
import { QuotationSummaryCardModule } from 'module/quotation-summary-card/quotation-summary-card.module';

import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxComparisonTableModule } from '@aposin/ng-aquila/comparison-table';
import { NxTableModule } from '@aposin/ng-aquila/table';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { NxHeaderModule } from '@aposin/ng-aquila/header';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';


const routes: Routes = [
  {
    path: '',
    component: QuotationComponent,
  },
];

@NgModule({
  declarations: [QuotationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    IconPopoverModule,
    ProductStageModule,
    NxProgressStepperModule,
    NxComparisonTableModule,
    NxTableModule,
    NxIconModule,
    NdbxIconModule,
    NxPopoverModule,
    NxHeaderModule,
    NxHeadlineModule,
    NxCardModule,
    NxButtonModule,
    NxCopytextModule,
    NxGridModule,
    NxSpinnerModule,
    QuotationSummaryCardModule
  ],
})
export class QuotationModule { }
