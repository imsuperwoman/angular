import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutComponent } from './checkout.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/*---- NDBX Component ----*/
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxModalModule } from '@aposin/ng-aquila/modal';

import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { PaymentDialogModule } from 'module/payment-dialog/payment-dialog.module';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { SharedModule } from 'module/shared.module';
//import { PaymentRazerDialogModule } from 'module/payment-razer-dialog/payment-razer-dialog.module';

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
    FormsModule,
    ProductStageModule,
    NxCheckboxModule,
    NxButtonModule,
    NxIconModule,
    ReactiveFormsModule,
    NxModalModule,
    NxSpinnerModule,
    NxProgressStepperModule,
    PaymentDialogModule,
    // PaymentRazerDialogModule,
    NxIconModule,
    NdbxIconModule,
    SharedModule
  ],
})
export class CheckoutModule { }
