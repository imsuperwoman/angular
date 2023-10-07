import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SuccessWithoutPayment } from './success-without-payment.component';

/*---- Shared Component ----*/
import { QuotationSummaryCardModule } from 'module/quotation-summary-card/quotation-summary-card.module';
import { ProductStageModule } from 'module/product-stage/product-stage.module';

/*---- NDBX Component ----*/
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxButtonModule } from '@aposin/ng-aquila/button';

import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxImageModule } from '@aposin/ng-aquila/image';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';

import { NxIconModule } from '@aposin/ng-aquila/icon';

const routes: Routes = [
  {
    path: '',
    component: SuccessWithoutPayment,
  },
];

@NgModule({
  declarations: [SuccessWithoutPayment],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    QuotationSummaryCardModule,
    ProductStageModule,
    NxProgressStepperModule,
    NxButtonModule,
    NxCardModule,
    NxGridModule,
    NxImageModule,
    NxCopytextModule,
    NxHeadlineModule,

    NxIconModule,
  ],
})
export class SuccessWithoutPaymentModule { }
