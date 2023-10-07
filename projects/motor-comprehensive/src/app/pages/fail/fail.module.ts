import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailComponent } from './fail.component';
import { RouterModule, Routes } from '@angular/router';

/*---- Shared Component ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { QuotationSummaryCardModule } from 'module/quotation-summary-card/quotation-summary-card.module';

/*---- NDBX Component ----*/
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxButtonModule } from '@aposin/ng-aquila/button';

const routes: Routes = [
  {
    path: '',
    component: FailComponent,
  },
];

@NgModule({
  declarations: [FailComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ProductStageModule,
    QuotationSummaryCardModule,
    NxProgressStepperModule,
    NxButtonModule,
  ],
})
export class FailModule { }
