import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDetailsComponent } from './customer-details.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

/*---- Shared Custom Component ----*/
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { ProductStageModule } from 'module/product-stage/product-stage.module';

import { SharedModule } from 'module/shared.module';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxDatefieldModule, NxNativeDateModule } from '@aposin/ng-aquila/datefield';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { FormsModule } from '@angular/forms';
import { NxListModule } from '@aposin/ng-aquila/list';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { DateFieldModule } from 'module/date-field/date-field.module';
import { NxMaskModule } from '@aposin/ng-aquila/mask';


const routes: Routes = [
  {
    path: '',
    component: CustomerDetailsComponent,
  },
];

@NgModule({
  declarations: [CustomerDetailsComponent],
  imports: [
    CommonModule,

    RouterModule.forChild(routes),
    ReactiveFormsModule,
    IconPopoverModule,
    ProductStageModule,
    NxFormfieldModule,
    NxErrorModule,
    NxDropdownModule,
    NxAccordionModule,
    NxDatefieldModule,
    NxNativeDateModule,
    NxMomentDateModule,
    NxProgressStepperModule,
    NxIconModule,
    NdbxIconModule,
    NxHeadlineModule,
    NxCardModule,
    NxButtonModule,
    NxCopytextModule,
    NxGridModule,
    FormsModule,
    NxInputModule,
    NxListModule,
    DateFieldModule,
    NxMaskModule,
    SharedModule
  ],
})
export class CustomerDetailsModule { }
