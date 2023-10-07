import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SuccessComponent } from './success.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProductStageModule } from 'module/product-stage/product-stage.module';

/** ndbx */
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';


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
    NxProgressStepperModule,
    NxCardModule,
    NxButtonModule,
    NxCopytextModule,
    NxGridModule,
    NxHeadlineModule,
    ReactiveFormsModule,
    ProductStageModule,
  ],
  exports: [],
})
export class SuccessModule { }
