import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SuccessComponent } from './success.component';

/*---- Shared Component ----*/
import { QuotationSummaryCardModule } from 'module/quotation-summary-card/quotation-summary-card.module';
import { ProductStageModule } from 'module/product-stage/product-stage.module';

/*---- NDBX Component ----*/
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxButtonModule } from '@aposin/ng-aquila/button';

const routes: Routes = [
  {
    path: '',
    component: SuccessComponent,
  },
];

@NgModule({
  declarations: [SuccessComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    QuotationSummaryCardModule,
    ProductStageModule,
    NxProgressStepperModule,
    NxButtonModule
  ],
})
export class SuccessModule { }
