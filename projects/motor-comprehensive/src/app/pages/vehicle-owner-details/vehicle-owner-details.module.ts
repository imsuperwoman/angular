import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { VehicleOwnerDetailsComponent } from './vehicle-owner-details.component';

/*---- Shared Custom Components ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { AccordionIndicatorModule } from 'module/accordion-indicator/accordion-indicator.module';
import { DateFieldModule } from 'module/date-field/date-field.module';

/*---- NDBX Component ----*/
import { NxNaturalLanguageFormModule } from '@aposin/ng-aquila/natural-language-form';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { SharedModule } from 'module/shared.module';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxTableModule } from '@aposin/ng-aquila/table';
import { NxSwipebarModule } from '@aposin/ng-aquila/swipebar';
import { NxComparisonTableModule } from '@aposin/ng-aquila/comparison-table';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';
import { NxDatefieldModule, NxNativeDateModule } from '@aposin/ng-aquila/datefield';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';


const routes: Routes = [
  {
    path: '',
    component: VehicleOwnerDetailsComponent,
  },
];

@NgModule({
  declarations: [VehicleOwnerDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    IconPopoverModule,
    ProductStageModule,
    NxNaturalLanguageFormModule,
    NxDropdownModule,
    NxFormfieldModule,
    NxIconModule,
    NdbxIconModule,
    NxProgressStepperModule,
    NxInputModule,
    NxButtonModule,
    NxModalModule,
    SharedModule,
    NxAccordionModule,
    NxTableModule,
    NxSwipebarModule,
    NxComparisonTableModule,
    AccordionIndicatorModule,
    DateFieldModule,
    NxLinkModule,
    SharedDialogModule,
    NxMomentDateModule,
    NxDatefieldModule,
    NxNativeDateModule
  ],
})
export class VehicleOwnerDetailsModule { }
