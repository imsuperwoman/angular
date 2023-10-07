import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetInfoComponent } from './get-info.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';

/*---- Shared Custom Components ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';

/*---- NDBX Component ----*/
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxIconModule } from '@aposin/ng-aquila/icon';

const routes: Routes = [
  {
    path: '',
    component: GetInfoComponent,
  },
];

@NgModule({
  declarations: [GetInfoComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    IconPopoverModule,
    ProductStageModule,
    FormsModule,
    NxProgressStepperModule,
    NxLinkModule,
    NxButtonModule,
    NxHeadlineModule,
    NxCopytextModule,
    NxIconModule
  ],
})
export class GetInfoModule { }
