import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetInfoComponent } from './get-info.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

/*---- Shared Custom Components ----*/
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { SpinnerOverlayModule } from 'module/spinner-overlay/spinner-overlay.module'
import { SharedModule } from 'module/shared.module';

/*---- NDBX Component ----*/
import { NxNaturalLanguageFormModule } from '@aposin/ng-aquila/natural-language-form';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxRadioModule } from '@aposin/ng-aquila/radio-button';
import { NxSwitcherModule } from '@aposin/ng-aquila/switcher';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { GeoMapModule } from 'module/geo-map/geo-map.module';
import { GetCodeComponent } from './geo-code.component';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { DisclosureMessageModule } from '../../module/disclosure-message/disclosure-message.module';
import { TextFieldModule } from '@angular/cdk/text-field';

const routes: Routes = [
  {
    path: '',
    component: GetInfoComponent,
  },
];

@NgModule({
  declarations: [GetInfoComponent, GetCodeComponent],
  imports: [
    CommonModule,
    DisclosureMessageModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    IconPopoverModule,
    ProductStageModule,
    NxNaturalLanguageFormModule,
    NxDropdownModule,
    NxFormfieldModule,
    NxIconModule,
    NdbxIconModule,
    NxCardModule,
    NxRadioModule,
    NxSwitcherModule,
    NxProgressStepperModule,
    NxInputModule,
    NxButtonModule,
    NxModalModule,
    SpinnerOverlayModule,
    SharedModule,
    SharedDialogModule,
    GeoMapModule,
    NxGridModule,
    NxCheckboxModule,
    TextFieldModule
  ]
})
export class GetInfoModule { }
