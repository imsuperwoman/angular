import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { GetInfoComponent } from './get-info.component';

/*---- Shared Custom Components ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';

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
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxLinkModule } from '@aposin/ng-aquila/link';

import { NxMomentDateModule } from '@aposin/ng-aquila/moment-date-adapter';
import { DateFieldModule } from '../../module/date-field/date-field.module';
import { SharedModule } from 'module/shared.module';
import { SpinnerOverlayModule } from 'module/spinner-overlay/spinner-overlay.module';
import { DisclosureMessageModule } from '../../module/disclosure-message/disclosure-message.module';


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
    DisclosureMessageModule,
    ReactiveFormsModule,
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
    NxHeadlineModule,
    NxLinkModule,
    DateFieldModule,
    NxCopytextModule,
    NxMomentDateModule,
    SpinnerOverlayModule,
    SharedModule
  ]
})
export class GetInfoModule { }
