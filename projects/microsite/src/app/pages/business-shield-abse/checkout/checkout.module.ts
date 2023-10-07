import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*---- NDBX Component ----*/

import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { PaymentDialogModule } from 'module/payment-dialog/payment-dialog.module';
import { QuotationSummaryCardModule } from 'module/quotation-summary-card/quotation-summary-card.module';
import { SharedModule } from 'module/shared.module';


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
    ProductStageModule,
    ReactiveFormsModule,
    FormsModule,
    QuotationSummaryCardModule,
    NxProgressStepperModule,
    NxHeadlineModule,
    NxButtonModule,
    NxLinkModule,
    NxCardModule,
    NxCheckboxModule,
    NxGridModule,
    NxPopoverModule,
    NxCopytextModule,
    PaymentDialogModule,
    SharedModule
  ],
})
export class CheckoutModule { }
