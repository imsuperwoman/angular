import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FailComponent } from './fail.component';
import { RouterModule, Routes } from '@angular/router';

import { ProductStageModule } from 'module/product-stage/product-stage.module';

import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxGridModule } from '@aposin/ng-aquila/grid';
const routes: Routes = [
  {
    path: '',
    component: FailComponent
  }
]

@NgModule({
  declarations: [
    FailComponent
  ],
  imports: [
    CommonModule,
    NxProgressStepperModule,
    NxCardModule,
    NxButtonModule,
    NxCopytextModule,
    NxGridModule,
    ProductStageModule,
    RouterModule.forChild(routes),
    ProductStageModule
  ]
})
export class FailModule { }
