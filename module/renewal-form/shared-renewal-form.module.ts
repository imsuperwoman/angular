import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedRenewalFormComponent } from './shared-renewal-form.component';

/** ndbx */
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { SharedModule } from 'module/shared.module';

@NgModule({
  declarations: [SharedRenewalFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NxDropdownModule,
    NxFormfieldModule,
    NxInputModule,
    NxCheckboxModule,
    NxLinkModule,
    NxModalModule,
    NxButtonModule,
    NxMaskModule,
    SharedModule
  ],
  exports: [SharedRenewalFormComponent]
})

export class SharedRenewalFormModule { }
