import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuotationComponent } from './quotation.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

/*---- Shared Custom Component ----*/
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { DateFieldModule } from 'module/date-field/date-field.module';

/*---- NDBX Component ----*/
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxDatefieldModule, NxNativeDateModule } from '@aposin/ng-aquila/datefield';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxMessageModule } from '@aposin/ng-aquila/message';
import { NxComparisonTableModule } from '@aposin/ng-aquila/comparison-table';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { DynamicTableModule } from '../../module/dynamic-table/dynamic-table.module';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';

const routes: Routes = [
  {
    path: '',
    component: QuotationComponent,
  },
];

@NgModule({
  declarations: [QuotationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    DynamicTableModule,
    IconPopoverModule,
    ProductStageModule,
    DateFieldModule,
    NxSpinnerModule,
    NxAccordionModule,
    NxIconModule,
    NdbxIconModule,
    NxInputModule,
    NxFormfieldModule,
    NxCheckboxModule,
    NxDatefieldModule,
    NxNativeDateModule,
    NxMaskModule,
    NxMomentDateModule,
    NxDropdownModule,
    NxMessageModule,
    NxComparisonTableModule,
    NxProgressStepperModule,
    NxButtonModule,
    NxCardModule,
    SharedDialogModule
  ],
})
export class QuotationModule { }
