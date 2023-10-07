import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedLeaveDetailsComponent } from './shared-leave-details.component';
import { ReactiveFormsModule } from '@angular/forms';

/*---- Shared Custom Component ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { SharedModule } from 'module/shared.module';

/*---- NDBX Component ----*/
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxLinkModule } from '@aposin/ng-aquila/link';

@NgModule({
  declarations: [SharedLeaveDetailsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NxInputModule,
    NxFormfieldModule,
    NxButtonModule,
    ProductStageModule,
    NxDropdownModule,
    NxCheckboxModule,
    SharedModule,
    NxLinkModule,
  ],
  exports: [SharedLeaveDetailsComponent],
})
export class SharedLeaveDetailsModule { }
