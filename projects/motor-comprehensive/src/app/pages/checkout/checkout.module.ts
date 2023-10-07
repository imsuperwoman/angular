import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*---- Shared Component ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { QuotationSummaryCardModule } from 'module/quotation-summary-card/quotation-summary-card.module';
import { PaymentDialogModule } from 'module/payment-dialog/payment-dialog.module';

/*---- NDBX Component ----*/
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import {
  NxSpinnerModule
} from '@aposin/ng-aquila/spinner';
const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent,
  },
];

@NgModule({
  declarations: [CheckoutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    ProductStageModule,
    QuotationSummaryCardModule,
    PaymentDialogModule,
    NxProgressStepperModule,
    NxCheckboxModule,
    NxButtonModule,
    NxSpinnerModule
  ],
})
export class CheckoutModule { }
