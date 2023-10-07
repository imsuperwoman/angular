import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FailComponent } from './fail.component';
import { SharedPaymentFailModule } from 'pages/shared-payment-fail/shared-payment-fail.module';

const routes: Routes = [
  {
    path: '',
    component: FailComponent
  }
]

@NgModule({

  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedPaymentFailModule,
  ],
  declarations: [
    FailComponent
  ]

})
export class FailModule { }
