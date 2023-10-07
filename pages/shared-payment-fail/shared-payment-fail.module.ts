import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedPaymentFailComponent } from './shared-payment-fail.component';

import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { SharedModule } from 'module/shared.module';
import { NxButtonModule } from '@aposin/ng-aquila/button';


@NgModule({
  declarations: [SharedPaymentFailComponent],
  imports: [
    CommonModule,
    ProductStageModule,
    NxProgressStepperModule,
    SharedModule,
    NxButtonModule
  ],
  exports: [SharedPaymentFailComponent],
})
export class SharedPaymentFailModule { }
