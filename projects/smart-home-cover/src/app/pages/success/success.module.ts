import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SuccessComponent } from './success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { environment } from 'environments/environment';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { ProductStageModule } from 'module/product-stage/product-stage.module';

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
    FormsModule,
    NxCheckboxModule,
    NxButtonModule,
    ReactiveFormsModule,
    NxProgressStepperModule,
    ProductStageModule,
  ]
})
export class SuccessModule { }
