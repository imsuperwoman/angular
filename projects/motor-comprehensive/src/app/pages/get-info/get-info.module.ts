import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { GetInfoComponent } from './get-info.component';

/*---- Shared Custom Components ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';
import { AgentRequiredDialogModule } from 'module/agent-required-dialog/agent-required-dialog.module';

/*---- NDBX Component ----*/
import { NxNaturalLanguageFormModule } from '@aposin/ng-aquila/natural-language-form';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { SharedModule } from 'module/shared.module';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { DisclosureMessageModule } from '../../module/disclosure-message/disclosure-message.module';
import { NxCardModule } from '@aposin/ng-aquila/card'; 
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxListModule } from '@aposin/ng-aquila/list';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxHeaderModule } from '@aposin/ng-aquila/header';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
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
    ProductStageModule,
    NxNaturalLanguageFormModule,
    NxDropdownModule,
    NxFormfieldModule,
    NxIconModule,
    NdbxIconModule,
    NxProgressStepperModule,
    NxInputModule,
    NxButtonModule,
    SharedModule,
    DisclosureMessageModule,
    NxCheckboxModule,
    NxErrorModule,
    NxModalModule,
    SharedDialogModule,
    AgentRequiredDialogModule,
    NxMaskModule,NxCardModule,NxGridModule,NxListModule,NxHeadlineModule,NxHeaderModule,NxPopoverModule
  ],
})
export class GetInfoModule { }
