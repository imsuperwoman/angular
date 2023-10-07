import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*---- Shared Component ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { QuotationSummaryCardModule } from 'module/quotation-summary-card/quotation-summary-card.module';
import { PaymentDialogModule } from 'module/payment-dialog/payment-dialog.module';
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';

/*---- NDBX Component ----*/
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';

import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxImageModule } from '@aposin/ng-aquila/image';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { NxTableModule } from '@aposin/ng-aquila/table';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxListModule } from '@aposin/ng-aquila/list';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';
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
    ReactiveFormsModule,
    FormsModule,
    ProductStageModule,
    QuotationSummaryCardModule,
    PaymentDialogModule,
    NxProgressStepperModule,
    NxCheckboxModule,
    NxButtonModule,
    NxSpinnerModule,
    NxTableModule,
    NxCardModule,
    NxGridModule,
    NxImageModule,
    NxCopytextModule,
    NxHeadlineModule,
    NxAccordionModule,
    NxLinkModule,
    NxPopoverModule,
    IconPopoverModule,
    NdbxIconModule,
    NxIconModule,
    NxListModule,
    NxFormfieldModule,
    NxInputModule,
    NxModalModule,
    SharedDialogModule,
    SharedModule

  ],
})
export class CheckoutModule { }
