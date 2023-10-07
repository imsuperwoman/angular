import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerDetailsComponent } from './customer-details.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

/*---- Shared Custom Component ----*/
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { DateFieldModule } from 'module/date-field/date-field.module';

/*---- NDBX Components ----*/
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxRadioModule } from '@aposin/ng-aquila/radio-button';
import { NxDatefieldModule, NxNativeDateModule } from '@aposin/ng-aquila/datefield';
import { NxRadioToggleModule } from '@aposin/ng-aquila/radio-toggle';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxMessageModule } from '@aposin/ng-aquila/message';
import { CustomFieldsModule } from '../../module/custom-fields/custom-fields.module';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';
import { SharedModule } from 'module/shared.module';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { GeoMapModule } from 'module/geo-map/geo-map.module';
import { TextFieldModule } from '@angular/cdk/text-field';


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
    NxIconModule,
    NdbxIconModule,
    NxFormfieldModule,
    NxInputModule,
    NxButtonModule,
    NxDropdownModule,
    NxRadioModule,
    NxDatefieldModule,
    NxRadioToggleModule,
    NxAccordionModule,
    NxCheckboxModule,
    NxNativeDateModule,
    NxMomentDateModule,
    NxMaskModule,
    NxProgressStepperModule,
    NxSpinnerModule,
    NxModalModule,
    NxMessageModule,
    CustomFieldsModule,
    DateFieldModule,
    SharedDialogModule,
    SharedModule,
    NxCardModule,
    NxGridModule,
    NxHeadlineModule,
    GeoMapModule,
    TextFieldModule
  ],
})
export class CustomerDetailsModule { }
